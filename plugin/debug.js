module.exports = async (sock, msg, args) => {
    const from = msg.key.remoteJid;
    const send = msg.key.senderPn ? msg.key.senderPn.split("@")[0] : "Unknown";
    try {
        await sock.sendMessage(
            from,
            {
                text: send
            },
            {
                quoted: msg
            }
        );
    } catch (err) {
        console.error("Error:", err);
    }
};
