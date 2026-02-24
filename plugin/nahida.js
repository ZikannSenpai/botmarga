require("../api");
require("../setting");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = api[0];

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);

    try {
        if (!args.length) {
            return sock.sendMessage(from, {
                text: "Masukan input setelah perintah!.\nContoh: *.nahida halo*"
            });
        }

        const text = args.join(" ");

        const data = await axios.get(
            `${app}anime/ttsnahida?apikey=planaai&text=${text}`,
            { responseType: "arraybuffer" }
        );
        const res = data.data;
        const buff = Buffer.from(res);

        await sock.sendMessage(
            from,
            {
                audio: buff,
                mimetype: "audio/x-wav",
                ptt: true,
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
                        containsAdReply: false
                    }
                }
            },
            { quoted: msg }
        );
    } catch (err) {
        console.error("Error:", err);
    }
};
