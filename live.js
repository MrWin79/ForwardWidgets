// 电视直播插件（支持自定义 User-Agent）
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
          name: "user_agent",
          title: "自定义 User-Agent（选填）",
          type: "input",
          description: "留空则使用默认 AptvPlayer/1.4.6；会同时用于订阅请求和播放请求",
          value: "AptvPlayer/1.4.6",
          placeholders: [
            {
              title: "默认",
              value: "AptvPlayer/1.4.6"
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
  description: "解析直播订阅链接【五折码：CHEAP.5;七折码：CHEAP】",
  author: "huangxd",
  site: "https://github.com/huangxd-/ForwardWidgets"
};

const DEFAULT_USER_AGENT = "AptvPlayer/1.4.6";
let CURRENT_USER_AGENT = DEFAULT_USER_AGENT;
let __iconCache = {
  timestamp: 0,
  data: null
};

function normalizeUserAgent(ua) {
  const value = String(ua || "").trim();
  return value || DEFAULT_USER_AGENT;
}

function normalizeHexColor(input) {
  const value = String(input || "").trim().replace(/^#/, "");
  return /^[0-9a-fA-F]{6}$/.test(value) ? value.toUpperCase() : "DCDCDC";
}

function compileMatcher(input) {
  const value = String(input || "").trim();
  if (!value) return () => true;

  try {
    const regex = new RegExp(value, "i");
    return (text) => regex.test(String(text || ""));
  } catch (e) {
    const keyword = value.toLowerCase();
    return (text) => String(text || "").toLowerCase().includes(keyword);
  }
}

function getAttr(attributes, key) {
  const re = new RegExp(`${key}="([^"]*)"`, "i");
  const match = String(attributes || "").match(re);
  return match ? match[1].trim() : "";
}

function parseExtInfLine(line) {
  const raw = String(line || "").slice("#EXTINF:".length);
  if (!raw) return null;

  let commaIndex = -1;
  let inQuote = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === '"') inQuote = !inQuote;
    if (ch === ',' && !inQuote) {
      commaIndex = i;
      break;
    }
  }

  if (commaIndex === -1) return null;

  const left = raw.slice(0, commaIndex).trim();
  const title = raw.slice(commaIndex + 1).trim();

  const firstSpace = left.indexOf(" ");
  const duration = firstSpace === -1 ? left : left.slice(0, firstSpace).trim();
  const attributes = firstSpace === -1 ? "" : left.slice(firstSpace + 1);

  const group = getAttr(attributes, "group-title") || "未分类";
  const tvgName = getAttr(attributes, "tvg-name") || title;
  const cover = getAttr(attributes, "tvg-logo") || "";
  const tvgId = getAttr(attributes, "tvg-id") || "";

  return {
    duration,
    title,
    group,
    tvgName,
    tvgId,
    cover
  };
}

function findBestIconName(item, iconSet) {
  const candidates = [item?.title, item?.tvgName, item?.tvgId]
    .map(v => String(v || "").trim())
    .filter(Boolean);

  for (const name of candidates) {
    if (iconSet.has(name)) return name;
  }
  return "";
}

function buildImageKitIcon(iconName, bgColor, mode) {
  const fileName = `${iconName}.png`;
  const encoded = encodeURIComponent(fileName);

  if (mode === "poster") {
    return `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_3.5,h-bh_mul_3,bg-${bgColor},lfo-center,l-image,i-${encoded},lfo-center,l-end,l-end/${encoded}`;
  }

  return `https://ik.imagekit.io/huangxd/tr:l-image,i-transparent.png,w-bw_mul_1.5,h-bh_mul_4,bg-${bgColor},lfo-center,l-image,i-${encoded},lfo-center,l-end,l-end/${encoded}`;
}

