export type CategoryId = "film" | "cf" | "mv" | "doc";

export type Work = {
  id: string;
  slug: string;
  title: string;
  /** 卡片上顯示的短標籤，可與分類名稱不同（例：分類「電影」顯示「短片」） */
  tag: string;
  category: CategoryId;
  /** 縮圖佔位漸層，等真實影片縮圖進來後移除 */
  thumbFrom: string;
  thumbTo: string;
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "film", label: "電影" },
  { id: "cf", label: "廣告 CF" },
  { id: "mv", label: "MV" },
  { id: "doc", label: "紀錄片" },
];

export const works: Work[] = [
  {
    id: "1",
    slug: "brand-image-film",
    title: "某品牌形象片",
    tag: "CF",
    category: "cf",
    thumbFrom: "#3a2f26",
    thumbTo: "#12100e",
  },
  {
    id: "2",
    slug: "short-film-name",
    title: "某短片《片名》",
    tag: "短片",
    category: "film",
    thumbFrom: "#26303a",
    thumbTo: "#0e1116",
  },
  {
    id: "3",
    slug: "singer-song-mv",
    title: "某歌手《某曲》",
    tag: "MV",
    category: "mv",
    thumbFrom: "#3a2630",
    thumbTo: "#140e12",
  },
  {
    id: "4",
    slug: "documentary-one",
    title: "某紀錄片",
    tag: "紀錄",
    category: "doc",
    thumbFrom: "#2b3138",
    thumbTo: "#101315",
  },
  {
    id: "5",
    slug: "car-commercial",
    title: "某汽車廣告",
    tag: "CF",
    category: "cf",
    thumbFrom: "#38322a",
    thumbTo: "#131110",
  },
  {
    id: "6",
    slug: "feature-film-name",
    title: "某長片《某名》",
    tag: "電影",
    category: "film",
    thumbFrom: "#2a2a38",
    thumbTo: "#0f0f16",
  },
  {
    id: "7",
    slug: "band-song-mv",
    title: "某樂團《某歌》",
    tag: "MV",
    category: "mv",
    thumbFrom: "#332a3a",
    thumbTo: "#120f16",
  },
  {
    id: "8",
    slug: "craftsman-documentary",
    title: "某職人紀錄",
    tag: "紀錄",
    category: "doc",
    thumbFrom: "#2f3630",
    thumbTo: "#111412",
  },
  {
    id: "9",
    slug: "beverage-commercial",
    title: "某飲料廣告",
    tag: "CF",
    category: "cf",
    thumbFrom: "#3a3526",
    thumbTo: "#14130e",
  },
  {
    id: "10",
    slug: "drama-film-story",
    title: "某劇情片《某事》",
    tag: "電影",
    category: "film",
    thumbFrom: "#302a2a",
    thumbTo: "#131010",
  },
  {
    id: "11",
    slug: "city-chronicle",
    title: "某城市紀事",
    tag: "紀錄",
    category: "doc",
    thumbFrom: "#26343a",
    thumbTo: "#0e1416",
  },
  {
    id: "12",
    slug: "luxury-brand-film",
    title: "某精品形象片",
    tag: "CF",
    category: "cf",
    thumbFrom: "#3a3129",
    thumbTo: "#141110",
  },
];

/** 篩選列用的分類 + 數量，數量由 works 推導而非寫死 */
export const workFilters = [
  { id: "all" as const, label: "全部", count: works.length },
  ...categories.map((category) => ({
    id: category.id,
    label: category.label,
    count: works.filter((work) => work.category === category.id).length,
  })),
];

export type FilterId = (typeof workFilters)[number]["id"];
