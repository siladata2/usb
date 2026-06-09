const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

const getContextInfo = (m, ownerName = "𝐒𝐈𝐋𝐀 𝐌𝐃", formattedOwnerNumber = "255789661031") => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
            body: `📞 wa.me/${formattedOwnerNumber}`,
            mediaType: 1,
            previewType: 0,
            thumbnailUrl: 'https://files.catbox.moe/98k75b.jpeg',
            sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
            renderLargerThumbnail: false,
        }
    };
};

cmd({
    pattern: "apk2",
    alias: ["app2"],
    react: "📲",
    desc: "Download APK directly",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    try {
        if (!q) return await conn.sendMessage(from, { text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎!", contextInfo: getContextInfo({ sender: sender }) }, { quoted: fkontak });

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
        const response = await axios.get(apiUrl);
        const res = response.data;

        if (!res.status || !res.result) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return await conn.sendMessage(from, { text: "❌ 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚏𝚒𝚗𝚍 𝚝𝚑𝚎 𝚊𝚙𝚙.", contextInfo: getContextInfo({ sender: sender }) }, { quoted: fkontak });
        }

        const app = res.result;

        await conn.sendMessage(from, { 
            image: { url: app.icon }, 
            caption: `📦 *${app.name}*\n⚖️ ${app.size}\n\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        await conn.sendMessage(from, {
            document: { url: app.dllink },
            mimetype: "application/vnd.android.package-archive",
            fileName: `${app.name}.apk`,
            caption: `✅ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚍\n> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("APK Error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await conn.sendMessage(from, { text: "❌ 𝙴𝚛𝚛𝚘𝚛 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝙰𝙿𝙺.", contextInfo: getContextInfo({ sender: sender }) }, { quoted: fkontak });
    }

});

