const { cmd } = require('../command');

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝐒𝐈𝐋𝐀 𝐌𝐃"
    }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ MOVIE COMMAND ============
cmd({
    pattern: "movie",
    alias: ["movies", "swahiliflix", "filamu"],
    react: "🎬",
    desc: "Swahiliflix movie service information",
    category: "info",
    filename: __filename
},
async(conn, mek, m, {from, sender, pushname, reply}) => {
try{
    const movieInfo = `┏━❑ *SWAHILIFLIX MOVIES* ━━━━━━━━━
┃ 
┃ 👋 *Habari ${pushname || 'Mjumbe'}!*
┃ 
┃ ╔══════════════════════╗
┃      *1. SISI NI NANI?*
┃ ╚══════════════════════╝
┃ 🔹 Jina letu ni *Swahiliflix*
┃ 🔹 Tunapatikana *Tanzania*
┃ 
┃ ╔══════════════════════╗
┃     *2. TUNAHUSIKA NA NINI?*
┃ ╚══════════════════════╝
┃ 🔹 Tunahusika na utoaji wa huduma bora 
┃    za movie za aina zote zilizotafsiriwa 
┃    kwa lugha ya *Kiswahili*
┃ 
┃ ╔══════════════════════╗
┃    *3. TUNATOAJE HUDUMA YETU?*
┃ ╚══════════════════════╝
┃ 🔹 Huduma yetu ya movie tunaitoa kupitia 
┃    *App yetu maalum* ya Swahiliflix
┃ 🔹 *Sio WhatsApp* - tofauti na huduma 
┃    nyingi ulizozoea
┃ 
┃ ╔══════════════════════╗
┃  *4. MAELEKEZO YA KUTUMIA APP*
┃ ╚══════════════════════╝
┃ 👇 *Bonyeza hapa kupata maelekezo:*
┃ 📹 *Video Guide:*
┃ https://drive.google.com/file/d/1faQ6MgvyezWJSO_XPANmLMtHsu0yorI5/view
┃ 
┃ ╔══════════════════════╗
┃  *5. MAMBO MUHIMU YA KUFAHAMU*
┃ ╚══════════════════════╝
┃ 🔹 *Season zote* kuanzia *Episode 1 – 8* 
┃    ni *BURE (OFA)* - mtu yeyote anaweza 
┃    kuangalia
┃ 🔹 Kuanzia *Episode 9* hadi mwisho, 
┃    zimefungwa na zinafunguliwa kwa 
┃    *wanachama waliojiunga* tu
┃ 🔹 *Single movies* zote zimefungwa na 
┃    zinapatikana kwa *waliojiunga* tu
┃ 🔹 Ili kuangalia movie kwenye app, 
┃    lazima uwe na *MB (data)*
┃ 🔹 Unaweza *kudownload movie* kwa 
┃    matumizi ya *offline*
┃ 
┃ ╔══════════════════════╗
┃    *6. GHARAMA ZA KUJIUNGA*
┃ ╚══════════════════════╝
┃ 💰 *Mwezi 1*  ━  *4,000 TZS*
┃ 💰 *Miezi 2*  ━  *8,000 TZS*
┃ 💰 *Miezi 3*  ━  *12,000 TZS*
┃ 
┃ ╔══════════════════════╗
┃   *7. FAIDA ZA MTEJA ANAPOJIUNGA*
┃ ╚══════════════════════╝
┃ ✅ *Unafunguliwa movie zote* 
┃    zilizopo ndani ya app
┃ ✅ Unapata huduma *bila usumbufu*
┃ ✅ Unapata movie kwa *ubora wa 
┃    hali ya juu*
┃ 
┃ ╔══════════════════════╗
┃       *8. UWAMINIFU WETU*
┃ ╚══════════════════════╝
┃ 🔒 Huduma yetu ni *salama kwa 100%*
┃ 🤝 Watoa huduma wetu wanajua maana 
┃    halisi ya *uwaminifu, uaminifu* na 
┃    *huduma bora kwa mteja*
┃ 
┃ ╔══════════════════════╗
┃   *9. NJIA YA KUJIUNGA NA HUDUMA*
┃ ╚══════════════════════╝
┃ 👇 *Bonyeza hapa kujiunga:*
┃ 🔗 https://wa.me/256756076875?text=%F0%9F%92%B3NIPE%20NAMBA%20NILIPIE%20HUDUMA%20YA%20MOVIE
┃ 
┃ ╔══════════════════════╗
┃        *🌐 WEBSITE YETU*
┃ ╚══════════════════════╝
┃ 🔗 https://swahilimoviestudio01.blogspot.com
┃ 
┃ ════ *📲 Swahiliflix* ════
┃ *Movie bora kwa Kiswahili*
┃ *Kwa urahisi na uaminifu*
┗━━━━━━━━━━━━━━━━━━━━

> © 𝐒𝐈𝐋𝐀 𝐌𝐃`;

    await conn.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/nryse9.jpg' }, // Replace with actual image URL
        caption: movieInfo,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    reply(`❌ Error: ${e.message}`);
}
});

