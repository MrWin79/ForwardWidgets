code = r'''// TVlive-debug.js
// 说明：
// 1. 输入 M3U 订阅链接
// 2. 支持自定义 User-Agent
// 3. 支持自定义 Referer（可关闭）
// 4. 支持调试日志，方便排查 "APT V 能播，Forward 不能播" 这类问题
// 5. 仅保留核心播放能力，不做分组、台标、过滤等额外功能

WidgetMetadata = {
  id: "TVlive",
  title: "TVlive-debug",
  detailCacheDuration: 60,
  modules: [
    {
      title: "TVlive-debug",
      requiresWebView: false,
      functionName: "loadTVLiveItems",
      cacheDuration: 21600,
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
          description: "留空则使用默认 TVlive-debug/1.0.0；直接填写 UA 字符串本体即可",
          value: "TVlive-debug/1.0.0",
          placeholders: [
            {
              title: "默认",
              value: "TVlive-debug/1.0.0"
            },
            {
              title: "APT V / okHttp",
              value: "okHttp/Mod-1.5.0.0"
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
        },
        {
          name: "referer",
          title: "自定义 Referer（选填）",
          type: "input",
          description: "某些源除 UA 外还会校验 Referer；留空则默认不传自定义 Referer",
          value: "",
          placeholders: [
            {
              title: "不填写",
              value: ""
            },
            {
              title: "示例主页",
              value: "https://example.com/"
            }
          ]
        },
        {
          name: "disable_referer",
          title: "是否禁用 Referer",
          type: "enumeration",
          description: "默认禁用，避免错误 Referer 反而导致播放失败",
          value: "true",
          enumOptions: [
            { title: "禁用 Referer（推荐）", value: "true" },
            { title: "启用 Referer", value: "false" }
          ]
        },
        {
          name: "debug_mode",
          title: "调试日志",
          type: "enumeration",
          description: "开启后会输出更多日志，方便排查问题",
          value: "true",
          enumOptions: [
            { title: "开启", value: "true" },
            { title: "关闭", value: "false" }
          ]
        }
      ]
    }
  ],
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "极简调试版电视直播插件：支持自定义 UA / Referer / 调试日志",
  author: "huangxd & Copilot",
  site: "https://github.com/MrWin79/ForwardWidgets"
};

// 默认 User-Agent
const DEFAULT_USER_AGENT = "TVlive-debug/1.0.0";

// 使用全局变量保存当前会话的配置，方便在 loadDetail() 中继续使用
let CURRENT_USER_AGENT = DEFAULT_USER_AGENT;
let CURRENT_REFERER = "";
let CURRENT_DISABLE_REFERER = true;
let CURRENT_DEBUG_MODE = true;

function debugLog(...args) {
  if (CURRENT_DEBUG_MODE) {
    console.log(...args);
  }
}

/**
 * 规范化 User-Agent
 */
function normalizeUserAgent(ua) {
  const value = String(ua || "").trim();
  return value || DEFAULT_USER_AGENT;
}

/**
 * 规范化 Referer
 */
function normalizeReferer(referer) {
  return String(referer || "").trim();
}

/**
 * 将枚举字符串转为布尔值
 */
function toBool(value, defaultValue = false) {
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (text === "true") return true;
  if (text === "false") return false;
  return defaultValue;
}

/**
 * 主入口
 * 1. 读取参数
 * 2. 拉取 M3U
 * 3. 解析频道列表
 */
async function loadTVLiveItems(params = {}) {
  try {
    const url = String(params.url || "").trim();
    const userAgent = normalizeUserAgent(params.user_agent);
    const referer = normalizeReferer(params.referer);
    const disableReferer = toBool(params.disable_referer, true);
    const debugMode = toBool(params.debug_mode, true);

    // 保存到全局，供 loadDetail() 使用
    CURRENT_USER_AGENT = userAgent;
    CURRENT_REFERER = referer;
    CURRENT_DISABLE_REFERER = disableReferer;
    CURRENT_DEBUG_MODE = debugMode;

    if (!url) {
      throw new Error("必须提供电视直播订阅链接");
    }

    debugLog("[TVlive-debug] 订阅链接:", url);
    debugLog("[TVlive-debug] 拉取 M3U 的 User-Agent:", CURRENT_USER_AGENT);
    debugLog("[TVlive-debug] 自定义 Referer:", CURRENT_REFERER || "<空>");
    debugLog("[TVlive-debug] 是否禁用 Referer:", CURRENT_DISABLE_REFERER);

    const m3uContent = await fetchM3UContent(url, CURRENT_USER_AGENT, CURRENT_REFERER, CURRENT_DISABLE_REFERER);
    if (!m3uContent) return [];

    const items = parseM3UContent(m3uContent);
    debugLog("[TVlive-debug] 解析出的频道数量:", items.length);

    return items;
  } catch (error) {
    console.error(`[TVlive-debug] 解析电视直播链接时出错: ${error.message}`);
    return [];
  }
}

/**
 * 拉取 M3U 内容
 */
async function fetchM3UContent(url, userAgent = DEFAULT_USER_AGENT, referer = "", disableReferer = true) {
  try {
    const headers = {
      "User-Agent": normalizeUserAgent(userAgent)
    };

    if (!disableReferer && normalizeReferer(referer)) {
      headers["Referer"] = normalizeReferer(referer);
    }

    debugLog("[TVlive-debug] 请求 M3U 使用的 headers:", JSON.stringify(headers));

    const response = await Widget.http.get(url, { headers });
    const data = typeof response?.data === "string" ? response.data : "";

    debugLog("[TVlive-debug] M3U 响应长度:", data.length);

    if (data && data.includes("#EXTINF")) {
      return data;
    }

    debugLog("[TVlive-debug] 返回内容不包含 #EXTINF，可能不是有效的 M3U");
    return null;
  } catch (error) {
    console.error(`[TVlive-debug] 获取 M3U 内容时出错: ${error.message}`);
    return null;
  }
}

/**
 * 解析 M3U
 * 仅保留最核心逻辑：
 * - #EXTINF 行提取频道名称
 * - 下一行提取播放地址
 */
function parseM3UContent(content) {
  if (!content || !String(content).trim()) return [];

  const lines = String(content).split(/\r?\n/);
  const items = [];
  const seen = new Set();
  let currentTitle = null;

  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();

    if (!line || line.startsWith("#EXTM3U")) continue;

    if (line.startsWith("#EXTINF:")) {
      const commaIndex = line.indexOf(",");
      currentTitle = commaIndex !== -1
        ? line.slice(commaIndex + 1).trim()
        : "未知频道";
      continue;
    }

    if (currentTitle && !line.startsWith("#")) {
      // 以 link 去重，避免源里有重复项
      if (!seen.has(line)) {
        items.push({
          id: line,
          type: "url",
          title: currentTitle,
          link: line,
          playerType: "system"
        });
        seen.add(line);
      }
      currentTitle = null;
    }
  }

  return items;
}

/**
 * 进入播放时返回播放对象
 * 这里尽量减少干扰：
 * - 默认只传 User-Agent
 * - Referer 默认禁用，只有明确开启且填写时才传
 */
async function loadDetail(link) {
  const headers = {
    "User-Agent": CURRENT_USER_AGENT
  };

  if (!CURRENT_DISABLE_REFERER && normalizeReferer(CURRENT_REFERER)) {
    headers["Referer"] = normalizeReferer(CURRENT_REFERER);
  }

  debugLog("[TVlive-debug] 播放地址:", link);
  debugLog("[TVlive-debug] 播放使用的 headers:", JSON.stringify(headers));

  return {
    id: link,
    type: "detail",
    videoUrl: link,
    customHeaders: headers,
    playerType: "system",
    childItems: []
  };
}
'''
with open('/mnt/data/TVlive-debug.js', 'w', encoding='utf-8') as f:
    f.write(code)
print('written', len(code))
