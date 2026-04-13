module.exports = {
  config: {
    name: "kiss",
    version: "1.0",
    author: "JISAN",
    countDown: 5,
    role: 0,
    shortDescription: "Sends a kiss gif",
    longDescription: "Sends a kiss gif with or without prefix",
    category: "action",
  },

  onStart: async function ({ message }) {
    // এটি কাজ করবে যখন আপনি প্রিফিক্স দিয়ে কমান্ড দিবেন (যেমন: !kiss)
    return message.reply({
      body: "KISS💋",
      attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/zfj3KT1n/miyamura-hori.gif")
    });
  },

  onChat: async function ({ event, message }) {
    // এটি কাজ করবে যখন আপনি শুধু "kiss" লিখবেন (প্রিফিক্স ছাড়া)
    if (event.body && event.body.toLowerCase() === "kiss") {
      return message.reply({
        body: "KISS💋",
        attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/zfj3KT1n/miyamura-hori.gif")
      });
    }
  }
};
