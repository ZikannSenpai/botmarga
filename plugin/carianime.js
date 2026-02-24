const fs = require("fs");
const path = require("path");
const axios = require("axios");
require("../setting");
require("../api");
const app = api[0];

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const url = `${app}anime/search/`;
    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);
    const errorPath = path.join(__dirname, "../media/error.jpg");
    const bError = fs.readFileSync(errorPath);
    try {
        if (!args || !args.length) {
            return sock.sendMessage(
                from,
                {
                    text: "Masukan judul anime!\nContoh: *.carianime tonikaku*",
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
        const text = encodeURIComponent(args.join(" "));
        const link = `${url}${text}`;
        const res = await axios.get(link);
        const data = res.data.data.animeList[0];
        const genre = data.genreList.map(g => g.title).join(", ");
        let reply = "";
        if (!res.data.ok) {
            reply = "Data tidak ditemukan.";
        }
        reply = `
Judul: *${data.title}*
Status: *${data.status}*
Rating: *${data.score}*
Genre: *${genre}*
`;

        await sock.sendMessage(
            from,
            {
                caption: reply,
                image: { url: data.poster },
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