async function loadLiveItems(params = {}) {
  try {
    const url = String(params.url || "").trim();
    const groupFilter = String(params.group_filter || "").trim();
    const nameFilter = String(params.name_filter || "").trim();
    const bgColor = normalizeHexColor(params.bg_color || "DCDCDC");
    const direction = params.direction === "H" ? "H" : "V";
    const userAgent = normalizeUserAgent(params.user_agent);

    CURRENT_USER_AGENT = userAgent;

    if (!url) {
      throw new Error("必须提供电视直播订阅链接");
    }

    const content = await fetchM3UContent(url, userAgent);
    if (!content) return [];

    const iconSet = await fetchIconList();
    const items = parseM3UContent(content, iconSet, bgColor, direction);

    const groupMatcher = compileMatcher(groupFilter);
    const nameMatcher = compileMatcher(nameFilter);
    const dedupMap = new Map();

    for (const item of items) {
      const group = item?.metadata?.group || "";
      const title = item?.title || "";

      if (!groupMatcher(group)) continue;
      if (!nameMatcher(title)) continue;
      if (!dedupMap.has(item.link)) {
        dedupMap.set(item.link, item);
      }
    }

    const filteredItems = Array.from(dedupMap.values());
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

async function fetchM3UContent(url, userAgent = DEFAULT_USER_AGENT) {
  try {
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": normalizeUserAgent(userAgent)
      }
    });

    const data = typeof response?.data === "string" ? response.data : "";
    console.log(`M3U fetched, length=${data.length}, ua=${normalizeUserAgent(userAgent)}`);

    if (data.includes("#EXTINF")) {
      return data;
    }
    return null;
  } catch (error) {
    console.error(`获取M3U内容时出错: ${error.message}`);
    return null;
  }
}

async function fetchIconList() {
  try {
    const now = Date.now();
    const TTL = 6 * 60 * 60 * 1000;

    if (__iconCache.data && (now - __iconCache.timestamp < TTL)) {
      return __iconCache.data;
    }

    const response = await Widget.http.get("https://api.github.com/repos/fanmingming/live/contents/tv", {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    });

    const data = Array.isArray(response?.data) ? response.data : [];
    const iconSet = new Set(
      data
        .map(item => String(item?.name || "").replace(/\.png$/i, "").trim())
        .filter(Boolean)
    );

    __iconCache = {
      timestamp: now,
      data: iconSet
    };

    console.log(`Icon count=${iconSet.size}`);
    return iconSet;
  } catch (error) {
    console.error(`获取台标数据时出错: ${error.message}`);
    return new Set();
  }
}

function parseM3UContent(content, iconSet, bgColor, direction) {
  if (!content || !String(content).trim()) return [];

  const lines = String(content).split(/\r?\n/);
  const items = [];
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();
    if (!line || line.startsWith("#EXTM3U")) continue;

    if (line.startsWith("#EXTINF:")) {
      currentItem = parseExtInfLine(line);
      continue;
    }

    if (currentItem && !line.startsWith("#")) {
      const streamUrl = line.trim();
      const iconName = findBestIconName(currentItem, iconSet);

      const posterIcon = iconName ? buildImageKitIcon(iconName, bgColor, "poster") : "";
      const backdropIcon = iconName ? buildImageKitIcon(iconName, bgColor, "backdrop") : "";

      const item = {
        id: streamUrl,
        type: "url",
        title: currentItem.title,
        backdropPath:
          backdropIcon ||
          currentItem.cover ||
          "https://i.miji.bid/2025/05/17/c4a0703b68a4d2313a27937d82b72b6a.png",
        previewUrl: "",
        link: streamUrl,
        playerType: "system",
        metadata: {
          group: currentItem.group,
          tvgName: currentItem.tvgName,
          tvgId: currentItem.tvgId
        }
      };

      if (direction === "V") {
        item.posterPath =
          posterIcon ||
          currentItem.cover ||
          "https://i.miji.bid/2025/05/17/343e3416757775e312197588340fc0d3.png";
      }

      items.push(item);
      currentItem = null;
    }
  }

  return items;
}

async function loadDetail(link) {
  const videoUrl = link;
  const childItems = [];

  return {
    id: link,
    type: "detail",
    videoUrl: videoUrl,
    customHeaders: {
      "Referer": link,
      "User-Agent": CURRENT_USER_AGENT
    },
    playerType: "system",
    childItems: childItems
  };
}
