const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("../setting");
require("../api");
const app = api[1];

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const url = `${app}maker/brat?text=`;
    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);

    try {
        if (!args || !args.length) {
            return sock.sendMessage(
                from,
                {
                    text: "Tambahkan text\nContoh: *.brat apasih jir 😹*",
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
                            thumbnail: bError,
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
        }
        await sock.sendMessage(from, {
            react: {
                text: "🔍",
                key: msg.key
            }
        });
        const query = encodeURIComponent(args.join(" "));
        const data = await axios.get(`${url}${query}`, {
            responseType: "arraybuffer"
        });
        const stiker = Buffer.from(data.data, "binary");

        await sock.sendMessage(
            from,
            {
                sticker: stiker,
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
        await sock.sendMessage(from, {
            react: {
                text: "✅",
                key: msg.key
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
};
