const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
require("../setting");

async function createSticker(buffer, isVideo = false) {
    const tempDir = path.join(__dirname, "../sampah/stiker");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const input = path.join(tempDir, `in_${Date.now()}`);
    const output = path.join(tempDir, `out_${Date.now()}.webp`);

    const inputFile = isVideo ? input + ".mp4" : input + ".jpg";

    fs.writeFileSync(inputFile, buffer);

    await new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .outputOptions([
                "-vcodec libwebp",
                "-vf scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=white@0.0,fps=15",
                "-loop 0",
                "-preset default",
                "-an",
                "-vsync 0"
            ])
            .save(output)
            .on("end", resolve)
            .on("error", reject);
    });

    const sticker = fs.readFileSync(output);

    // cleanup
    [inputFile, output].forEach(f => {
        if (fs.existsSync(f)) fs.unlinkSync(f);
    });

    return sticker;
}

module.exports = async (sock, msg, args) => {
    try {
        const from = msg.key.remoteJid;
        const quoted =
            msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const image = msg.message?.imageMessage || quoted.imageMessage;
        const video = msg.message?.videoMessage || quoted.videoMessage;
        const q = image || video;

        const logoBuffer = fs.readFileSync(
            path.join(__dirname, "../media/logo.jpg")
        );
        const bError = fs.readFileSync(
            path.join(__dirname, "../media/error.jpg")
        );

        if (!q) {
            return await sock.sendMessage(
                from,
                {
                    text: "Send/reply image/gif/video with command `.s`",
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
            react: { text: "⏳", key: msg.key }
        });

        const buffer = await downloadMediaMessage(
            msg,
            "buffer",
            {},
            { logger: console, reuploadRequest: sock.updateMediaMessage }
        );

        const stickerBuffer = await createSticker(buffer, !!video);

        await sock.sendMessage(
            from,
            {
                sticker: stickerBuffer,
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
