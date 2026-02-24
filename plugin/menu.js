const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
require("moment/locale/id");
require("../setting");
moment.locale("id");

module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const sender = msg.pushName;
    const nomor = msg.key.senderPn ? msg.key.senderPn.split("@")[0] : "Unknown";
    const imagePath = path.join(__dirname, "../media/logo.jpg");
    const logoBuffer = fs.readFileSync(imagePath);

    const tanggal = moment().tz("Asia/Jakarta").format("dddd, DD MMMM YYYY");
    const jam = moment().tz("Asia/Jakarta").hour();
    let emojiWaktu = "🕒";
    if (jam >= 5 && jam < 11) emojiWaktu = "🌅";
    else if (jam >= 11 && jam < 15) emojiWaktu = "☀️";
    else if (jam >= 15 && jam < 18) emojiWaktu = "🌇";
    else if (jam >= 18 && jam < 22) emojiWaktu = "🌌";

    const waktu =
        moment().tz("Asia/Jakarta").format("HH:mm") + " " + emojiWaktu;
    try {
        await sock.sendMessage(from, {
            text: `
☉────『 *ɪɴғᴏ ʙᴏᴛ* 』────☉

ㄔ ɴᴀᴍᴀ: *${sender}*
ㄔ ɴᴏᴍᴏʀ: *${nomor}*

ㄔ ʏᴏᴋᴏsʜᴏ: *${sender}*
ㄔ ᴛᴀɴɢɢᴀʟ: *${tanggal}*
ㄔ ᴡᴀᴋᴛᴜ: *${waktu}*

ㄔ ɴᴀᴍᴀ ʙᴏᴛ: *${zik.namaBot}*
ㄔ ʟᴀɴɢᴜᴀɢᴇ : *ᴊᴀᴠᴀsᴄʀɪᴘᴛ*
ㄔ ᴛʏᴘᴇ : *ᴄᴏᴍᴍᴏɴᴊs*
ㄔ ᴅᴇᴠᴇʟᴏᴘᴇʀ : *${zik.namaOwner}*
ㄔ ᴄᴏɴᴛᴀᴄᴛ ᴜs : *6285775359514*

╔──『 *ᴀʟʟ ᴍᴇɴᴜ* 』
│ツ .brat
│ツ .carianime
│ツ .halo
│ツ .jadwalanime
│ツ .judulanime
│ツ .menu
│ツ .nahida(eror)
│ツ .pins
│ツ .quotes
│ツ .rba
│ツ .rhonkai
│ツ .rvo
│ツ .rwaifu
│ツ .s
│ツ .tt
│ツ .tts
│ツ .yts
╚─────────────☉

╔──『 *ᴍᴀʀɢᴀ  ᴍᴇɴᴜ* 』
│ツ .form
│ツ .hastag(on going)
╚─────────────☉


*Bingung mau cari teman curhat/anime?, join grup ini aja!*
*https://chat.whatsapp.com/CHJvhd7W55vLnPY1ApBdFT*
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
                    thumbnail: logoBuffer,
                    sourceUrl: `${zik.linkTt}`,
                    mediaType: 1,
                    mediaUrl: `${zik.linkTt}`,
                    renderLargerThumbnail: true,
                    containsAdReply: false
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
};
