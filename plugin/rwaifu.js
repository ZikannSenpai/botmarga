const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("../setting");
require("../api");
const app = api[1];

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const url = `${app}random/waifu`;
    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);
    try {
        const res = await axios.get(url, { responseType: "arraybuffer" });
        const img = Buffer.from(res.data, "binary");

        await sock.sendMessage(
            from,
            {
                image: img,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: `${zik.namaCh}`,
                        newsletterId: `${zik.idCh}`,
                        contentType: 1,
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: `${zik.namaBot}`,
                        body: `${zik.txt}`,
                        thumbnail: logoBuffer,
                        sourceUrl: `${zik.linkTt}`,
                        mediaType: 1,
                        mediaUrl: `${zik.linkTt}`,
                        renderLargerThumbnail: true,
                        containsAdReply: true,
                        showAdAttribution: true
                    }
                }
            },
            { quoted: msg }
        );
    } catch (err) {
        console.error("Error:", err);
    }
};
