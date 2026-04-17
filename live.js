// 电视直播插件（稳定优化版 / 防闪退优先）
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
            {
              title: "Kimentanm",
              value: "https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u"
            },
            {
              title: "网络直播",
              value: "https://tv.iill.top/m3u/Live"
            },
            {
              title: "smart(港澳台)",
              value: "https://smart.pendy.dpdns.org/m3u/merged_judy.m3u"
            },
            {
              title: "YanG-Gather1",
              value: "https://tv.iill.top/m3u/Gather"
            },
            {
              title: "YanG-Gather2",
              value: "https://raw.githubusercontent.com/YanG-1989/m3u/main/Gather.m3u"
            },
            {
              title: "suxuang",
              value: "https://bit.ly/suxuang-v4"
            },
            {
              title: "PlutoTV-美国",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_US.m3u"
            },
            {
              title: "PlutoTV-墨西哥",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_MX.m3u"
            },
            {
              title: "PlutoTV-意大利",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_IT.m3u"
            },
            {
              title: "PlutoTV-英国",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_GB.m3u"
            },
            {
              title: "PlutoTV-法国",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_FR.m3u"
            },
            {
              title: "PlutoTV-西班牙",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_ES.m3u"
            },
            {
              title: "PlutoTV-德国",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_DE.m3u"
            },
            {
              title: "PlutoTV-智利",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_CL.m3u"
            },
            {
              title: "PlutoTV-加拿大",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_CA.m3u"
            },
            {
              title: "PlutoTV-巴西",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_BR.m3u"
            },
            {
              title: "PlutoTV-阿根廷",
              value: "https://raw.githubusercontent.com/HelmerLuzo/PlutoTV_HL/refs/heads/main/tv/m3u/PlutoTV_tv_AR.m3u"
            },
            {
              title: "全球",
              value: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8"
            },
            {
              title: "IPTV1",
              value: "https://raw.githubusercontent.com/skddyj/iptv/main/IPTV.m3u"
            },
            {
              title: "IPTV2-CN",
              value: "https://iptv-org.github.io/iptv/countries/cn.m3u"
            },
            {
              title: "IPTV3",
              value: "https://cdn.jsdelivr.net/gh/Guovin/iptv-api@gd/output/result.m3u"
            }
          ]
        },
        {
          name: "group_filter",
          title: "按组关键字过滤(选填)，如央视，会筛选出所有group-title中包含央视的频道",
          type: "input",
          description: "输入组关键字，如央视，会筛选出所有group-title中包含央视的频道",
          placeholders: [
            {
              title: "全部",
              value: ""
            },
            {
              title: "央视&卫视",
              value: ".*(央视|卫视).*"
            },
            {
              title: "央视",
              value: "央视"
            },
            {
              title: "卫视",
              value: "卫视"
            }
          ]
        },
        {
          name: "name_filter",
          title: "按频道名关键字过滤(选填)，如卫视，会筛选出所有频道名中包含卫视的频道",
          type: "input",
          description: "输入频道名关键字过滤(选填)，如卫视，会筛选出所有频道名中包含卫视的频道",
          placeholders: [
            {
              title: "全部",
              value: ""
            },
            {
              title: "B站&虎牙&斗鱼",
              value: ".*(B站|虎牙|斗鱼).*"
            },
            {
              title: "英雄联盟",
              value: "英雄联盟"
            },
            {
              title: "王者荣耀",
              value: "王者荣耀"
            },
            {
              title: "绝地求生",
              value: "绝地求生"
            },
            {
              title: "和平精英",
              value: "和平精英"
            }
          ]
        },
        {
          name: "bg_color",
          title: "台标背景色(只对源里不自带台标的起作用)",
          type: "input",
          description: "支持RGB颜色，如DCDCDC",
          value: "DCDCDC",
          placeholders: [
            {
              title: "亮灰色",
              value: "DCDCDC"
            },
            {
              title: "钢蓝",
              value: "4682B4"
            },
            {
              title: "浅海洋蓝",
              value: "20B2AA"
            },
            {
              title: "浅粉红",
              value: "FFB6C1"
            },
            {
              title: "小麦色",
              value: "F5DEB3"
            }
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
  version: "1.1.0",
  requiredVersion: "0.0.1",
  description: "解析直播订阅链接【稳定优化版】",
  author: "huangxd / optimized",
  site: "https://github.com/huangxd-/ForwardWidgets"
};

/**
 * =========================
 * 可调配置
 * =========================
 */
const DEBUG = false;

// 播放请求头模式：
// "ua_only"  -> 只带 User-Agent（默认，最稳，优先防闪退）
// "origin"   -> 带 User-Agent + Referer(origin/) + Origin
// "link"     -> 带 User-Agent + Referer(link)（兼容某些特殊源，但更激进）
const HEADER_MODE = "ua_only";

// 图标缓存时长：6小时
const ICON_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

// 默认 User-Agent
const DEFAULT_UA = "okHttp/Mod-1.5.0.0";

// 图标缓存
let _iconCache = {
  set: null,
  timestamp: 0
};

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

function guessIconNameCandidates(currentItem) {
  const candidates = [
    safeString(currentItem.title),
    safeString(currentItem.tvgName),
    safeString(currentItem.tvgId)
  ].filter(Boolean);

  // 去重并保留顺序
  const seen = new Set();
  return candidates.filter(name => {
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}

async function loadLiveItems(params = {}) {
  try {
    const url = safeString(params.url);
    const groupFilter = safeString(params.group_filter);
    const nameFilter = safeString(params.name_filter);
    const bgColor = normalizeColor(params.bg_color || "DCDCDC");
    const direction = safeString(params.direction || "V") || "V";

    if (!url) {
      throw new Error("必须提供电视直播订阅链接");
    }

    const responseText = await fetchM3UContent(url);
    if (!responseText) return [];

    const iconSet = await fetchIconSet();
    const items = parseM3UContent(responseText, iconSet, bgColor, direction);

    const groupMatcher = compileFilter(groupFilter);
    const nameMatcher = compileFilter(nameFilter);

    const filteredItems = items.filter(item => {
      const groupMatch = groupMatcher ? groupMatcher(item.metadata?.group || "") : true;
      const nameMatch = nameMatcher ? nameMatcher(item.title || "") : true;
      return groupMatch && nameMatch;
    });

    const totalCount = filteredItems.length;

    return filteredItems.map((item, index) => ({
      ...item,
      title: `${item.title} (${index + 1}/${totalCount})`
    }));
  } catch (error) {
    console.error(`解析电视直播链接时出错: ${error.message}`);
    return [];
  }
}

async function fetchM3UContent(url) {
  try {
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": DEFAULT_UA
      }
    });

    const data = typeof response?.data === "string" ? response.data : "";
    debugLog("M3U响应前200字符:", data.slice(0, 200));

    if (data && data.includes("#EXTINF")) {
      return data;
    }

    return null;
  } catch (error) {
    console.error(`获取M3U内容时出错: ${error.message}`);
    return null;
  }
}

