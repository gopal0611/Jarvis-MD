const { FiletypeFromUrl,parseJid, extractUrlFromMessage } = require("./functions");
const { getStatus, getMessage } = require("../assets/database").Greetings;

async function Greetings(data, message) {
  const metadata = await message.groupMetadata(data.id);
  const participants = data.participants;
  for (const user of participants) {
    let userpp;
    try {
      userpp = await message.profilePictureUrl(user, "image");
    } catch {
      userpp = "https://getwallpapers.com/wallpaper/full/8/f/3/168931.jpg";
    }

    switch (data.action) {
      case "add": {
        const status = await getStatus(data.id, "welcome");
        if (!status) return;

        const welcomeMessage = await getMessage(data.id, "welcome");
        let msg = welcomeMessage.message
          .replace(/@user/gi, `@${user.split("@")[0]}`)
          .replace(/@gname/gi, metadata.subject)
          .replace(/@count/gi, metadata.participants.length);

        const url = extractUrlFromMessage(msg);

        if (url) {
         
          const {type,buffer} = await FiletypeFromUrl(url);
          if (type === "image" || type === "video") {
            const caption = msg.replace(url, "").trim();

            message.sendMessage(data.id, {
              [type]: buffer,
              caption: caption,
              mentions: parseJid(msg),
            });
          } else {
            message.sendMessage(data.id, { text: msg, mentions: parseJid(msg) });
          }
        } else {
          message.sendMessage(data.id, { text: msg, mentions: parseJid(msg) });
        }
        break;
      }

      case "remove": {
        const status = await getStatus(data.id, "goodbye");
        if (!status) return;

        const goodbyeMessage = await getMessage(data.id, "goodbye");
        let msg = goodbyeMessage.message
          .replace(/@user/gi, `@${user.split("@")[0]}`)
          .replace(/@gname/gi, metadata.subject)
          .replace(/@count/gi, metadata.participants.length);

        const url = extractUrlFromMessage(msg);

        if (url) {
          const {type,buffer} = await FiletypeFromUrl(url);

          if (type === "photo" || type === "video") {
            const caption = msg.replace(url, "").trim();

            message.sendMessage(data.id, {
              [type]: buffer,
              caption: caption,
              mentions: parseJid(msg),
            });
          } else {
            message.sendMessage(data.id, { text: msg, mentions: parseJid(msg) });
          }
        } else {
          message.sendMessage(data.id, { text: msg, mentions: parseJid(msg) });
        }
        break;
      }
    }
  }
}

module.exports = Greetings;
