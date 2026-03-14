const {
    makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const chalk = require("chalk");
const P = require("pino");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const express = require("express");
const path = require("path");
require("./setting");
const moment = require("moment-timezone");
const app = express();
let qrGlobal = null;
require("moment/locale/id");
moment.locale("id");
let plugins = {};

// 📂 Buat folder sampah kalau belum ada
const logDir = path.join(__dirname, "sampah");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const msgLogPath = path.join(logDir, "msg.log");
const crashLogPath = path.join(logDir, "crash.log");

async function deleteSession() {
    try {
        await fs.rm("session", { recursive: true, force: true });
        console.log("Folder berhasil dihapus");
    } catch (err) {
        console.error(err);
    }
}

function loadPlugins() {
    const pluginPath = path.join(__dirname, "plugin");
    fs.readdirSync(pluginPath).forEach(file => {
        if (file.endsWith(".js")) {
            const pluginName = file.replace(".js", "");
            delete require.cache[require.resolve(`./plugin/${file}`)];
            plugins[pluginName] = require(`./plugin/${file}`);
            console.log(
                `${chalk.green(
                    "[ ZikkSenpai ]"
                )} ✅ Plugin loaded: ${pluginName}`
            );
        }
    });
}

function watchPlugins() {
    const pluginPath = path.join(__dirname, "plugin");
    fs.watch(pluginPath, (eventType, filename) => {
        if (filename && filename.endsWith(".js")) {
            try {
                const pluginName = filename.replace(".js", "");
                delete require.cache[require.resolve(`./plugin/${filename}`)];
                plugins[pluginName] = require(`./plugin/${filename}`);
                console.log(
                    `${chalk.green("[ ZikkSenpai ]")} ♻️ ${chalk.cyan(
                        "Plugin"
                    )} reloaded: ${pluginName}`
                );
            } catch (err) {
                console.error(`❌ Gagal reload plugin ${filename}:`, err);
                fs.appendFileSync(
                    crashLogPath,
                    `[${new Date().toLocaleString(
                        "id-ID"
                    )}] Gagal reload ${filename}: ${err}\n`
                );
            }
        }
    });
}

function getQuotedRaw(msg) {
    let quotedMsg = null;
    for (const k of Object.keys(msg.message)) {
        const m = msg.message[k];
        if (m?.contextInfo?.quotedMessage) {
            quotedMsg = m.contextInfo.quotedMessage;
            break;
        }
    }
    if (
        !quotedMsg &&
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    ) {
        quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
    }
    return quotedMsg;
}

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./session");
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            version,
            auth: state,
            logger: P({ level: "silent" }),
            browser: ["Zikkmd", "Opera", "1.0.0"]
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", update => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                qrGlobal = qr;
                console.log("QR tersedia di /qr");
            }

            if (connection === "open") {
                console.log(
                    `${chalk.green(
                        "[ ZikkSenpai ]"
                    )} ✅ berhasil konek ke WhatsApp!`
                );
            }

            if (connection === "close") {
                const reason = lastDisconnect?.error?.output?.statusCode;

                console.log("❌ Koneksi terputus:", reason);

                fs.appendFileSync(
                    crashLogPath,
                    `[${new Date().toLocaleString(
                        "id-ID"
                    )}] Disconnect: ${reason}\n`
                );

                if (reason === DisconnectReason.loggedOut) {
                    console.log("Session log out, menghapus folder session...");
                    deleteSession();
                } else {
                    console.log("🔄 Reconnecting...");
                    setTimeout(() => startBot(), 3000);
                }
            }
        });

        sock.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message || !msg.key.remoteJid) return;

            // 🔥 AUTO READ
            try {
                if (zik.autoread) {
                    await sock.readMessages([msg.key]);
                }
            } catch (err) {
                console.error("❌ Gagal auto read:", err);
                fs.appendFileSync(
                    crashLogPath,
                    `[${new Date().toLocaleString(
                        "id-ID"
                    )}] Auto read error: ${err}\n`
                );
            }

            if (msg.key && msg.key.remoteJid === "status@broadcast") return;

            // 📝 LOG PESAN
            const msgId = msg.key.id;
            const from = msg.key.remoteJid;
            const sender = msg.key.participant || from;
            const messageType = Object.keys(msg.message)[0];
            const tanggal = moment()
                .tz("Asia/Jakarta")
                .format("dddd, DD MMMM YYYY");
            const jam = moment().tz("Asia/Jakarta").hour();
            let emojiWaktu = "🕒";
            if (jam >= 5 && jam < 11) emojiWaktu = "🌅";
            else if (jam >= 11 && jam < 15) emojiWaktu = "☀️";
            else if (jam >= 15 && jam < 18) emojiWaktu = "🌇";
            else if (jam >= 18 && jam < 22) emojiWaktu = "🌌";

            const waktu =
                moment().tz("Asia/Jakarta").format("HH:mm") + " " + emojiWaktu;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text ||
                msg.message.imageMessage?.caption ||
                msg.message.videoMessage?.caption ||
                "";

            const logMsg = `
${chalk.red("====================")}
📩  ${chalk.cyan("Pesan Masuk")}
├─ 📍 ${chalk.yellow("From")}     : ${chalk.blue(from)}
├─ 👤 ${chalk.magenta("Sender")}   : ${chalk.green(sender)}
├─ 🆔 ${chalk.greenBright("MsgID")}    : ${chalk.red(msgId)}
├─ ⏰ ${chalk.yellowBright("Waktu")}    : ${chalk.cyan(waktu)}
├─ 📦 ${chalk.cyanBright("Tipe")}     : ${chalk.yellow(messageType)}
└─ 📝 ${chalk.blueBright("Isi")}      : ${chalk.green(text || "-")}
${chalk.red("====================")}
`;

            const loggermsg = `
====================
📩 Pesan Masuk
├─ 📍 From     : ${from}
├─ 👤 Sender   : ${sender}
├─ 🆔 MsgID    : ${msgId}
├─ ⏰ Waktu    : ${waktu}
├─ 📦 Tipe     : ${messageType}
└─ 📝 Isi      : ${text || "-"}
====================
`;

            console.log(logMsg);
            fs.appendFileSync(msgLogPath, loggermsg);

            const wrapper = {
                ...msg,
                from,
                text,
                quoted: getQuotedRaw(msg)
            };

            if (text === "assalamualaikum") {
                await sock.sendMessage(
                    from,
                    {
                        text: "waalaikumsalam"
                    },
                    { quoted: msg }
                );
            }
            if (!text.startsWith(".")) return;

            const args = text.slice(1).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            if (plugins[command]) {
                try {
                    await plugins[command](sock, wrapper, args, {
                        isOwner: msg.key.fromMe
                    });
                } catch (e) {
                    console.error(`❌ Error di plugin ${command}:`, e);
                    fs.appendFileSync(
                        crashLogPath,
                        `[${new Date().toLocaleString(
                            "id-ID"
                        )}] Error plugin ${command}: ${e}\n`
                    );
                    await sock.sendMessage(from, {
                        text: "⚠️ Terjadi error di plugin"
                    });
                }
            }
        });
    } catch (err) {
        console.error("❌ Fatal start error:", err);
        fs.appendFileSync(
            crashLogPath,
            `[${new Date().toLocaleString(
                "id-ID"
            )}] Start error: ${err.stack}\n`
        );

        setTimeout(() => startBot(), 5000);
    }
}

loadPlugins();
watchPlugins();
startBot();

app.get("/", (req, res) => {
    res.send("bot hidup");
});

app.get("/qr", async (req, res) => {
    if (!qrGlobal) return res.send("QR belum ada / sudah login");

    const img = await QRCode.toDataURL(qrGlobal);
    res.send(`<img src="${img}">`);
});
// 🛡️ Anti Crash biar bot ga mati di panel
process.on("uncaughtException", err => {
    console.error("❌ Uncaught Exception:", err);
    fs.appendFileSync(
        crashLogPath,
        `[${new Date().toLocaleString("id-ID")}] UncaughtException: ${
            err.stack
        }\n`
    );
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection:", reason);
    fs.appendFileSync(
        crashLogPath,
        `[${new Date().toLocaleString(
            "id-ID"
        )}] UnhandledRejection: ${reason}\n`
    );
});

process.on("SIGINT", () => {
    console.log("🛑 Bot dimatikan dengan aman...");
    process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Web aktif di port", PORT);
});