async function fetchIconSet() {
  try {
    const now = Date.now();

    if (_iconCache.set && (now - _iconCache.timestamp < ICON_CACHE_TTL_MS)) {
      debugLog("使用缓存的 iconSet");
      return _iconCache.set;
    }

    const response = await Widget.http.get("https://api.github.com/repos/fanmingming/live/contents/tv", {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": DEFAULT_UA
      }
    });

    const data = safeArray(response?.data);
    const iconNames = data
      .map(item => safeString(item?.name).replace(/\.png$/i, ""))
      .filter(Boolean);

    const iconSet = new Set(iconNames);

    _iconCache = {
      set: iconSet,
      timestamp: now
    };

    debugLog("iconSet size:", iconSet.size);
    return iconSet;
  } catch (error) {
    console.error(`获取台标数据时出错: ${error.message}`);
    return new Set();
  }
}

function parseM3UContent(content, iconSet, bgColor, direction) {
  if (!content || !safeString(content)) return [];

  const lines = content.split(/\r?\n/);
  const items = [];
  const dedupeSet = new Set();
  let currentItem = null;

  const extInfRegex = /^#EXTINF:(-?\d+)(.*),(.*)$/;
  const groupRegex = /group-title="([^"]+)"/;
  const tvgNameRegex = /tvg-name="([^"]+)"/;
  const tvgLogoRegex = /tvg-logo="([^"]+)"/;
  const tvgIdRegex = /tvg-id="([^"]+)"/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = safeString(rawLine);

    if (!line || line.startsWith("#EXTM3U")) continue;

    if (line.startsWith("#EXTINF:")) {
      const match = line.match(extInfRegex);
      if (!match) {
        currentItem = null;
        continue;
      }

      const duration = safeString(match[1]);
      const attributes = safeString(match[2]);
      const title = safeString(match[3]);

      const groupMatch = attributes.match(groupRegex);
      const tvgNameMatch = attributes.match(tvgNameRegex);
      const tvgLogoMatch = attributes.match(tvgLogoRegex);
      const tvgIdMatch = attributes.match(tvgIdRegex);

      currentItem = {
        duration,
        title: title || "未命名频道",
        group: groupMatch ? safeString(groupMatch[1]) : "未分类",
        tvgName: tvgNameMatch ? safeString(tvgNameMatch[1]) : title,
        tvgId: tvgIdMatch ? safeString(tvgIdMatch[1]) : "",
        cover: tvgLogoMatch ? safeString(tvgLogoMatch[1]) : "",
        url: null
      };
      continue;
    }

    if (currentItem && !line.startsWith("#")) {
      const url = line;
      if (!url) {
        currentItem = null;
        continue;
      }

      const candidates = guessIconNameCandidates(currentItem);
      let matchedIconName = "";

      for (const name of candidates) {
        if (iconSet.has(name)) {
          matchedIconName = name;
          break;
        }
      }

      const hasIcon = !!matchedIconName;
      const posterIcon = hasIcon ? createPosterIcon(matchedIconName, bgColor) : "";
      const backdropIcon = hasIcon ? createBackdropIcon(matchedIconName, bgColor) : "";

      const itemId = buildStableId(currentItem.group, currentItem.title, url);
      if (dedupeSet.has(itemId)) {
        currentItem = null;
        continue;
      }
      dedupeSet.add(itemId);

      const item = {
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
        }
      };

      if (!direction || direction === "V") {
        item.posterPath = posterIcon || currentItem.cover || "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png";
      } else {
        // 横向优先时，也给 posterPath 一个可用值，避免某些 UI 因字段缺失导致异常
        item.posterPath = currentItem.cover || posterIcon || "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png";
      }

      items.push(item);
      currentItem = null;
    }
  }

  return items;
}

