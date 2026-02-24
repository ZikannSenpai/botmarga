const { EmbeddedMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

const imagePath = path.join(__dirname, "./media/logo.jpg");
//console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(was)));
async function g() {
    const buffer = fs.readFileSync(imagePath);

    const link = await catbox.uploadFile({
        path: imagePath
    });

    console.log(link);
}

g().catch(console.error);
