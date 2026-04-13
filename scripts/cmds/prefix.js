const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "jisan",//editing by ArYAN
		countDown: 5,
		role: 0,
		description: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		category: "𝗖𝗢𝗡𝗙𝗜𝗚",
		guide: {
			vi: ""
		}
	},

	langs: {
		vi: {},
		en: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change prefix of system bot",
			confirmGlobal: "Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
			successGlobal: "Changed prefix of system bot to: %1",
			successThisThread: "Changed prefix in your box chat to: %1",
			myPrefix: "✨ 𝙅𝙄𝙎𝘼𝙉 𝘽𝙊𝙏 𝘽𝙊𝙓 ✨\n\n❊⊰⊰ 𝙅𝙄𝙎𝘼𝙉-𝐁𝐎𝐓...𝟭𝟬𝟬%⊱⊱❊\⫸ 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐟𝐮𝐥𝐥 ⫷\n\n❐ 🄱🄾🅃 𝐏𝐫𝐞𝐟𝐢𝐱: [❊⊰ . ⊱❊]\n❐𝐄𝐱𝐚𝐦𝐩𝐥𝐞: .𝐡𝐞𝐥𝐩\n───────────•••\n│👤𝐎𝐰𝐧𝐞𝐫:【 𝙈𝙍 𝙅𝙄𝙎𝘼𝙉 】\n│⚠𝐃𝐨𝐧'𝐭 𝐊𝐢𝐜𝐤 𝐓𝐡𝐢𝐬 𝐁𝐨𝐭!\n│✅𝐔𝐬𝐞 .𝐡𝐞𝐥𝐩 𝐓𝐨 𝐒𝐞𝐞 𝐂𝐌𝐃?\n│💟𝐓𝐡𝐚𝐧𝐤𝐬 𝐆𝐂 𝐀𝐝𝐦𝐢𝐧 𝐅𝐨𝐫 𝐀𝐝𝐝!\n│❄𝐈 𝐇𝐚𝐯𝐞 𝐍𝐨 𝐒𝐩𝐚𝐦!"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

  onChat: async function ({ event, message, usersData, getLang }) {
    const data = await usersData.get(event.senderID);
    const name = data.name;
    const xyrene = {
      body: getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)),
      attachment: await global.utils.getStreamFromURL("https://i.postimg.cc/Nj44bTy3/received-620337510952444.jpg")
        };
    if (event.body && event.body.toLowerCase() === "prefix")
      return () => {
        return message.reply(xyrene);
      };
  }
  };
