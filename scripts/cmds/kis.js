module.exports = {
  config: {
    name: "kis",
    version: "1.0",
    author: "JISAN",
    countDown: 5,
    role: 0,
    shortDescription: "Kiss command",
    longDescription: "Sends a kiss gif",
    category: "action",
  },

  onStart: async function ({ message }) {
    // সরাসরি /kis লিখলে এই অংশটি কাজ করবে
    return message.reply({
      body: "KISS BBY 😘💋",
      attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/tTsyJ6RR/kiss-anime-kiss.gif")
    });
  },

  onChat: async function ({ event, message }) {
    // যদি কেউ শুধু "kiss1" লেখে (প্রিফিক্স ছাড়া) তবে এই অংশটি কাজ করবে
    if (event.body && event.body.toLowerCase() === "kiss1") {
      return message.reply({
        body: "KISS BBY 😘💋",
        attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/tTsyJ6RR/kiss-anime-kiss.gif")
      });
    }
  }
};
