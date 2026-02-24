console.clear();
require("./api");
const fs = require("fs");
const axios = require("axios");
const app = api[0];
console.log(app);

const q =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9V7aZ7IJ9o5fn52OvnKAnCBFwhWm93MIHACzYo7A11A&s=10";
//https://api.danzy.web.id/api/maker/brat?text=
async function g() {
    try {
        const res = await axios.get(
            `${app}anime/what-anime?apikey=planaai&url=${encodeURIComponent(q)}`
        );

        const data = res.data.result;

        const g = data.genres.join(", ");
        console.log(data);
    } catch (err) {
        console.error("Error:", err);
    }
}

g();

// const res = await axios.get(url + encodeURIComponent(imageUrl));

// const data = res.data.result;
// const {
//     title: { english, native, romaji }
// } = data;
// const menit = data.from;
// const genre = data.genres.join(", ");

// const caption = `
// *Information*

// Judul: *${english}, ${native}, ${romaji}*
// Episode: *${data.episode}*
// Kesamaan: *${data.similarity}*
// Menit ke: *${formated(menit)}*
// Menit ke: *${data.duration}*

// Tanggal Rilis: *${data.startDate.day}-${data.startDate.month}-${data.startDate.year}*
// Musim: *${data.season}*
// Genre: *${data.genre}*
// Status: *${data.status}*
// Total episode: *${data.episodes}*
// Source: *${data.source}*
// Hastag: *${data.hastag}*
// Situs: *${data.siteUrl}*
// `;
module.exports = async (sock, msg, args) => {
    const props = Object.getOwnPropertyNames(sock);

    props.forEach((key, i) => {
        console.log(`${i + 1}. ${key} ->`, typeof sock[key]);
    });
};
