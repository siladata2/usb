const { cmd, commands } = require('../command');
const axios = require('axios');

// FakevCard sawa na zilizopita
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

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

cmd({
    pattern: "pair",
    alias: ["code", "bot"],
    react: "✅",
    desc: "Get pairing code for SILA-MD bot",
    category: "download",
    use: ".pair 254111***",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply, sender }) => {
    try {
        // Extract phone number from command
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number format
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚠𝚒𝚝𝚑𝚘𝚞𝚝 `+`\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: `.pair 254111***`\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Make API request to get pairing code
        const response = await axios.get(`https://sila-md-sessions-26ea9c5d8dd1.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚛𝚎𝚝𝚛𝚒𝚎𝚟𝚎 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const pairingCode = response.data.code;
        const doneMessage = "> *𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳*";

        // Send initial message with formatting
        await conn.sendMessage(from, { 
            text: `${doneMessage}\n\n*𝚈𝚘𝚞𝚛 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎 𝚒𝚜:* ${pairingCode}\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        // Optional 2-second delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send clean code again
        await conn.sendMessage(from, { 
            text: `\`\`\`${pairingCode}\`\`\`\n\n> © Powered by Sila Tech`, 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

    } catch (error) {
        console.error("Pair command error:", error);
        await conn.sendMessage(from, { 
            text: "❌ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚐𝚎𝚝𝚝𝚒𝚗𝚐 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
});

cmd({
    pattern: "pair2",
    alias: ["getpair", "reqpair", "clonebot"],
    react: "📉",
    desc: "Get pairing code for SILA-MD bot",
    category: "download",
    use: ".pair 254727582XXX",
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply, sender }) => {
    try {
        // Check if in group
        if (isGroup) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚌𝚑𝚊𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚖𝚎 𝚍𝚒𝚛𝚎𝚌𝚝𝚕𝚢.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Extract phone number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚏𝚘𝚛𝚖𝚊𝚝!\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎: `.pair 2547000000000`\n(𝚆𝚒𝚝𝚑𝚘𝚞𝚝 + 𝚜𝚒𝚐𝚗)\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        // Get pairing code from API
        const response = await axios.get(`https://sila-md-sessions-26ea9c5d8dd1.herokuapp.com/code?number=${encodeURIComponent(phoneNumber)}`);
        
        if (!response.data?.code) {
            return await conn.sendMessage(from, { 
                text: "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by Sila Tech", 
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }

        const pairingCode = response.data.code;
        
        // Send image with caption
        const sentMessage = await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/98k75b.jpeg" }, // Sila MD logo
            caption: `╭━━〔 🤖 *𝚂𝙸𝙻𝙰 𝙼𝙳 𝙿𝙰𝙸𝚁𝙸𝙽𝙶* 〕━━┈⊷
┃
┃ 📱 𝙽𝚞𝚖𝚋𝚎𝚛: ${phoneNumber}
┃
┃ 🔢 *𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎*: 
┃ \`\`\`${pairingCode}\`\`\`
┃
┃ 📌 𝙽𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚜𝚎𝚗𝚝 𝚝𝚘 𝚢𝚘𝚞𝚛 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙.
┃
┃ ✨ 𝙲𝚘𝚙𝚢 𝚝𝚑𝚎 𝚌𝚘𝚍𝚎 𝚊𝚋𝚘𝚟𝚎 𝚝𝚘 𝚙𝚊𝚒𝚛 𝚢𝚘𝚞𝚛 𝚍𝚎𝚟𝚒𝚌𝚎
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © Powered by Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });

        // Send clean code separately
        await conn.sendMessage(from, { 
            text: `\`\`\`${pairingCode}\`\`\``,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
        // Add ✅ reaction to the clean code message
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("Pair command error:", error);
        await conn.sendMessage(from, { 
            text: "❌ 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by Sila Tech", 
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

});