function buildHeadersForLink(link) {
  const headers = {
    "User-Agent": DEFAULT_UA
  };

  if (HEADER_MODE === "ua_only") {
    return headers;
  }

  try {
    const origin = new URL(link).origin;

    if (HEADER_MODE === "origin") {
      headers["Referer"] = `${origin}/`;
      headers["Origin"] = origin;
      return headers;
    }

    if (HEADER_MODE === "link") {
      headers["Referer"] = link;
      headers["Origin"] = origin;
      return headers;
    }
  } catch (e) {
    debugLog("URL解析失败，回退到UA only:", e?.message || e);
  }

  return headers;
}

async function loadDetail(link) {
  try {
    const videoUrl = safeString(link);
    const childItems = [];

    const headers = buildHeadersForLink(videoUrl);
    debugLog("loadDetail headers:", headers);

    return {
      id: videoUrl,
      type: "detail",
      videoUrl: videoUrl,
      customHeaders: headers,
      playerType: "system",
      childItems: childItems
    };
  } catch (error) {
    console.error(`loadDetail 出错: ${error.message}`);

    return {
      id: safeString(link),
      type: "detail",
      videoUrl: safeString(link),
      customHeaders: {
        "User-Agent": DEFAULT_UA
      },
      playerType: "system",
      childItems: []
    };
  }
}
