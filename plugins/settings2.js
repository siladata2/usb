const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path za settings
const SETTINGS_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'botsettings.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Default settings
const DEFAULT_SETTINGS = {
    // Owner settings
    ownerName: 'Sila Tech',
    ownerNumber: '255789661031',
    
    // Sticker settings
    stickerAuthor: 'Sila MD',
    stickerPackName: 'Sila Stickers',
    
    // Watermark settings
    watermark: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
    
    // Timezone settings
    timezone: 'Africa/Dar_es_Salaam',
    
    // Additional settings
    botName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
    botVersion: '1.0.0',
    
    // Message settings
    welcomeMessage: 'Welcome to the group!',
    goodbyeMessage: 'Goodbye!',
    
    // Feature settings
    antiLink: false,
    antiBadWord: false,
    autoBlock: false
};

// Function ya kusoma settings
function readSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_SETTINGS;
    } catch (error) {
        console.log('Error reading settings:', error);
        return DEFAULT_SETTINGS;
    }
}

// Function ya kuandika settings
function writeSettings(data) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing settings:', error);
        return false;
    }
}

// Function ya kureset settings
function resetSettings() {
    return writeSettings(DEFAULT_SETTINGS);
}

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

// ============ MAIN SETTINGS COMMAND ============
cmd({
    pattern: "settings2",
    alias: ["allsettings2", "config2", "setting2"],
    react: "⚙️",
    desc: "View all bot settings",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let settings = readSettings();
    
    let settingsText = `┏━❑ BOT SETTINGS ━━━━━━━━━
┃ 
┃ 👑 *OWNER SETTINGS:*
┃ • Owner Name: ${settings.ownerName}
┃ • Owner Number: ${settings.ownerNumber}
┃ 
┃ 🖼️ *STICKER SETTINGS:*
┃ • Author: ${settings.stickerAuthor}
┃ • Pack: ${settings.stickerPackName}
┃ 
┃ 💧 *WATERMARK:*
┃ • ${settings.watermark}
┃ 
┃ 🌍 *TIMEZONE:*
┃ • ${settings.timezone}
┃ 
┃ 🤖 *BOT INFO:*
┃ • Name: ${settings.botName}
┃ • Version: ${settings.botVersion}
┃ 
┃ 📝 *MESSAGES:*
┃ • Welcome: ${settings.welcomeMessage}
┃ • Goodbye: ${settings.goodbyeMessage}
┃ 
┃ 🛡️ *FEATURES:*
┃ • Anti Link: ${settings.antiLink ? 'ON' : 'OFF'}
┃ • Anti Bad Word: ${settings.antiBadWord ? 'ON' : 'OFF'}
┃ • Auto Block: ${settings.autoBlock ? 'ON' : 'OFF'}
┃ 
┃ *AVAILABLE COMMANDS:*
┃ 
┃ 👑 *Owner Commands:*
┃ • .setownername [name]
┃ • .setownernumber [number]
┃ 
┃ 🖼️ *Sticker Commands:*
┃ • .setstickerauthor [name]
┃ • .setstickerpackname [name]
┃ 
┃ 💧 *Watermark Commands:*
┃ • .setwatermark [text]
┃ 
┃ 🌍 *Timezone Commands:*
┃ • .settimezone [zone]
┃ 
┃ 📝 *Message Commands:*
┃ • .setwelcome [text]
┃ • .setgoodbye [text]
┃ 
┃ 🛡️ *Feature Commands:*
┃ • .antilink on/off
┃ • .antibadword on/off
┃ • .autoblock on/off
┃ 
┃ 🔄 *Other:*
┃ • .settings reset
┃ • .settings export
┃ • .settings import [json]
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(from, {
        text: settingsText,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 1. SET OWNER NAME ============
cmd({
    pattern: "setownername",
    alias: ["ownername", "setowner"],
    react: "👑",
    desc: "Set bot owner name",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide owner name\n\nExample: .setownername Sila Tech`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldName = settings.ownerName;
    const newName = args.join(' ');
    
    settings.ownerName = newName;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ OWNER NAME UPDATED ━━━━━━━━━
┃ ✅ Owner name changed
┃ ┣ Old: ${oldName}
┃ ┗ New: ${newName}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 2. SET OWNER NUMBER ============
cmd({
    pattern: "setownernumber",
    alias: ["ownernumber", "setownernum", "ownerphone"],
    react: "📞",
    desc: "Set bot owner phone number",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide owner number\n\nExample: .setownernumber 255789661031`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let number = args[0].replace(/[^0-9]/g, '');
    
    if (number.length < 10) {
        return await conn.sendMessage(from, {
            text: `❌ Invalid number format`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldNumber = settings.ownerNumber;
    
    settings.ownerNumber = number;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ OWNER NUMBER UPDATED ━━━━━━━━━
┃ ✅ Owner number changed
┃ ┣ Old: ${oldNumber}
┃ ┗ New: ${number}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 3. SET WATERMARK ============
cmd({
    pattern: "setwatermark",
    alias: ["watermark", "wm"],
    react: "💧",
    desc: "Set bot watermark text",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide watermark text\n\nExample: .setwatermark © 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldWatermark = settings.watermark;
    const newWatermark = args.join(' ');
    
    settings.watermark = newWatermark;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ WATERMARK UPDATED ━━━━━━━━━
┃ ✅ Watermark changed
┃ ┣ Old: ${oldWatermark}
┃ ┗ New: ${newWatermark}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 4. SET STICKER AUTHOR ============
cmd({
    pattern: "setstickerauthor",
    alias: ["stickerauthor", "stickerauthor", "sa"],
    react: "✍️",
    desc: "Set sticker author name",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide sticker author name\n\nExample: .setstickerauthor Sila MD`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldAuthor = settings.stickerAuthor;
    const newAuthor = args.join(' ');
    
    settings.stickerAuthor = newAuthor;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ STICKER AUTHOR UPDATED ━━━━━━━━━
┃ ✅ Sticker author changed
┃ ┣ Old: ${oldAuthor}
┃ ┗ New: ${newAuthor}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 5. SET STICKER PACK NAME ============
cmd({
    pattern: "setstickerpackname",
    alias: ["stickerpack", "stickerpackname", "spn"],
    react: "📦",
    desc: "Set sticker pack name",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide sticker pack name\n\nExample: .setstickerpackname Sila Stickers`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldPack = settings.stickerPackName;
    const newPack = args.join(' ');
    
    settings.stickerPackName = newPack;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ STICKER PACK UPDATED ━━━━━━━━━
┃ ✅ Sticker pack changed
┃ ┣ Old: ${oldPack}
┃ ┗ New: ${newPack}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 6. SET TIMEZONE ============
cmd({
    pattern: "settimezone",
    alias: ["timezone", "tz", "settz"],
    react: "🌍",
    desc: "Set bot timezone",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        const timezones = [
            'Africa/Dar_es_Salaam',
            'Africa/Nairobi',
            'Africa/Kampala',
            'Africa/Johannesburg',
            'Africa/Lagos',
            'Africa/Cairo',
            'America/New_York',
            'America/Los_Angeles',
            'Europe/London',
            'Asia/Dubai',
            'Asia/Kolkata',
            'Asia/Bangkok',
            'Asia/Shanghai',
            'Australia/Sydney'
        ];
        
        let tzList = "┏━❑ AVAILABLE TIMEZONES ━━━━━━━━━\n┃\n";
        timezones.forEach((tz, i) => {
            tzList += `┃ ${i+1}. ${tz}\n`;
        });
        tzList += `┃\n┃ Example: .settimezone Africa/Dar_es_Salaam\n┗━━━━━━━━━━━━━━━━━━━━`;
        
        return await conn.sendMessage(from, {
            text: tzList,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldTz = settings.timezone;
    const newTz = args[0];
    
    // Validate timezone (basic check)
    try {
        Intl.DateTimeFormat(undefined, { timeZone: newTz });
    } catch (e) {
        return await conn.sendMessage(from, {
            text: `❌ Invalid timezone. Use .settimezone to see available options`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    settings.timezone = newTz;
    writeSettings(settings);
    
    const currentTime = new Date().toLocaleString('en-US', { timeZone: newTz });
    
    await conn.sendMessage(from, {
        text: `┏━❑ TIMEZONE UPDATED ━━━━━━━━━
┃ ✅ Timezone changed
┃ ┣ Old: ${oldTz}
┃ ┗ New: ${newTz}
┃ 
┃ 🕐 Current Time: ${currentTime}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 7. SET WELCOME MESSAGE ============
cmd({
    pattern: "setwelcome",
    alias: ["welcomemsg", "welcome"],
    react: "👋",
    desc: "Set group welcome message",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide welcome message\n\nExample: .setwelcome Welcome to the group!`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldMsg = settings.welcomeMessage;
    const newMsg = args.join(' ');
    
    settings.welcomeMessage = newMsg;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ WELCOME MESSAGE UPDATED ━━━━━━━━━
┃ ✅ Welcome message changed
┃ ┣ Old: ${oldMsg}
┃ ┗ New: ${newMsg}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 8. SET GOODBYE MESSAGE ============
cmd({
    pattern: "setgoodbye3",
    alias: ["goodbyemsg", "goodbye"],
    react: "👋",
    desc: "Set group goodbye message",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide goodbye message\n\nExample: .setgoodbye Goodbye!`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    const oldMsg = settings.goodbyeMessage;
    const newMsg = args.join(' ');
    
    settings.goodbyeMessage = newMsg;
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `┏━❑ GOODBYE MESSAGE UPDATED ━━━━━━━━━
┃ ✅ Goodbye message changed
┃ ┣ Old: ${oldMsg}
┃ ┗ New: ${newMsg}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 9. TOGGLE ANTI LINK ============
cmd({
    pattern: "antilink3",
    alias: ["toggleantilink"],
    react: "🔗",
    desc: "Toggle anti-link feature",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    let settings = readSettings();
    
    if (args[0] === 'on') {
        settings.antiLink = true;
        await conn.sendMessage(from, {
            text: `✅ Anti-link ENABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'off') {
        settings.antiLink = false;
        await conn.sendMessage(from, {
            text: `✅ Anti-link DISABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        settings.antiLink = !settings.antiLink;
        await conn.sendMessage(from, {
            text: `✅ Anti-link: ${settings.antiLink ? 'ON' : 'OFF'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    writeSettings(settings);

} catch (e) {
    console.log(e);
}
});

// ============ 10. TOGGLE ANTI BAD WORD ============
cmd({
    pattern: "antibadword3",
    alias: ["antitoxic", "toggleantibadword"],
    react: "🔞",
    desc: "Toggle anti-bad word feature",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return;
    
    let settings = readSettings();
    
    if (args[0] === 'on') {
        settings.antiBadWord = true;
        await conn.sendMessage(from, {
            text: `✅ Anti-bad word ENABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'off') {
        settings.antiBadWord = false;
        await conn.sendMessage(from, {
            text: `✅ Anti-bad word DISABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        settings.antiBadWord = !settings.antiBadWord;
        await conn.sendMessage(from, {
            text: `✅ Anti-bad word: ${settings.antiBadWord ? 'ON' : 'OFF'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    writeSettings(settings);

} catch (e) {
    console.log(e);
}
});

// ============ 11. SETTINGS RESET ============
cmd({
    pattern: "settings reset",
    fromMe: true,
    dontAddCommandList: true
},
async(conn, mek, m, {from, sender}) => {
try{
    resetSettings();
    await conn.sendMessage(from, {
        text: `✅ All settings reset to default`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 12. SETTINGS EXPORT ============
cmd({
    pattern: "settings export",
    fromMe: true,
    dontAddCommandList: true
},
async(conn, mek, m, {from, sender}) => {
try{
    let settings = readSettings();
    const exportData = JSON.stringify(settings, null, 2);
    
    await conn.sendMessage(from, {
        text: `┏━❑ EXPORT SETTINGS ━━━━━━━━━\n┃\n┃ \`\`\`${exportData}\`\`\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ============ 13. SETTINGS IMPORT ============
cmd({
    pattern: "settings import",
    fromMe: true,
    dontAddCommandList: true
},
async(conn, mek, m, {from, sender, args}) => {
try{
    const importData = args.join(' ');
    const imported = JSON.parse(importData);
    
    let settings = readSettings();
    settings = { ...settings, ...imported };
    writeSettings(settings);
    
    await conn.sendMessage(from, {
        text: `✅ Settings imported successfully`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Invalid JSON format`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});

// ============ FUNCTIONS ZA KUPATA SETTINGS ============

// Get owner name
async function getOwnerName() {
    const settings = readSettings();
    return settings.ownerName;
}

// Get owner number
async function getOwnerNumber() {
    const settings = readSettings();
    return settings.ownerNumber;
}

// Get watermark
async function getWatermark() {
    const settings = readSettings();
    return settings.watermark;
}

// Get sticker author
async function getStickerAuthor() {
    const settings = readSettings();
    return settings.stickerAuthor;
}

// Get sticker pack name
async function getStickerPack() {
    const settings = readSettings();
    return settings.stickerPackName;
}

// Get timezone
async function getTimezone() {
    const settings = readSettings();
    return settings.timezone;
}

// Get welcome message
async function getWelcomeMessage() {
    const settings = readSettings();
    return settings.welcomeMessage;
}

// Get goodbye message
async function getGoodbyeMessage() {
    const settings = readSettings();
    return settings.goodbyeMessage;
}

// Get formatted time based on timezone
async function getFormattedTime(format = 'full') {
    const settings = readSettings();
    const options = {
        timeZone: settings.timezone,
        hour12: true
    };
    
    if (format === 'full') {
        options.weekday = 'long';
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    } else if (format === 'date') {
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
    } else if (format === 'time') {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }
    
    return new Date().toLocaleString('en-US', options);
}

// Export all functions
module.exports = {
    // Settings commands are auto-loaded by cmd()
    
    // Getter functions
    getOwnerName,
    getOwnerNumber,
    getWatermark,
    getStickerAuthor,
    getStickerPack,
    getTimezone,
    getWelcomeMessage,
    getGoodbyeMessage,
    getFormattedTime,
    
    // Settings functions
    readSettings,
    writeSettings,
    resetSettings
};
