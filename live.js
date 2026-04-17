// 电视直播插件（极致优化防闪退版）
WidgetMetadata = {
  id: "live",
  title: "直播(电视+网络)",
  detailCacheDuration: 60,
  modules: [
    {
      title: "直播(电视+网络)",
      requiresWebView: false,
      functionName: "loadLiveItems",
      cacheDuration: 21600,
      params: [
        {
          name: "url",
          title: "订阅链接",
          type: "input",
          description: "输入直播订阅链接地址",
          placeholders: [
            { title: "Kimentanm", value: "https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u" },
            { title: "网络直播", value: "https://tv.iill.top/m3u/Live" },
            { title: "smart(港澳台)", value: "https://smart.pendy.dpdns.org/m3u/merged_judy.m3u" },
            { title: "全球", value: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8" },
            { title: "IPTV2-CN", value: "https://iptv-org.github.io/iptv/countries/cn.m3u" }
            // ... 省略部分过长的 placeholders 避免冗长，你可以自行加回原来完整的列表 ...
          ]
        },
        {
          name: "group_filter",
          title: "按组关键字过滤(选填)",
          type: "input",
          description: "输入组关键字，如央视，会筛选出所有包含央视的频道",
          placeholders: [
            { title: "全部", value: "" },
            { title: "央视&卫视", value: ".*(央视|卫视).*" },
            { title: "央视", value: "央视" }
          ]
        },
        {
          name: "name_filter",
          title: "按频道名关键字过滤(选填)",
          type: "input",
          description: "输入频道名关键字过滤(选填)",
          placeholders: [
            { title: "全部", value: "" },
            { title: "B站&虎牙&斗鱼", value: ".*(B站|虎牙|斗鱼).*" }
          ]
        },
        {
          name: "bg_color",
          title: "台标背景色",
          type: "input",
          description: "支持RGB颜色，如DCDCDC",
          value: "DCDCDC",
          placeholders: [
            { title: "亮灰色", value: "DCDCDC" },
            { title: "钢蓝", value: "4682B4" }
          ]
        },
        {
          name: "direction",
          title: "台标优先显示方向",
          type: "enumeration",
          description: "台标优先显示方向，默认为竖向",
          value: "V",
          enumOptions: [
            { title: "竖向", value: "V" },
            { title: "横向", value: "H" }
          ]
        }
      ]
    }
  ],
  version: "1.2.0",
  requiredVersion: "0.0.1",
  description: "解析直播订阅链接【内存极致优化版/防闪退】",
  author: "huangxd / extremely optimized",
  site: "https://github.com/huangxd-/ForwardWidgets"
};

/**
 * =========================
 * 可调配置
 * =========================
 */
const DEBUG = false;

// 防闪退核心配置：限制最大输出条目，防止 JS Bridge payload 过大导致 APP OOM 崩溃
const MAX_RETURN_ITEMS = 2000; 

const HEADER_MODE = "ua_only";
const ICON_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_UA = "okHttp/Mod-1.5.0.0";

let _iconCache = { set: null, timestamp: 0 };

function debugLog(...args) {
  if (DEBUG) console.log(...args);
}

function safeString(v) {
  return (v == null ? "" : String(v)).trim();
}

function normalizeColor(v, fallback = "DCDCDC") {
  const s = safeString(v).replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(s) ? s.toUpperCase() : fallback;
}

function safeArray(v) {
  return Array.isArray(v) ? v : [];
}

function buildStableId(group, title, url) {
  return `${safeString(group)}::${safeString(title)}::${safeString(url)}`;
}

function compileFilter(filterText) {
  const raw = safeString(filterText);
  if (!raw) return null;
  try {
    const regex = new RegExp(raw, "i");
    return (value) => regex.test(safeString(value));
  } catch (e) {
    const lower = raw.toLowerCase();
    return (value) => safeString(value).toLowerCase().includes(lower);
  }
}

function createPosterIcon(channelName, bgColor) {
  return `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_3.5,h-bh_mul_3,bg-${bgColor},lfo-center,l-image,i-${channelName}.png,lfo-center,l-end,l-end/${channelName}.png`;
}

function createBackdropIcon(channelName, bgColor) {
  return `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_1.5,h-bh_mul_4,bg-${bgColor},lfo-center,l-image,i-${channelName}.png,lfo-center,l-end,l-end/${channelName}.png`;
}

// 高效字符串提取，替代耗时正则，大幅降低内存分配
function extractAttribute(str, key) {
  const prefix = key + '="';
  const startIdx = str.indexOf(prefix);
  if (startIdx === -1) return "";
  const valueStart = startIdx + prefix.length;
  const valueEnd = str.indexOf('"', valueStart);
  if (valueEnd === -1) return "";
  return str.substring(valueStart, valueEnd);
}

async function loadLiveItems(params = {}) {
  try {
    const url = safeString(params.url);
    const groupFilter = safeString(params.group_filter);
    const nameFilter = safeString(params.name_filter);
    const bgColor = normalizeColor(params.bg_color || "DCDCDC");
    const direction = safeString(params.direction || "V") || "V";

    if (!url) throw new Error("必须提供电视直播订阅链接");

    const groupMatcher = compileFilter(groupFilter);
    const nameMatcher = compileFilter(nameFilter);

    // 获取M3U文本
    const responseText = await fetchM3UContent(url);
    if (!responseText) return [];

    // 获取图标（不阻塞主逻辑，如果失败就用空集）
    const iconSet = await fetchIconSet();

    // 解析与过滤合并，防爆内存
    const items = parseM3UContent(responseText, iconSet, bgColor, direction, groupMatcher, nameMatcher);

    const totalCount = items.length;
    // 添加序号，避免再次使用 map 分配新数组
    for (let i = 0; i < totalCount; i++) {
      items[i].title = `${items[i].title} (${i + 1}/${totalCount})`;
    }

    return items;
  } catch (error) {
    console.error(`解析电视直播链接出错: ${error.message}`);
    return [];
  }
}

async function fetchM3UContent(url) {
  try {
    const response = await Widget.http.get(url, { headers: { "User-Agent": DEFAULT_UA } });
    const data = typeof response?.data === "string" ? response.data : "";
    if (data && data.includes("#EXTINF")) return data;
    return null;
  } catch (error) {
    console.error(`获取M3U内容出错: ${error.message}`);
    return null;
  }
}

async function fetchIconSet() {
  try {
    const now = Date.now();
    if (_iconCache.set && (now - _iconCache.timestamp < ICON_CACHE_TTL_MS)) {
      return _iconCache.set;
    }
    const response = await Widget.http.get("https://api.github.com/repos/fanmingming/live/contents/tv", {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": DEFAULT_UA
      }
    });
    const data = safeArray(response?.data);
    const iconSet = new Set();
    for (let i = 0; i < data.length; i++) {
      if (data[i] && data[i].name) {
        iconSet.add(data[i].name.replace(/\.png$/i, ""));
      }
    }
    _iconCache = { set: iconSet, timestamp: now };
    return iconSet;
  } catch (error) {
    return new Set();
  }
}