// ============ SHORT VERSION ============
cmd({
    pattern: "moviehelp",
    alias: ["movieinfo", "filamuhelp"],
    react: "🎥",
    desc: "Short movie service info",
    category: "info",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const shortInfo = `┏━❑ *SWAHILIFLIX* ━━━━━━━━━
┃ 
┃ 🎬 *Movie Service Tanzania*
┃ 
┃ 💰 *PRICE:*
┃ • Mwezi 1: 4,000 TZS
┃ • Miezi 2: 8,000 TZS
┃ • Miezi 3: 12,000 TZS
┃ 
┃ ✅ *BURE:* Season 1-8 (Ep 1-8)
┃ 🔒 *Members:* Ep 9+ & Single movies
┃ 
┃ 📲 *App* (sio WhatsApp)
┃ 
┃ 👇 *JIUNGE:*
┃ https://wa.me/256756076875?text=%F0%9F%92%B3NIPE%20NAMBA%20NILIPIE%20HUDUMA%20YA%20MOVIE
┃ 
┃ 🌐 *Website:*
┃ https://swahilimoviestudio01.blogspot.com
┃ 
┃ 📹 *Maelekezo:*
┃ https://drive.google.com/file/d/1faQ6MgvyezWJSO_XPANmLMtHsu0yorI5/view
┃ 
┗━━━━━━━━━━━━━━━━━━━━

> *Movie bora kwa Kiswahili*`;

    await conn.sendMessage(from, {
        text: shortInfo,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ PRICE COMMAND ============
cmd({
    pattern: "movieprice",
    alias: ["price", "bei"],
    react: "💰",
    desc: "Movie subscription prices",
    category: "info",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const priceInfo = `┏━❑ *BEI ZA KUJIUNGA* ━━━━━━━━━
┃ 
┃ 💰 *Mwezi 1* ━ *4,000 TZS*
┃ 💰 *Miezi 2* ━ *8,000 TZS*
┃ 💰 *Miezi 3* ━ *12,000 TZS*
┃ 
┃ ✅ *BURE:* Season zote Episode 1-8
┃ 🔒 *Members:* Episode 9+ na Single movies
┃ 
┃ 👇 *JIUNGE SASA:*
┃ https://wa.me/256756076875?text=%F0%9F%92%B3NIPE%20NAMBA%20NILIPIE%20HUDUMA%20YA%20MOVIE
┃ 
┗━━━━━━━━━━━━━━━━━━━━

> *Swahiliflix - Movie bora kwa Kiswahili*`;

    await conn.sendMessage(from, {
        text: priceInfo,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ JOIN COMMAND ============
cmd({
    pattern: "moviejoin",
    alias: ["joinmovie", "jisajili"],
    react: "🔗",
    desc: "Movie subscription link",
    category: "info",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const joinInfo = `┏━❑ *JIUNGE NA SWAHILIFLIX* ━━━━━━━━━
┃ 
┃ 👇 *Bonyeza link hapa chini:*
┃ 🔗 https://wa.me/256756076875?text=%F0%9F%92%B3NIPE%20NAMBA%20NILIPIE%20HUDUMA%20YA%20MOVIE
┃ 
┃ 💰 *Bei:* 4,000 TZS (Mwezi 1)
┃ 
┃ 📋 *Unapata:* Movie zote + Season kamili
┃ 
┗━━━━━━━━━━━━━━━━━━━━

> *Kwa Kiswahili, kwa urahisi*`;

    await conn.sendMessage(from, {
        text: joinInfo,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ GUIDE COMMAND ============
cmd({
    pattern: "movieguide",
    alias: ["guide", "maelekezo"],
    react: "📹",
    desc: "Movie app guide",
    category: "info",
    filename: __filename
},
async(conn, mek, m, {from, sender, reply}) => {
try{
    const guideInfo = `┏━❑ *MAELEKEZO YA APP* ━━━━━━━━━
┃ 
┃ 👇 *Bonyeza hapa kuona video ya maelekezo:*
┃ 📹 https://drive.google.com/file/d/1faQ6MgvyezWJSO_XPANmLMtHsu0yorI5/view
┃ 
┃ *Maelezo ya haraka:*
┃ 🔹 Season 1-8 (Ep 1-8) ni *BURE*
┃ 🔹 Ep 9+ na Single movies ni *Members only*
┃ 🔹 Tumia *data* au *download* kwa offline
┃ 
┗━━━━━━━━━━━━━━━━━━━━

> *Swahiliflix - Rahisi na bora*`;

    await conn.sendMessage(from, {
        text: guideInfo,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});