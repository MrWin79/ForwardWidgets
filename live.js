// TVlive 极简版电视直播插件
// 功能说明：
// 1. 输入一个 M3U 订阅链接
// 2. 可选输入自定义 User-Agent
// 3. 解析频道列表并直接播放
// 4. 不包含分组、过滤、台标、背景色、方向等额外功能

WidgetMetadata = {
  id: "TVlive", // 插件唯一 ID
  title: "TVlive", // 插件名称
  detailCacheDuration: 60, // 详情缓存时长（秒）
  modules: [
    {
      title: "TVlive",
      requiresWebView: false, // 不需要网页视图
      functionName: "loadTVLiveItems", // 列表加载函数
      cacheDuration: 21600, // 列表缓存时长（6小时）
      params: [
        {
          name: "url",
          title: "订阅链接",
          type: "input",
          description: "请输入直播订阅链接（M3U 格式）",
          placeholders: [
            {
              title: "示例",
              value: "https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u"
            }
          ]
        },
        {
          name: "user_agent",
          title: "自定义 User-Agent（选填）",
          type: "input",
          description: "留空则使用默认 TVlive/1.0.0；直接填写 UA 字符串本体即可",
          value: "TVlive/1.0.0",
          placeholders: [
            {
              title: "默认",
              value: "TVlive/1.0.0"
            },
            {
              title: "iPhone Safari",
              value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
            },
            {
              title: "VLC",
              value: "VLC/3.0.20 LibVLC/3.0.20"
            }
          ]
        }
      ]
    }
  ],
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "极简电视直播插件，仅保留订阅链接播放和自定义 UA 功能",
  author: "Win",
  site: "https://github.com/MrWin79/ForwardWidgets"
};

// 默认 User-Agent
const DEFAULT_USER_AGENT = "TVlive/1.0.0";

// 当前使用的 User-Agent
// 这里用一个全局变量保存，方便在 loadDetail() 播放时继续复用
let CURRENT_USER_AGENT = DEFAULT_USER_AGENT;

/**
 * 规范化 User-Agent
 * - 如果用户没有填，自动回退到默认值
 * - 只接收纯字符串，不做复杂解析
 */
function normalizeUserAgent(ua) {
  const value = String(ua || "").trim();
  return value || DEFAULT_USER_AGENT;
}

/**
 * 主入口函数
 * 功能：
 * 1. 读取订阅链接和自定义 UA
 * 2. 拉取 M3U 内容
 * 3. 解析为频道列表
 * 4. 返回给 Forward 展示
 */
async function loadTVLiveItems(params = {}) {
  try {
    // 读取参数
    const url = String(params.url || "").trim();
    const userAgent = normalizeUserAgent(params.user_agent);

    // 记录当前 UA，供 loadDetail() 播放时使用
    CURRENT_USER_AGENT = userAgent;

    // 必填校验：必须有订阅链接
    if (!url) {
      throw new Error("必须提供电视直播订阅链接");
    }

    // 拉取 M3U 文件内容
    const m3uContent = await fetchM3UContent(url, userAgent);
    if (!m3uContent) return [];

    // 解析频道列表
    const items = parseM3UContent(m3uContent);

    // 返回频道列表
    return items;
  } catch (error) {
    console.error(`解析电视直播链接时出错: ${error.message}`);
    return [];
  }
}

/**
 * 拉取 M3U 内容
 * @param {string} url - 订阅链接
 * @param {string} userAgent - 自定义 User-Agent
 * @returns {string|null} - 成功返回 M3U 文本，失败返回 null
 */
async function fetchM3UContent(url, userAgent = DEFAULT_USER_AGENT) {
  try {
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": normalizeUserAgent(userAgent)
      }
    });

    // Forward 返回的数据一般在 response.data 中
    const data = typeof response?.data === "string" ? response.data : "";

    // 简单判断：M3U 通常包含 #EXTINF
    if (data && data.includes("#EXTINF")) {
      return data;
    }

    return null;
  } catch (error) {
    console.error(`获取 M3U 内容时出错: ${error.message}`);
    return null;
  }
}

/**
 * 解析 M3U 内容
 * 这里只保留最核心的逻辑：
 * - 读取 #EXTINF 行中的频道名称
 * - 读取下一行的播放地址
 * - 生成最简可播放条目
 *
 * @param {string} content - M3U 文件文本
 * @returns {Array} - 频道列表
 */
function parseM3UContent(content) {
  if (!content || !String(content).trim()) return [];

  const lines = String(content).split(/\r?\n/);
  const items = [];
  let currentTitle = null;

  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();

    // 跳过空行和 M3U 文件头
    if (!line || line.startsWith("#EXTM3U")) continue;

    // 解析频道标题
    // M3U 典型格式：
    // #EXTINF:-1,频道名称
    if (line.startsWith("#EXTINF:")) {
      const commaIndex = line.indexOf(",");
      currentTitle = commaIndex !== -1
        ? line.slice(commaIndex + 1).trim()
        : "未知频道";
      continue;
    }

    // 如果当前已经读到频道名，而这一行又不是注释，
    // 那通常它就是该频道的播放地址
    if (currentTitle && !line.startsWith("#")) {
      items.push({
        id: line,              // 用播放地址作为唯一 ID
        type: "url",           // Forward 可直接识别的 URL 类型
        title: currentTitle,   // 频道名称
        link: line,            // 播放地址
        playerType: "system"   // 使用系统播放器
      });

      // 重置，继续解析下一个频道
      currentTitle = null;
    }
  }

  return items;
}

/**
 * 频道详情页 / 播放入口
 * Forward 点击条目后会进入这里
 *
 * 这里直接返回 videoUrl 即可播放
 * 同时把自定义 User-Agent 一并带上
 *
 * @param {string} link - 播放地址
 * @returns {Object} - 播放详情对象
 */
async function loadDetail(link) {
  return {
    id: link,
    type: "detail",
    videoUrl: link,
    customHeaders: {
      "Referer": link,
      "User-Agent": CURRENT_USER_AGENT
    },
    playerType: "system",
    childItems: []
  };
}