function parseM3UContent(content, iconSet, bgColor, direction, groupMatcher, nameMatcher) {
  if (!content) return [];

  const items = [];
  const dedupeSet = new Set();
  let currentItem = null;

  // 使用 \n 切割比 \r?\n 快，且能处理大部分情况
  const lines = content.split('\n');
  const len = lines.length;

  for (let i = 0; i < len; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#EXTM3U")) continue;

    if (line.startsWith("#EXTINF:")) {
      const commaIdx = line.indexOf(',');
      if (commaIdx === -1) {
        currentItem = null;
        continue;
      }
      
      const title = line.substring(commaIdx + 1).trim() || "未命名频道";
      const attrsStr = line.substring(8, commaIdx);

      const group = extractAttribute(attrsStr, "group-title") || "未分类";
      
      // 提早过滤，如果不匹配直接丢弃，不分配后续对象的内存 (防闪退关键)
      if (groupMatcher && !groupMatcher(group)) {
        currentItem = null;
        continue; 
      }
      if (nameMatcher && !nameMatcher(title)) {
        currentItem = null;
        continue;
      }

      currentItem = {
        title: title,
        group: group,
        tvgName: extractAttribute(attrsStr, "tvg-name") || title,
        tvgId: extractAttribute(attrsStr, "tvg-id"),
        cover: extractAttribute(attrsStr, "tvg-logo")
      };
      continue;
    }

    if (currentItem && !line.startsWith("#")) {
      const url = line;
      
      // 生成防重ID
      const itemId = buildStableId(currentItem.group, currentItem.title, url);
      if (dedupeSet.has(itemId)) {
        currentItem = null;
        continue;
      }
      dedupeSet.add(itemId);

      // 图标匹配简化逻辑
      let matchedIconName = "";
      const candidates = [currentItem.title, currentItem.tvgName, currentItem.tvgId];
      for (let c = 0; c < candidates.length; c++) {
        if (candidates[c] && iconSet.has(candidates[c])) {
          matchedIconName = candidates[c];
          break;
        }
      }

      const hasIcon = !!matchedIconName;
      const posterIcon = hasIcon ? createPosterIcon(matchedIconName, bgColor) : "";
      const backdropIcon = hasIcon ? createBackdropIcon(matchedIconName, bgColor) : "";

      const defaultImg = "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png";
      const finalPosterPath = (direction === "V" || !direction) 
        ? (posterIcon || currentItem.cover || defaultImg)
        : (currentItem.cover || posterIcon || defaultImg);

      items.push({
        id: itemId,
        type: "url",
        title: currentItem.title,
        backdropPath: backdropIcon || currentItem.cover || "https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png",
        previewUrl: "",
        link: url,
        playerType: "system",
        metadata: {
          group: currentItem.group,
          tvgName: currentItem.tvgName,
          tvgId: currentItem.tvgId
        },
        posterPath: finalPosterPath
      });

      currentItem = null;

      // 熔断机制：达到最大条目数后停止解析，保护APP不被撑爆 (防闪退关键)
      if (items.length >= MAX_RETURN_ITEMS) {
        debugLog(`已达到最大列表加载数限制: ${MAX_RETURN_ITEMS}，终止解析防止崩溃`);
        break;
      }
    }
  }

  // 清理内存
  dedupeSet.clear();
  return items;
}

function buildHeadersForLink(link) {
  if (HEADER_MODE === "ua_only") {
    return { "User-Agent": DEFAULT_UA };
  }
  const headers = { "User-Agent": DEFAULT_UA };
  try {
    const origin = new URL(link).origin;
    if (HEADER_MODE === "origin") {
      headers["Referer"] = `${origin}/`;
      headers["Origin"] = origin;
    } else if (HEADER_MODE === "link") {
      headers["Referer"] = link;
      headers["Origin"] = origin;
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

async function loadDetail(link) {
  const videoUrl = safeString(link);
  const headers = buildHeadersForLink(videoUrl);
  return {
    id: videoUrl,
    type: "detail",
    videoUrl: videoUrl,
    customHeaders: headers,
    playerType: "system",
    childItems: []
  };
}
