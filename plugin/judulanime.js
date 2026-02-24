const { downloadMediaMessage } = require("@whiskeysockets/baileys");
require("../setting");
require("../api");
const app = api[0];
const path = require("path");
const fs = require("fs");
const { Catbox } = require("node-catbox");
const axios = require("axios");
const catbox = new Catbox();

function formated(ts) {
    const min = Math.floor(ts / 60);
    const sec = Math.floor(ts % 60);

    return String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
}
module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = msg.message?.imageMessage || quoted?.imageMessage;
    const apikey = `${app}anime/what-anime?apikey=planaai&url=`;

    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);

    try {
        if (!imageMsg) {
            return sock.sendMessage(
                from,
                {
                    text: "Kirim/reply foto cuplikan anime menggunakan command ini!",
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
                text: "⏳",
                key: msg.key
            }
        });
        const buffer = await downloadMediaMessage(
            { message: { imageMessage: imageMsg } },
            "buffer",
            {},
            {
                logger: sock.logger,
                reuploadRequest: sock.updateMediaMessage
            }
        );
        const base64 = buffer.toString("base64");
        // const tempPath = path.join(
        //     __dirname,
        //     `../sampah/temp_${Date.now()}.jpg`
        // );
        // fs.writeFileSync(tempPath, buffer);

        const ink = await axios.post(
            "https://api.imgbb.com/1/upload",
            new URLSearchParams({
                image: base64
            }),
            {
                params: {
                    expiration: 600,
                    key: "1eae2a7be3af11fe72555e22040ec1d9"
                }
            }
        );

        const url = ink.data.data.url;
        await sock.sendMessage(
            from,
            {
                text: `Mendapatkan Link...\n*${url}*`
            },
            { quoted: msg }
        );

        const res = await axios.get(apikey + encodeURIComponent(url));

        const data = res.data.result;
        const {
            title: { english, native, romaji }
        } = data;
        const menit = data.from;
        const genre = data.genres.join(", ");

        const caption = `
*Information*

Judul: *${english}, ${native}, ${romaji}*
Episode: *${data.episode || "-"}*
Kesamaan: *${data.similarity || "-"}*
Menit ke: *${formated(menit) || "-"}*
Durasi: *${data.duration || "-"}*

Tanggal Rilis: *${data.startDate.day}-${data.startDate.month}-${data.startDate.year}*
Musim: *${data.season || "-"}*
Genre: *${data.genre || "-"}*
Status: *${data.status || "-"}*
Total episode: *${data.episodes || "-"}*
Source: *${data.source || "-"}*
Hastag: *${data.hastag || "-"}*
Situs: *${data.siteUrl || "-"}*
`;

        await sock.sendMessage(
            from,
            {
                caption: caption,
                image: { url: data.coverImage.extraLarge },
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
