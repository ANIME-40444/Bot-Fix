const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const numberNames = [
  "", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion",
  "Sextillion", "Septillion", "Octillion", "Nonillion", "Decillion", "Undecillion",
  "Duodecillion", "Tredecillion", "Quattuordecillion", "Quindecillion", "Sexdecillion",
  "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion", "Unvigintillion",
  "Duovigintillion", "Tresvigintillion", "Quattuorvigintillion", "Quinvigintillion",
  "Sesvigintillion", "Septemvigintillion", "Octovigintillion", "Novemvigintillion",
  "Trigintillion", "Untrigintillion", "Duotrigintillion", "Googol", "Googolplex",
  "Centillion", "Uncentillion", "Duocentillion", "Trecentillion", "Quattuorcentillion",
  "Quincentillion", "Sexcentillion", "Septencentillion", "Octocentillion",
  "Novemcentillion", "Quattuordecillion", "Quindecillion", "Sexdecillion",
  "Septendecillion", "Octodecillion", "Novemdecillion", "Vigintillion"
];

function formatMoney(num) {
  if (num === 0) return "0";
  if (num < 1000) return num.toString();
  const exp = Math.floor(Math.log(num) / Math.log(1000));
  if (exp >= numberNames.length) return "∞Infinity";
  const value = num / Math.pow(1000, exp);
  const rounded = Math.round(value * 100) / 100;
  return `${rounded} ${numberNames[exp]}`;
}

function expToLevel(exp, deltaNext = 5) {
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}

function levelToExp(level, deltaNext = 5) {
  return Math.floor(((Math.pow(level, 2) - level) * deltaNext) / 2);
}

module.exports = {
  config: {
    name: "spy",
    aliases: ["spy"],
    version: "2.5",
    author: "JISAN", // আপনার নাম আপডেট করা হয়েছে
    countDown: 5,
    shortDescription: { en: "Show user info card" },
    longDescription: { en: "Generate a canvas image showing user stats" },
    category: "info"
  },

  onStart: async function ({ event, message, usersData, args, api, threadsData }) {
    let avatarUrl;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
    }

    avatarUrl = await usersData.getAvatarUrl(uid);
    const userData = await usersData.get(uid);
    const allUsers = await usersData.getAll();
    const threadID = event.threadID;
    const threadData = await threadsData.get(threadID);
    const memberData = threadData.members.find(member => member.userID === uid);
    const messages = memberData ? memberData.count || 0 : 0;

    let username, genderText;
    try {
      const userInfo = await api.getUserInfo(uid);
      const user = userInfo[uid];
      username = user?.vanity || user?.name || "Not set";
      
      // জেন্ডার ডিটেকশন লজিক ইমপ্রুভমেন্ট
      const gender = user?.gender; 
      if (gender === 1 || gender === "FEMALE") genderText = "Female";
      else if (gender === 2 || gender === "MALE") genderText = "Male";
      else genderText = "Unknown";

    } catch (e) {
      username = userData.name || "Not set";
      // ডাটাবেজ থেকে জেন্ডার চেক
      if (userData.gender == 1) genderText = "Female";
      else if (userData.gender == 2) genderText = "Male";
      else genderText = "Unknown";
    }

    const deltaNext = 5;
    const exp = userData.exp || 0;
    const levelUser = expToLevel(exp, deltaNext);
    const usersWithExp = allUsers.filter(u => typeof u.exp === "number").sort((a, b) => b.exp - a.exp);
    const expRank = usersWithExp.findIndex(u => u.userID === uid) + 1;

    const usersWithMoney = allUsers.filter(u => typeof u.money === "number").sort((a, b) => b.money - a.money);
    const moneyRank = usersWithMoney.findIndex(u => u.userID === uid) + 1;

    const name = userData.name || "Unknown";
    const money = userData.money || 0;
    const avatarBuffer = (await axios.get(avatarUrl, { responseType: "arraybuffer" })).data;
    const avatar = await loadImage(avatarBuffer);

    const canvas = createCanvas(1366, 768);
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f0f1c");
    gradient.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 150; i++) {
      ctx.fillSty
