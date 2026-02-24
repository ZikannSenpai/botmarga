module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const nama = msg.pushName;
    try {
        await sock.sendMessage(
            from,
            {
                text: `halo juga, ${nama}!`
            },
            { quoted: msg }
        );
    } catch (err) {
        console.error("Error:", err);
    }
};
