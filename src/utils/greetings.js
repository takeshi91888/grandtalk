// 随机问候语库 — 每次打开 App 随机显示
const greetings = [
  "今天又来陪孙子练英语啦，真棒！👏",
  "坚持就是胜利，您真了不起！⭐",
  "每学会一句英语，就离孙子的心更近一步 ❤️",
  "欢迎回来！孙子们等着跟您说话呢 🌟",
  "学英语不难，您做得到的！加油！💪",
  "今天学的英语，明天就能用上！😊",
  "爷爷奶奶最棒了！孙子们都好爱您 ❤️",
  "慢慢来，不着急，每一步都算数！🌱",
];

export function getRandomGreeting() {
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export default greetings;
