// TVlive-debug-v2.js
// 说明：
// 1. 输入 M3U 订阅链接
// 2. 支持全局自定义 User-Agent / Referer / Origin
// 3. 支持解析频道级 #EXTVLCOPT:http-user-agent / http-referrer / http-origin
// 4. 频道级 headers 优先级高于全局 headers
// 5. 支持调试日志，方便排查“被导到兜底流”这类问题
// 6. 仅保留核心播放能力，不做分组、台标、过滤等额外功能

WidgetMetadata = {
  id: "TVlive",
  title: "TVlive-debug-v2",
  detailCacheDuration: 60,
  modules: [
    {
      title: "TVlive-debug-v2",
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
          title: "全局 User-Agent（选填）",
          type: "input",
          description: "留空则使用默认 TVlive-debug-v2/1.0.0；如频道内存在 #EXTVLCOPT:http-user-agent，则频道级优先",
          value: "TVlive-debug-v2/1.0.0",
          placeholders: [
            { title: "默认", value: "TVlive-debug-v2/1.0.0" },
            { title: "APT V / okHttp", value: "okHttp/Mod-1.5.0.0" },
            { title: "iPhone Safari", value: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1" },
            { title: "VLC", value: "VLC/3.0.20 LibVLC/3.0.20" }
          ]
        },
        {
          name: "referer",
          title: "全局 Referer（选填）",
          type: "input",
          description: "如频道内存在 #EXTVLCOPT:http-referrer，则频道级优先；留空则默认不传",
          value: "",
          placeholders: [
            { title: "不填写", value: "" },
            { title: "示例主页", value: "https://example.com/" }
          ]
        },
        {
          name: "origin",
          title: "全局 Origin（选填）",
          type: "input",
          description: "如频道内存在 #EXTVLCOPT:http-origin，则频道级优先；留空则默认不传",
          value: "",
          placeholders: [
            { title: "不填写", value: "" },
            { title: "示例站点", value: "https://example.com" }
          ]
        },
        {
          name: "disable_referer",
          title: "是否禁用 Referer",
          type: "enumeration",
          description: "默认禁用，避免错误 Referer 反而导致播放失败；如果频道级或全局 Referer 必须带，请改为“false”",
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
  version: "2.0.0",
  requiredVersion: "0.0.1",
  description: "极简调试版电视直播插件 v2：支持频道级 EXTVLCOPT 请求头解析",
  author: "huangxd & Copilot",
  site: "https://github.com/MrWin79/ForwardWidgets"
};

const DEFAULT_USER_AGENT = "TVlive-debug-v2/1.0.0";

// 全局默认配置（由参数决定）
let CURRENT_USER_AGENT = DEFAULT_USER_AGENT;
let CURRENT_REFERER = "";
let CURRENT_ORIGIN = "";
let CURRENT_DISABLE_REFERER = true;
let CURRENT_DEBUG_MODE = true;

// 频道级 headers 映射：key 使用 streamUrl
let CHANNEL_HEADERS_MAP = {};

function debugLog(...args) {
  if (CURRENT_DEBUG_MODE) {
    console.log(...args);
  }
}

function normalizeUserAgent(ua) {
  const value = String(ua || "").trim();
  return value || DEFAULT_USER_AGENT;
}

function normalizeReferer(referer) {
  return String(referer || "").trim();
}

function normalizeOrigin(origin) {
  return String(origin || "").trim();
}

function toBool(value, defaultValue = false) {
  const text = String(value == null ? "" : value).trim().toLowerCase();
  if (text === "true") return true;
  if (text === "false") return false;
  return defaultValue;
}

function getExtVlcOptValue(line, key) {
  const prefix = `#EXTVLCOPT:${key}=`;
  if (line.startsWith(prefix)) {
    return line.slice(prefix.length).trim();
  }
  return "";
}

function buildHeadersForChannel(channelHeaders = {}) {
  const headers = {
    "User-Agent": normalizeUserAgent(channelHeaders.userAgent || CURRENT_USER_AGENT)
  };

  const finalReferer = normalizeReferer(channelHeaders.referer || CURRENT_REFERER);
  const finalOrigin = normalizeOrigin(channelHeaders.origin || CURRENT_ORIGIN);

  // Referer 默认可禁用；Origin 不受 disable_referer 控制
  if (!CURRENT_DISABLE_REFERER && finalReferer) {
    headers["Referer"] = finalReferer;
  }

  if (finalOrigin) {
    headers["Origin"] = finalOrigin;
  }

  return headers;
}

async function loadTVLiveItems(params = {}) {
  try {
    const url = String(params.url || "").trim();
    const userAgent = normalizeUserAgent(params.user_agent);
    const referer = normalizeReferer(params.referer);
    const origin = normalizeOrigin(params.origin);
    const disableReferer = toBool(params.disable_referer, true);
    const debugMode = toBool(params.debug_mode, true);

    CURRENT_USER_AGENT = userAgent;
    CURRENT_REFERER = referer;
    CURRENT_ORIGIN = origin;
    CURRENT_DISABLE_REFERER = disableReferer;
    CURRENT_DEBUG_MODE = debugMode;
    CHANNEL_HEADERS_MAP = {};

    if (!url) {
      throw new Error("必须提供电视直播订阅链接");
    }

    debugLog("[TVlive-debug-v2] 订阅链接:", url);
    debugLog("[TVlive-debug-v2] 全局 User-Agent:", CURRENT_USER_AGENT);
    debugLog("[TVlive-debug-v2] 全局 Referer:", CURRENT_REFERER || "<空>");
    debugLog("[TVlive-debug-v2] 全局 Origin:", CURRENT_ORIGIN || "<空>");
    debugLog("[TVlive-debug-v2] 是否禁用 Referer:", CURRENT_DISABLE_REFERER);

    const requestHeaders = buildHeadersForChannel({});
    debugLog("[TVlive-debug-v2] 请求 M3U 使用的 headers:", JSON.stringify(requestHeaders));

    const m3uContent = await fetchM3UContent(url, requestHeaders);
    if (!m3uContent) return [];

    const items = parseM3UContent(m3uContent);
    debugLog("[TVlive-debug-v2] 解析出的频道数量:", items.length);
    debugLog("[TVlive-debug-v2] 频道级 headers 数量:", Object.keys(CHANNEL_HEADERS_MAP).length);

    return items;
  } catch (error) {
    console.error(`[TVlive-debug-v2] 解析电视直播链接时出错: ${error.message}`);
    return [];
  }
}

async function fetchM3UContent(url, headers = {}) {
  try {
    const response = await Widget.http.get(url, { headers });
    const data = typeof response?.data === "string" ? response.data : "";

    debugLog("[TVlive-debug-v2] M3U 响应长度:", data.length);

    if (data && data.includes("#EXTINF")) {
      return data;
    }

    debugLog("[TVlive-debug-v2] 返回内容不包含 #EXTINF，可能不是有效的 M3U");
    return null;
  } catch (error) {
    console.error(`[TVlive-debug-v2] 获取 M3U 内容时出错: ${error.message}`);
    return null;
  }
}

function parseM3UContent(content) {
  if (!content || !String(content).trim()) return [];

  const lines = String(content).split(/\r?\n/);
  const items = [];
  const seen = new Set();

  let currentTitle = null;
  let currentChannelHeaders = {
    userAgent: "",
    referer: "",
    origin: ""
  };

  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();
    if (!line || line.startsWith("#EXTM3U")) continue;

    // 解析频道标题
    if (line.startsWith("#EXTINF:")) {
      const commaIndex = line.indexOf(",");
      currentTitle = commaIndex !== -1
        ? line.slice(commaIndex + 1).trim()
        : "未知频道";

      // 新频道开始时，先重置频道级 headers
      currentChannelHeaders = {
        userAgent: "",
        referer: "",
        origin: ""
      };
      continue;
    }

    // 解析频道级 EXTVLCOPT
    if (currentTitle && line.startsWith("#EXTVLCOPT:")) {
      const userAgent = getExtVlcOptValue(line, "http-user-agent");
      const referer = getExtVlcOptValue(line, "http-referrer");
      const origin = getExtVlcOptValue(line, "http-origin");

      if (userAgent) {
        currentChannelHeaders.userAgent = userAgent;
        debugLog(`[TVlive-debug-v2] 频道 ${currentTitle} 命中频道级 UA:`, userAgent);
      }
      if (referer) {
        currentChannelHeaders.referer = referer;
        debugLog(`[TVlive-debug-v2] 频道 ${currentTitle} 命中频道级 Referer:`, referer);
      }
      if (origin) {
        currentChannelHeaders.origin = origin;
        debugLog(`[TVlive-debug-v2] 频道 ${currentTitle} 命中频道级 Origin:`, origin);
      }
      continue;
    }

    // URL 行
    if (currentTitle && !line.startsWith("#")) {
      const streamUrl = line;
      const channelHeaders = {
        userAgent: currentChannelHeaders.userAgent || "",
        referer: currentChannelHeaders.referer || "",
        origin: currentChannelHeaders.origin || ""
      };

      CHANNEL_HEADERS_MAP[streamUrl] = channelHeaders;

      if (!seen.has(streamUrl)) {
        items.push({
          id: streamUrl,
          type: "url",
          title: currentTitle,
          link: streamUrl,
          playerType: "system"
        });
        seen.add(streamUrl);
      }

      debugLog(`[TVlive-debug-v2] 频道 ${currentTitle} 最终关联的 headers:`, JSON.stringify(buildHeadersForChannel(channelHeaders)));

      currentTitle = null;
      currentChannelHeaders = {
        userAgent: "",
        referer: "",
        origin: ""
      };
    }
  }

  return items;
}

async function loadDetail(link) {
  const channelHeaders = CHANNEL_HEADERS_MAP[link] || {};
  const headers = buildHeadersForChannel(channelHeaders);

  debugLog("[TVlive-debug-v2] 播放地址:", link);
  debugLog("[TVlive-debug-v2] 命中的频道级 headers:", JSON.stringify(channelHeaders));
  debugLog("[TVlive-debug-v2] 播放最终使用的 headers:", JSON.stringify(headers));

  return {
    id: link,
    type: "detail",
    videoUrl: link,
    customHeaders: headers,
    playerType: "system",
    childItems: []
  };
}
