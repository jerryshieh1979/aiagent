import { CityData } from './types';

export const DEFAULT_MODE = 'local';
export const DEFAULT_QDRANT_URL = 'https://6a68ea71-9ba1-4d1d-af95-6b1075c62ce3.europe-west3-0.gcp.cloud.qdrant.io';
export const DEFAULT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.0JyJ7JDRvG1Hd9785G0DOxSa4YmI76gUvdNKIVs5Iyg';
export const DEFAULT_COLLECTION_NAME = 'taiwan_cities';

export const TAIWAN_CITIES: CityData[] = [
  // --- 原有 11 個 ---
  {
    id: 1,
    name: "臺北市 (Taipei City)",
    description: `台灣的首都，是政治、經濟與文化的核心。擁有世界級地標台北101、收藏豐富的故宮博物院，以及陽明山國家公園。美食包含牛肉麵、小籠包與熱鬧的士林夜市。`,
    highlights: ["台北101", "故宮博物院", "大稻埕", "陽明山", "士林夜市"]
  },
  {
    id: 2,
    name: "新北市 (New Taipei City)",
    description: `環繞台北市，擁有多樣的地景。九份與金瓜石展現懷舊山城之美，淡水夕照聞名遐邇，還有野柳的奇岩怪石。美食包括淡水阿給與深坑臭豆腐。`,
    highlights: ["九份老街", "淡水老街", "野柳", "平溪天燈", "烏來溫泉"]
  },
  {
    id: 3,
    name: "桃園市 (Taoyuan City)",
    description: `台灣的門戶。大溪老街保留巴洛克建築風格，石門水庫風景優美。青埔區的 Xpark 是熱門現代景點。美食有大溪豆干與龍岡米干。`,
    highlights: ["大溪老街", "石門水庫", "拉拉山", "Xpark", "龍岡米干"]
  },
  {
    id: 4,
    name: "台中市 (Taichung City)",
    description: `中部核心，氣候宜人。臺中國家歌劇院建築卓越，高美濕地夕陽絕美。是珍珠奶茶與太陽餅的故鄉。`,
    highlights: ["臺中國家歌劇院", "逢甲夜市", "高美濕地", "草悟道", "宮原眼科"]
  },
  {
    id: 5,
    name: "南投縣 (Nantou County)",
    description: `唯一不靠海的縣市，擁有日月潭與清境農場。合歡山是觀星與賞雪勝地。特產有鹿谷茶葉與阿婆茶葉蛋。`,
    highlights: ["日月潭", "清境農場", "合歡山", "溪頭", "玉山"]
  },
  {
    id: 6,
    name: "嘉義縣/市 (Chiayi)",
    description: `阿里山的門門戶。嘉義火雞肉飯是靈魂美食。檜意森活村與故宮南院展現歷史與藝文氣息。`,
    highlights: ["阿里山", "火雞肉飯", "檜意森活村", "故宮南院", "太平雲梯"]
  },
  {
    id: 7,
    name: "台南市 (Tainan City)",
    description: `台灣古都，美食之都。安平古堡與赤崁樓見證歷史，巷弄老屋充滿魅力。牛肉湯、棺材板是必吃。`,
    highlights: ["安平古堡", "赤崁樓", "牛肉湯", "神農街", "奇美博物館"]
  },
  {
    id: 8,
    name: "高雄市 (Kaohsiung City)",
    description: `南部海港城市。駁二藝術特區展現文創活力，愛河浪漫唯美。旗津海鮮與岡山羊肉是特色。`,
    highlights: ["駁二", "愛河", "旗津", "蓮池潭", "衛武營"]
  },
  {
    id: 9,
    name: "宜蘭縣 (Yilan County)",
    description: `台北的後花園。擁有礁溪溫泉、三星蔥餅與櫻桃鴨。蘭陽博物館建築獨特，適合深度慢遊。`,
    highlights: ["礁溪溫泉", "蘭陽博物館", "傳藝中心", "龜山島", "三星蔥"]
  },
  {
    id: 10,
    name: "花蓮縣 (Hualien County)",
    description: `大山大水。太魯閣峽谷舉世聞名，七星潭礫石海灘優美。美食有麻糬與炸彈蔥油餅。`,
    highlights: ["太魯閣", "七星潭", "清水斷崖", "東大門夜市", "瑞穗牧場"]
  },
  {
    id: 11,
    name: "台東縣 (Taitung County)",
    description: `慢活聖地。伯朗大道稻浪壯闊，鹿野高台熱氣球迷人。特產包含釋迦與池上便當。`,
    highlights: ["伯朗大道", "鹿野高台", "三仙台", "鐵花村", "多良車站"]
  },

  // --- 新加入 20 個 ---
  {
    id: 12,
    name: "基隆市 (Keelung City)",
    description: `雨港基隆，擁有熱鬧的廟口夜市。和平島公園地景奇特，正濱漁港彩色屋是熱門打卡點。必吃美食有營養三明治與泡泡冰。`,
    highlights: ["基隆廟口", "和平島", "正濱漁港彩色屋", "忘憂谷", "潮境公園"]
  },
  {
    id: 13,
    name: "新竹市 (Hsinchu City)",
    description: `台灣矽谷。除了高科技產業，市區擁有歷史悠久的東門城與城隍廟。新竹漁港（南寮）是風箏愛好者的天堂。必吃貢丸與米粉。`,
    highlights: ["城隍廟", "東門城", "新竹漁港", "動物園", "玻璃工藝博物館"]
  },
  {
    id: 14,
    name: "新竹縣 (Hsinchu County)",
    description: `客家文化重鎮。內灣老街與北埔老街古色古香，司馬庫斯是「上帝的部落」。特產有東方美人茶與柿餅。`,
    highlights: ["內灣老街", "北埔老街", "司馬庫斯", "六福村", "合興車站"]
  },
  {
    id: 15,
    name: "苗栗縣 (Miaoli County)",
    description: `山城苗栗。勝興車站與龍騰斷橋是經典鐵道遺跡。三義木雕舉世聞名。大湖採草莓是冬季必訪。`,
    highlights: ["龍騰斷橋", "勝興車站", "大湖草莓", "三義木雕", "南庄老街"]
  },
  {
    id: 16,
    name: "彰化縣 (Changhua County)",
    description: `古稱半線。八卦山大佛是守護地標，鹿港小鎮則保留了完整的清代風貌。美食以彰化肉圓與鹿港牛舌餅聞名。`,
    highlights: ["鹿港天后宮", "八卦山", "摸乳巷", "田尾公路花園", "扇形車庫"]
  },
  {
    id: 17,
    name: "雲林縣 (Yunlin County)",
    description: `農業首都，布袋戲的故鄉。北港朝天宮香火鼎盛。古坑咖啡享譽全台。西螺大橋是代表性建築。`,
    highlights: ["北港朝天宮", "古坑咖啡", "西螺大橋", "澄霖沉香味道森林館", "雲林布袋戲館"]
  },
  {
    id: 18,
    name: "屏東縣 (Pingtung County)",
    description: `國境之南。墾丁國家公園擁有蔚藍海岸，大鵬灣可體驗水上活動。萬巒豬腳與東港黑鮪魚是必吃美味。`,
    highlights: ["墾丁", "鵝鑾鼻燈塔", "大鵬灣", "勝利星村", "萬巒豬腳"]
  },
  {
    id: 19,
    name: "澎湖縣 (Penghu County)",
    description: `玄武岩之島。每年花火節吸引大批遊客。雙心石滬見證祖先智慧。美食有仙草冰、黑糖糕與仙人掌冰。`,
    highlights: ["花火節", "雙心石滬", "奎壁山踏浪", "玄武岩", "跨海大橋"]
  },
  {
    id: 20,
    name: "金門縣 (Kinmen County)",
    description: `戰地文化與閩南風情。古寧頭、翟山坑道見證歷史。風獅爺是當地守護神。特產有高粱酒、貢糖與菜刀。`,
    highlights: ["翟山坑道", "莒光樓", "古寧頭", "山后民俗文化村", "高粱酒"]
  },
  {
    id: 21,
    name: "連江縣 (Matsu Islands)",
    description: `馬祖列島。以「藍眼淚」奇景聞名世界。芹壁聚落有「地中海」之譽。坑道與戰地遺跡充滿神祕感。`,
    highlights: ["藍眼淚", "芹壁聚落", "北海坑道", "東引燈塔", "馬祖巨神像"]
  },
  {
    id: 22,
    name: "鹿港小鎮 (Lukang Town)",
    description: `「一府二鹿三艋舺」的二鹿。擁有龍山寺、天后宮等重要古蹟。九曲巷與十宜樓可見往日繁華。必吃蝦猴與麵線糊。`,
    highlights: ["鹿港龍山寺", "九曲巷", "麵線糊", "鹿港老街", "意樓"]
  },
  {
    id: 23,
    name: "墾丁國家公園 (Kenting)",
    description: `熱帶風情聖地。白沙灣、南灣適合玩水。墾丁大街夜晚熱鬧非凡。龍磐大草原可觀賞壯闊海景。`,
    highlights: ["龍磐公園", "白沙灣", "墾丁大街", "海生館", "船帆石"]
  },
  {
    id: 24,
    name: "阿里山風景區 (Alishan)",
    description: `日出、雲海、鐵路、森林與晚霞。搭乘小火車穿梭林間，櫻花季美不勝收。特產為阿里山高山茶。`,
    highlights: ["祝山日出", "姊妹潭", "神木群", "奮起湖老街", "雲海"]
  },
  {
    id: 25,
    name: "綠島 (Green Island)",
    description: `太平洋上的珍珠。擁有世界唯三的海底溫泉。浮潛與潛水可見豐富珊瑚礁與熱帶魚。朝日溫泉是看日出的絕佳處。`,
    highlights: ["朝日溫泉", "睡美人與哈巴狗岩", "綠島監獄", "大白沙", "石朗潛水"]
  },
  {
    id: 26,
    name: "蘭嶼 (Orchid Island)",
    description: `達悟族（雅美族）的家。拼板舟與地下屋是文化象徵。大天池與饅頭岩風景獨特。是觀星與體驗原民文化的淨土。`,
    highlights: ["拼板舟", "地下屋", "青青草原", "饅頭岩", "大天池"]
  },
  {
    id: 27,
    name: "小琉球 (Liuqiu Island)",
    description: `台灣唯一的珊瑚礁島。與綠蠵龜共游是最大特色。花瓶岩是代表地標。麻花捲是必買伴手禮。`,
    highlights: ["花瓶岩", "蛤板灣", "美人洞", "綠蠵龜浮潛", "厚石裙礁"]
  },
  {
    id: 28,
    name: "北海岸與野柳 (North Coast)",
    description: `沿線風景壯麗。野柳的女王頭受風化影響日益纖細。富貴角燈塔是台灣最北端。美食以萬里蟹最負盛名。`,
    highlights: ["女王頭", "富貴角燈塔", "老梅綠石槽", "石門洞", "金山老街"]
  },
  {
    id: 29,
    name: "太魯閣國家公園 (Taroko)",
    description: `世界級大理石峽谷。燕子口與九曲洞可感受地殼變動與河流切割的威力。長春祠如畫般幽美。`,
    highlights: ["燕子口", "長春祠", "白楊步道", "天祥", "布洛灣"]
  },
  {
    id: 30,
    name: "日月潭風景區 (Sun Moon Lake)",
    description: `高山湖泊，風景如詩。向山遊客中心建築優美。可搭纜車前往九族文化村。美食有阿婆茶葉蛋。`,
    highlights: ["向山中心", "文武廟", "玄光寺", "拉魯島", "伊達邵"]
  },
  {
    id: 31,
    name: "陽明山國家公園 (Yangmingshan)",
    description: `台北的避暑勝地。春天賞花（櫻花、杜鵑）、秋天賞芒、冬季溫泉。大油坑展現火山地熱噴發景象。`,
    highlights: ["小油坑", "擎天崗", "花鐘", "竹子湖", "冷水坑"]
  }
];