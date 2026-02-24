require("../api");
require("../setting");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = api[1];

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;

    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);

    try {
        if (!args.length) {
            return sock.sendMessage(from, {
                text: "Masukan input setelah perintah!.\nContoh: *.yts where we are*"
            });
        }

        const text = args.join(" ");

        const data = await axios.get(`${app}search/yts?q=${text}`);
        const res = data.data.result[0] || "Tidak ada jawaban dari api";

        if (!data.data.status) {
            return sock.sendMessage(
                from,
                {
                    text: "API is error.",
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
        const reply = `
*_Information:_*

Judul: *${res.title}*
Durasi: *${res.duration}*
Tanggal upload: *${res.uploaded}*
View: *${res.views}*
Link: *${res.url}*
        `;

        await sock.sendMessage(
            from,
            {
                caption: reply,
                image: { url: res.thumbnail },
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
