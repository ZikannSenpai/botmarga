require("../setting");
const path = require("path");
const fs = require("fs");

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const sender = msg.key.senderPn
        ? msg.key.senderPn.split("@")[0]
        : "Unknown";

    const margaPath = path.join(__dirname, "../media/marga.jpg");
    const margaBuffer = fs.readFileSync(margaPath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);

    try {
        if (from !== "120363405516392217@g.us") {
            return sock.sendMessage(
                from,
                {
                    text: "Can only be used in selesion marga groups.",
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
        if (sender !== "6282324913875") {
            return sock.sendMessage(
                from,
                {
                    text: "Your are not have access.",
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

        await sock.sendMessage(from, {
            text: `_*Formulir Seleksi Marga*_
          Seleksi ini bertujuan agar owner dan admin bisa mengenali member
          
          1. Nama tiktok anda?.
          2. Alasan anda ingin bergabung ke marga *Kinosaki*?.
          3. Darimana anda tahu marga *Kinosaki*?.
          
          *Jika sudah di jawab silahkan kirim jawaban anda di grup ini dan jangan lupa tag owner/admin, terimakasih.*
          `,
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
                    thumbnail: margaBuffer,
                    sourceUrl: `${zik.linkTt}`,
                    mediaType: 1,
                    mediaUrl: `${zik.linkTt}`,
                    renderLargerThumbnail: true,
                    containsAdReply: true
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
};
