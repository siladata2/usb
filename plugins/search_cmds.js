const { cmd } = require("../command");
const axios = require("axios");

// Fake vCard for quoting
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝚂𝙴𝙰𝚁𝙲𝙷"
    }
};

// Helper function for context info
const getContextInfo = (m, sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

// ==================== 1. YOUTUBE SEARCH ====================
cmd({
    pattern: "ytsearch",
    alias: ["yts", "ytfind"],
    desc: "Search YouTube videos",
    category: "search",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ *Enter video name!*\nExample: .ytsearch sila md bot");
        
        const api = await axios.get(`https://vapis.my.id/api/ytsearch?q=${encodeURIComponent(q)}`);
        const results = api.data.result.slice(0, 9);
        
        let msg = `🎬 *YOUTUBE SEARCH RESULTS*\n\n`;
        results.forEach((video, i) => {
            msg += `${i+1}. *${video.title}*\n`;
            msg += `⏱️ ${video.duration} | 👁️ ${video.views}\n`;
            msg += `🔗 ${video.url}\n\n`;
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 2. GOOGLE SEARCH ====================
cmd({
    pattern: "google",
    alias: ["gsearch", "gg"],
    desc: "Search Google",
    category: "search",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter search query!*\nExample: .google what is bot");
        
        const api = await axios.get(`https://vapis.my.id/api/googlesearch?q=${encodeURIComponent(q)}`);
        const results = api.data.result.slice(0, 9);
        
        let msg = `🌐 *GOOGLE SEARCH RESULTS*\n\n`;
        results.forEach((item, i) => {
            msg += `${i+1}. *${item.title}*\n`;
            msg += `${item.description}\n`;
            msg += `🔗 ${item.url}\n\n`;
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 3. WIKIPEDIA SEARCH ====================
cmd({
    pattern: "wiki",
    alias: ["wikipedia", "pedia"],
    desc: "Search Wikipedia",
    category: "search",
    react: "📚",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter search term!*\nExample: .wiki whatsapp");
        
        const api = await axios.get(`https://vapis.my.id/api/wikipedia?q=${encodeURIComponent(q)}`);
        const result = api.data.result;
        
        let msg = `📚 *WIKIPEDIA*\n\n`;
        msg += `*${result.title}*\n\n`;
        msg += `${result.desc.slice(0, 1000)}...\n\n`;
        msg += `🔗 ${result.url}`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 4. DICTIONARY SEARCH ====================
cmd({
    pattern: "dictionary",
    alias: ["dict", "define"],
    desc: "Dictionary search",
    category: "search",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter word!*\nExample: .dictionary hello");
        
        const api = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${q}`);
        const data = api.data[0];
        
        let msg = `📖 *DICTIONARY*\n\n`;
        msg += `*Word:* ${data.word}\n`;
        msg += `*Phonetic:* ${data.phonetic || 'N/A'}\n\n`;
        
        data.meanings.forEach((meaning, i) => {
            msg += `*${meaning.partOfSpeech}*\n`;
            meaning.definitions.slice(0, 2).forEach((def, j) => {
                msg += `${j+1}. ${def.definition}\n`;
                if (def.example) msg += `   Example: ${def.example}\n`;
            });
            msg += '\n';
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Word not found.');
    }
});

// ==================== 5. URBAN DICTIONARY ====================
cmd({
    pattern: "urban",
    alias: ["ub", "slang"],
    desc: "Urban Dictionary search",
    category: "search",
    react: "🔥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter slang!*\nExample: .urban lit");
        
        const api = await axios.get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(q)}`);
        const def = api.data.list[0];
        
        if (!def) return reply('❌ No definition found.');
        
        let msg = `🔥 *URBAN DICTIONARY*\n\n`;
        msg += `*Word:* ${def.word}\n\n`;
        msg += `*Definition:* ${def.definition}\n\n`;
        msg += `*Example:* ${def.example}\n\n`;
        msg += `👍 ${def.thumbs_up} | 👎 ${def.thumbs_down}`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 6. IMAGE SEARCH ====================
cmd({
    pattern: "image",
    alias: ["img", "gambar"],
    desc: "Search images",
    category: "search",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter image name!*\nExample: .image cat");
        
        const api = await axios.get(`https://vapis.my.id/api/googleimage?q=${encodeURIComponent(q)}`);
        const images = api.data.result.slice(0, 5);
        
        for (let img of images) {
            await conn.sendMessage(from, { 
                image: { url: img }, 
                caption: `🖼️ *${q}*` 
            }, { quoted: m });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 7. PINTEREST SEARCH ====================
cmd({
    pattern: "pinterest",
    alias: ["pin", "pint"],
    desc: "Search Pinterest images",
    category: "search",
    react: "📌",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter search term!*\nExample: .pinterest flowers");
        
        const api = await axios.get(`https://vapis.my.id/api/pinterest?q=${encodeURIComponent(q)}`);
        const images = api.data.result.slice(0, 5);
        
        for (let img of images) {
            await conn.sendMessage(from, { 
                image: { url: img.images_url || img }, 
                caption: `📌 *PINTEREST: ${q}*` 
            }, { quoted: m });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 8. WALLPAPER SEARCH ====================
cmd({
    pattern: "wallpaper",
    alias: ["wp", "hdwall"],
    desc: "Search HD wallpapers",
    category: "search",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter wallpaper name!*\nExample: .wallpaper nature");
        
        const api = await axios.get(`https://vapis.my.id/api/wallpaper?q=${encodeURIComponent(q)}`);
        const walls = api.data.result.slice(0, 5);
        
        let msg = `🖼️ *WALLPAPER RESULTS*\n\n`;
        walls.forEach((wall, i) => {
            msg += `${i+1}. ${wall.url}\n`;
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 9. MOVIE SEARCH ====================
cmd({
    pattern: "movie2",
    alias: ["film", "movies2"],
    desc: "Search movies",
    category: "search",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter movie name!*\nExample: .movie avengers");
        
        const api = await axios.get(`http://www.omdbapi.com/?apikey=17b50faf&t=${encodeURIComponent(q)}`);
        const m = api.data;
        
        if (m.Response === 'False') return reply('❌ Movie not found.');
        
        let msg = `🎥 *MOVIE INFO*\n\n`;
        msg += `*Title:* ${m.Title}\n`;
        msg += `*Year:* ${m.Year}\n`;
        msg += `*Rated:* ${m.Rated}\n`;
        msg += `*Released:* ${m.Released}\n`;
        msg += `*Runtime:* ${m.Runtime}\n`;
        msg += `*Genre:* ${m.Genre}\n`;
        msg += `*Director:* ${m.Director}\n`;
        msg += `*Actors:* ${m.Actors}\n`;
        msg += `*IMDB:* ${m.imdbRating}/10\n`;
        msg += `*Plot:* ${m.Plot}`;
        
        if (m.Poster && m.Poster !== 'N/A') {
            await conn.sendMessage(from, { 
                image: { url: m.Poster }, 
                caption: msg 
            }, { quoted: m });
        } else {
            reply(msg);
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 10. LYRIC SEARCH ====================
cmd({
    pattern: "lyrics2",
    alias: ["lirik", "lyric2"],
    desc: "Search song lyrics",
    category: "search",
    react: "🎤",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter song name!*\nExample: .lyrics perfect");
        
        const api = await axios.get(`https://vapis.my.id/api/lyrics?q=${encodeURIComponent(q)}`);
        const lyrics = api.data.result;
        
        let msg = `🎤 *LYRICS*\n\n`;
        msg += `*Title:* ${lyrics.title}\n`;
        msg += `*Artist:* ${lyrics.artist}\n\n`;
        msg += `${lyrics.lyrics.slice(0, 2000)}`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Lyrics not found.');
    }
});

// ==================== 11. STORE SEARCH (Play Store) ====================
cmd({
    pattern: "playstore",
    alias: ["appsearch", "ps"],
    desc: "Search Play Store apps",
    category: "search",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter app name!*\nExample: .playstore whatsapp");
        
        const api = await axios.get(`https://vapis.my.id/api/playstore?q=${encodeURIComponent(q)}`);
        const apps = api.data.result.slice(0, 5);
        
        let msg = `📱 *PLAY STORE RESULTS*\n\n`;
        apps.forEach((app, i) => {
            msg += `${i+1}. *${app.title}*\n`;
            msg += `👤 ${app.developer}\n`;
            msg += `⭐ ${app.rating}/5\n`;
            msg += `📦 ${app.installs} installs\n`;
            msg += `🔗 ${app.url}\n\n`;
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 12. RECIPE SEARCH ====================
cmd({
    pattern: "recipe",
    alias: ["resep", "cooking"],
    desc: "Search recipes",
    category: "search",
    react: "🍳",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter food name!*\nExample: .recipe pizza");
        
        const api = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(q)}`);
        const meal = api.data.meals?.[0];
        
        if (!meal) return reply('❌ Recipe not found.');
        
        let ingredients = '';
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                ingredients += `- ${meal[`strIngredient${i}`]}: ${meal[`strMeasure${i}`]}\n`;
            }
        }
        
        let msg = `🍳 *RECIPE*\n\n`;
        msg += `*Name:* ${meal.strMeal}\n`;
        msg += `*Category:* ${meal.strCategory}\n`;
        msg += `*Area:* ${meal.strArea}\n\n`;
        msg += `*Ingredients:*\n${ingredients}\n`;
        msg += `*Instructions:*\n${meal.strInstructions.slice(0, 500)}...`;
        
        if (meal.strMealThumb) {
            await conn.sendMessage(from, { 
                image: { url: meal.strMealThumb }, 
                caption: msg 
            }, { quoted: m });
        } else {
            reply(msg);
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 13. BOOK SEARCH ====================
cmd({
    pattern: "book",
    alias: ["buku", "novel"],
    desc: "Search books",
    category: "search",
    react: "📕",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter book name!*\nExample: .book harry potter");
        
        const api = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`);
        const book = api.data.items?.[0]?.volumeInfo;
        
        if (!book) return reply('❌ Book not found.');
        
        let msg = `📕 *BOOK INFO*\n\n`;
        msg += `*Title:* ${book.title}\n`;
        msg += `*Author:* ${book.authors?.join(', ') || 'Unknown'}\n`;
        msg += `*Publisher:* ${book.publisher || 'Unknown'}\n`;
        msg += `*Published:* ${book.publishedDate || 'Unknown'}\n`;
        msg += `*Pages:* ${book.pageCount || 'Unknown'}\n`;
        msg += `*Categories:* ${book.categories?.join(', ') || 'Unknown'}\n`;
        msg += `*Description:* ${book.description?.slice(0, 300) || 'No description'}...`;
        
        if (book.imageLinks?.thumbnail) {
            await conn.sendMessage(from, { 
                image: { url: book.imageLinks.thumbnail }, 
                caption: msg 
            }, { quoted: m });
        } else {
            reply(msg);
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 14. NEWS SEARCH ====================
cmd({
    pattern: "news2",
    alias: ["berita", "headlines"],
    desc: "Search news",
    category: "search",
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter news topic!*\nExample: .news technology");
        
        const api = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=6b3a5f590587435996c0e6b363d11eeb`);
        const articles = api.data.articles.slice(0, 5);
        
        let msg = `📰 *NEWS RESULTS*\n\n`;
        articles.forEach((art, i) => {
            msg += `${i+1}. *${art.title}*\n`;
            msg += `📰 ${art.source.name}\n`;
            msg += `🔗 ${art.url}\n\n`;
        });
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 15. QUOTE SEARCH ====================
cmd({
    pattern: "quote",
    alias: ["quotes", "motivation"],
    desc: "Get random quotes",
    category: "search",
    react: "💭",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const api = await axios.get('https://zenquotes.io/api/random');
        const quote = api.data[0];
        
        let msg = `💭 *QUOTE*\n\n`;
        msg += `"${quote.q}"\n\n`;
        msg += `— ${quote.a}`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Failed to get quote.');
    }
});

// ==================== 16. ANIME SEARCH ====================
cmd({
    pattern: "anime",
    alias: ["animesearch"],
    desc: "Search anime",
    category: "search",
    react: "🎌",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter anime name!*\nExample: .anime naruto");
        
        const api = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=1`);
        const anime = api.data.data[0];
        
        if (!anime) return reply('❌ Anime not found.');
        
        let msg = `🎌 *ANIME INFO*\n\n`;
        msg += `*Title:* ${anime.title}\n`;
        msg += `*Japanese:* ${anime.title_japanese}\n`;
        msg += `*Type:* ${anime.type}\n`;
        msg += `*Episodes:* ${anime.episodes}\n`;
        msg += `*Status:* ${anime.status}\n`;
        msg += `*Score:* ${anime.score}/10\n`;
        msg += `*Synopsis:* ${anime.synopsis?.slice(0, 300)}...`;
        
        if (anime.images?.jpg?.image_url) {
            await conn.sendMessage(from, { 
                image: { url: anime.images.jpg.image_url }, 
                caption: msg 
            }, { quoted: m });
        } else {
            reply(msg);
        }
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 17. GAME SEARCH ====================
cmd({
    pattern: "game",
    alias: ["gamesearch"],
    desc: "Search games",
    category: "search",
    react: "🎮",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter game name!*\nExample: .game minecraft");
        
        const api = await axios.get(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(q)}&limit=1`);
        const game = api.data[0];
        
        if (!game) return reply('❌ Game not found.');
        
        let msg = `🎮 *GAME INFO*\n\n`;
        msg += `*Title:* ${game.external}\n`;
        msg += `*Cheapest:* $${game.cheapest}\n`;
        msg += `*Deal ID:* ${game.cheapestDealID}\n`;
        msg += `*Steam App ID:* ${game.steamAppID || 'N/A'}\n`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 18. WEATHER SEARCH ====================
cmd({
    pattern: "weather2",
    alias: ["cuaca", "hali"],
    desc: "Search weather",
    category: "search",
    react: "☁️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter city name!*\nExample: .weather Dar es Salaam");
        
        const api = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=0c2d2c0b4b9b5a5e5a5e5a5e5a5e5a5e&units=metric`);
        const w = api.data;
        
        let msg = `☁️ *WEATHER*\n\n`;
        msg += `*Location:* ${w.name}, ${w.sys.country}\n`;
        msg += `*Temperature:* ${w.main.temp}°C\n`;
        msg += `*Feels like:* ${w.main.feels_like}°C\n`;
        msg += `*Humidity:* ${w.main.humidity}%\n`;
        msg += `*Wind:* ${w.wind.speed} m/s\n`;
        msg += `*Weather:* ${w.weather[0].description}\n`;
        
        reply(msg);
    } catch (e) {
        reply('❌ City not found.');
    }
});

// ==================== 19. STOCK SEARCH ====================
cmd({
    pattern: "stock",
    alias: ["saham"],
    desc: "Search stock prices",
    category: "search",
    react: "📈",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter stock symbol!*\nExample: .stock AAPL");
        
        const api = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${q}&apikey=demo`);
        const stock = api.data['Global Quote'];
        
        if (!stock || Object.keys(stock).length === 0) {
            return reply('❌ Stock not found.');
        }
        
        let msg = `📈 *STOCK INFO*\n\n`;
        msg += `*Symbol:* ${stock['01. symbol']}\n`;
        msg += `*Price:* $${parseFloat(stock['05. price']).toFixed(2)}\n`;
        msg += `*Change:* ${stock['09. change']} (${stock['10. change percent']})\n`;
        msg += `*Volume:* ${stock['06. volume']}\n`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});

// ==================== 20. IP ADDRESS SEARCH ====================
cmd({
    pattern: "ip",
    alias: ["ipinfo"],
    desc: "Search IP address info",
    category: "search",
    react: "🌍",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Enter IP address!*\nExample: .ip 8.8.8.8");
        
        const api = await axios.get(`http://ip-api.com/json/${q}`);
        const data = api.data;
        
        if (data.status === 'fail') return reply('❌ Invalid IP address.');
        
        let msg = `🌍 *IP INFO*\n\n`;
        msg += `*IP:* ${data.query}\n`;
        msg += `*Country:* ${data.country}\n`;
        msg += `*Region:* ${data.regionName}\n`;
        msg += `*City:* ${data.city}\n`;
        msg += `*ISP:* ${data.isp}\n`;
        msg += `*Org:* ${data.org}\n`;
        msg += `*Timezone:* ${data.timezone}\n`;
        
        reply(msg);
    } catch (e) {
        reply('❌ Search failed.');
    }
});
