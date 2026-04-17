// 电视直播插件（极限内存防御 + 播放防闪退完美版）
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
            { title: "IPTV2-CN", value: "https://iptv-org.github.io/iptv/countries/cn.m3u" }
          ]
        },
        {
          name: "group_filter",
          title: "按组关键字过滤(选填)",
          type: "input",
          description: "输入组关键字，如央视",
          placeholders: [
            { title: "全部", value: "" },
            { title: "央视", value: "央视" }
          ]
        },
        {
          name: "name_filter",
          title: "按频道名关键字过滤(选填)",
          type: "input",
          description: "输入频道名关键字过滤(选填)",
          placeholders: [
            { title: "全部", value: "" }
          ]
        },
        {
          name: "bg_color",
          title: "台标背景色",
          type: "input",
          value: "DCDCDC"
        },
        {
          name: "direction",
          title: "台标优先显示方向",
          type: "enumeration",
          value: "V",
          enumOptions: [
            { title: "竖向", value: "V" },
            { title: "横向", value: "H" }
          ]
        }
      ]
    }
  ],
  version: "1.4.0",
  requiredVersion: "0.0.1",
  description: "修复底层播放器崩溃问题，内存极限优化",
  author: "huangxd / optimized"
};

const DEBUG = false;
// 列表渲染限制，防止 Native UI 渲染崩溃
const MAX_RETURN_ITEMS = 500; 

const HEADER_MODE = "ua_only";
const ICON_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_UA = "okHttp/Mod-1.5.0.0";

let _iconCache = { set: null, timestamp: 0 };

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

    const responseText = await fetchM3UContent(url);
    if (!responseText) return [];

    const iconSet = await fetchIconSet();

    const items = parseM3UContent(responseText, iconSet, bgColor, direction, groupMatcher, nameMatcher);

    const totalCount = items.length;
    for (let i = 0; i < totalCount; i++) {
      items[i].title = `${items[i].title} (${i + 1}/${totalCount})`;
    }

    return items;
  } catch (error) {
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
      headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": DEFAULT_UA }
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

  let cursor = 0;
  const len = content.length;

  // 极限优化：使用游标逐行扫描，绝不使用 split() 创建大数组
  while (cursor < len) {
    let nextNewline = content.indexOf('\n', cursor);
    if (nextNewline === -1) nextNewline = len;

    let line = content.substring(cursor, nextNewline).trim();
    cursor = nextNewline + 1;

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
      
      const itemId = `${currentItem.group}::${currentItem.title}::${url}`;
      if (dedupeSet.has(itemId)) {
        currentItem = null;
        continue;
      }
      dedupeSet.add(itemId);

      let matchedIconName = "";
      const candidates = [currentItem.title, currentItem.tvgName, currentItem.tvgId];
      for (let c = 0; c < candidates.length; c++) {
        if (candidates[c] && iconSet.has(candidates[c])) {
          matchedIconName = candidates[c];
          break;
        }
      }

      const hasIcon = !!matchedIconName;
      const baseUrl = "https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,";
      const posterIcon = hasIcon ? `${baseUrl}w-bw_mul_3.5,h-bh_mul_3,bg-${bgColor},lfo-center,l-image,i-${matchedIconName}.png,lfo-center,l-end,l-end/${matchedIconName}.png` : "";
      const backdropIcon = hasIcon ? `${baseUrl}w-bw_mul_1.5,h-bh_mul_4,bg-${bgColor},lfo-center,l-image,i-${matchedIconName}.png,lfo-center,l-end,l-end/${matchedIconName}.png` : "";

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
        // 【重要修改】移除容易导致闪退的 system 播放器，改为容错率更高的 ijk
        playerType: "ijk", 
        metadata: {
          group: currentItem.group,
          tvgName: currentItem.tvgName,
          tvgId: currentItem.tvgId
        },
        posterPath: finalPosterPath
      });

      currentItem = null;

      // 防止列表渲染过多导致内存崩溃
      if (items.length >= MAX_RETURN_ITEMS) {
        break;
      }
    }
  }

  dedupeSet.clear();
  return items;
}

function buildHeadersForLink(link) {
  if (HEADER_MODE === "ua_only") {
    return { "User-Agent": DEFAULT_UA };
  }
  const headers = { "User-Agent": DEFAULT_UA };
  try {
    const match = link.match(/^https?:\/\/[^\/]+/i);
    const origin = match ? match[0] : "";
    if (origin) {
      if (HEADER_MODE === "origin") {
        headers["Referer"] = `${origin}/`;
        headers["Origin"] = origin;
      } else if (HEADER_MODE === "link") {
        headers["Referer"] = link;
        headers["Origin"] = origin;
      }
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

async function loadDetail(link) {
  let videoUrl = safeString(link);
  
  // 【播放防闪退核心】清洗直播 URL
  // 拦截形如 http://xxx.m3u8|User-Agent=xxx 的非法链接格式，防止 Native 播放器解析器崩溃
  if (videoUrl.includes('|')) {
    videoUrl = videoUrl.split('|')[0];
  }

  // 确保基础的 URI 编码，避免中文路径或特殊符号干崩底层 C++
  try {
    videoUrl = encodeURI(decodeURI(videoUrl));
  } catch (e) {
    // ignore
  }

  const headers = buildHeadersForLink(videoUrl);

  return {
    id: safeString(link), // 保持原始 ID 不变，防止匹配异常
    type: "detail",
    videoUrl: videoUrl,
    customHeaders: headers,
    // 【重要修改】强制指定高兼容性内核
    playerType: "ijk",
    childItems: []
  };
}
