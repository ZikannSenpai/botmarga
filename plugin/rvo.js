const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
require("../setting");
const path = require("path");
const fs = require("fs");

module.exports = async (sock, msg, args) => {
    try {
        const from = msg.key.remoteJid;
        let quoted = msg.quoted;
        const imagePath = path.join(__dirname, "../media/logo.jpg");
        const logoBuffer = fs.readFileSync(imagePath);
        const margaPath = path.join(__dirname, "../media/marga.jpg");
        const margaBuffer = fs.readFileSync(margaPath);
        const errorPath = path.join(__dirname, "../media/error.jpg");
        const bError = fs.readFileSync(errorPath);

        if (!quoted) {
            return sock.sendMessage(
                from,
                {
                    text: "⚠️ Reply photo view-once first!.",
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
                            containsAdReply: true
                        }
                    }
                },
                { quoted: msg }
            );
        }

        if (quoted.viewOnceMessageV2) quoted = quoted.viewOnceMessageV2.message;
        if (quoted.viewOnceMessage) quoted = quoted.viewOnceMessage.message;

        const mediaMsg =
            quoted.imageMessage || quoted.videoMessage || quoted.audioMessage;

        if (!mediaMsg) {
            return sock.sendMessage(
                from,
                {
                    text: "⚠️ That not view-once message!.",
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
                            containsAdReply: true,
                            showAdAttribution: true
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

        const mime = mediaMsg.mimetype || "";
        const mediaType = /image/.test(mime)
            ? "image"
            : /video/.test(mime)
              ? "video"
              : "audio";

        const stream = await downloadContentFromMessage(mediaMsg, mediaType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (/image/.test(mime)) {
            await sock.sendMessage(
                from,
                {
                    image: buffer,
                    caption: mediaMsg.caption || ""
                },
                { quoted: msg }
            );
            await sock.sendMessage(from, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });
        } else if (/video/.test(mime)) {
            await sock.sendMessage(
                from,
                {
                    video: buffer,
                    caption: mediaMsg.caption || ""
                },
                { quoted: msg }
            );
            await sock.sendMessage(from, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });
        } else if (/audio/.test(mime)) {
            await sock.sendMessage(
                from,
                { audio: buffer, mimetype: "audio/mpeg", ptt: true },
                { quoted: msg }
            );
            await sock.sendMessage(from, {
                react: {
                    text: "✅",
                    key: msg.key
                }
            });
        }
    } catch (err) {
        console.error("Error:", err);
        await sock.sendMessage(
            msg.key.remoteJid,
            {
                text: "cant open view-once!"
            },
            { quoted: msg }
        );
        await sock.sendMessage(msg.key.remoteJid, {
            react: {
                text: "❌",
                key: msg.key
            }
        });
    }
};
