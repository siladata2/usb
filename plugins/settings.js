const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment-timezone');

// ==================== PATHS & DIRECTORIES ====================
const SETTINGS_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'botsettings.json');
const ANTICALL_FILE = path.join(SETTINGS_DIR, 'anticall.json');
const BOTNAME_FILE = path.join(SETTINGS_DIR, 'botname.json');
const IGNORE_LIST_FILE = path.join(SETTINGS_DIR, 'ignorelist.json');
const COUNTRY_CODES_FILE = path.join(SETTINGS_DIR, 'countrycodes.json');
const AUTO_BLOCK_FILE = path.join(SETTINGS_DIR, 'autoblock.json');
const MENU_SETTINGS_FILE = path.join(SETTINGS_DIR, 'menusettings.json');
const EMOJI_SETTINGS_FILE = path.join(SETTINGS_DIR, 'statusemoji.json');

// Create directories if not exist
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// ==================== DEFAULT SETTINGS ====================

// Default main settings
const DEFAULT_SETTINGS = {
    // Owner settings
    ownerName: 'Sila Tech',
    ownerNumber: '255789661031',
    
    // Bot settings
    botName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
    botVersion: '1.0.0',
    timezone: 'Africa/Dar_es_Salaam',
    language: 'en',
    mode: 'public',
    prefix: '.',
    
    // Sticker settings
    stickerAuthor: 'Sila MD',
    stickerPackName: 'Sila Stickers',
    
    // Watermark settings
    watermark: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
    
    // Menu settings
    menuImage: 'https://files.catbox.moe/36vahk.png',
    menuStyle: 'v1',
    menuTheme: 'default',
    
    // Message settings
    welcomeMessage: 'Welcome to the group!',
    goodbyeMessage: 'Goodbye!',
    
    // Feature toggles
    antiLink: false,
    antiBadWord: false,
    antiForeign: false,
    antiBot: false,
    antiSpam: false,
    antiNSFW: false,
    antiCall: false,
    
    // Warning settings
    warnCount: 3,
    warnAction: 'kick',
    
    // Database settings
    autoBackup: false,
    backupInterval: 24 // hours
};

// Default anticall settings
const DEFAULT_ANTICALL = {
    enabled: false,
    message: "📵 *Anti-Call Activated*\n\nBot does not accept calls. Please use text messages only.\n\n> 𝐒𝐈𝐋𝐀 𝐌𝐃",
    action: "reject", // reject, block, ignore
    logCalls: true,
    allowedContacts: []
};

// Default ignore list
const DEFAULT_IGNORE_LIST = {
    users: [],
    groups: []
};

// Default auto block settings
const DEFAULT_AUTO_BLOCK = {
    enabled: false,
    countryCodes: []
};

// Default menu settings
const DEFAULT_MENU = {
    style: 'v1',
    theme: 'default',
    layout: 'list',
    header: '┏━❑ {botName} MENU ━━━━━━━━━',
    footer: '┗━━━━━━━━━━━━━━━━━━━━\n> {botName}',
    showCategoryHeader: true,
    showAlias: true,
    showDescription: true,
    showReact: true,
    emoji: {
        category: '📁',
        command: '⤷',
        alias: '🔹',
        desc: '📝',
        react: '⚡'
    }
};

// Default emoji settings
const DEFAULT_EMOJI = {
    online: '🟢',
    offline: '⚫',
    typing: '✍️',
    recording: '🎤',
    read: '👁️',
    delivered: '✅',
    sent: '📤',
    pending: '⏳',
    failed: '❌',
    botOnline: '🤖',
    botOffline: '💤',
    botProcessing: '⚙️',
    botSuccess: '✅',
    botError: '❌',
    botWarning: '⚠️',
    messageSent: '📨',
    messageReceived: '📩',
    messageRead: '👀',
    messageDeleted: '🗑️',
    groupOpen: '🔓',
    groupClose: '🔒',
    groupMute: '🔇',
    groupUnmute: '🔊',
    groupPromote: '👑',
    groupDemote: '⬇️',
    groupAdd: '➕',
    groupRemove: '➖',
    groupJoin: '🚪',
    groupLeave: '👋',
    commandSuccess: '✅',
    commandError: '❌',
    commandProcessing: '⏳',
    commandInvalid: '⚠️',
    commandNotFound: '❓',
    image: '📸',
    video: '🎥',
    audio: '🎵',
    document: '📄',
    sticker: '🖼️',
    contact: '📇',
    location: '📍',
    poll: '📊',
    userAdmin: '👑',
    userMember: '👤',
    userOwner: '👑',
    userBot: '🤖',
    userVerified: '✅',
    userBlocked: '🚫',
    custom1: '✨',
    custom2: '🌟',
    custom3: '💫'
};

// ==================== READ/WRITE FUNCTIONS ====================

// Main settings
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

function writeSettings(data) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing settings:', error);
        return false;
    }
}

// Anti-call settings
function readAntiCall() {
    try {
        if (fs.existsSync(ANTICALL_FILE)) {
            const data = fs.readFileSync(ANTICALL_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_ANTICALL;
    } catch (error) {
        return DEFAULT_ANTICALL;
    }
}

function writeAntiCall(data) {
    try {
        fs.writeFileSync(ANTICALL_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Bot name
function readBotName() {
    try {
        if (fs.existsSync(BOTNAME_FILE)) {
            const data = fs.readFileSync(BOTNAME_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { name: DEFAULT_SETTINGS.botName };
    } catch (error) {
        return { name: DEFAULT_SETTINGS.botName };
    }
}

function writeBotName(data) {
    try {
        fs.writeFileSync(BOTNAME_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Ignore list
function readIgnoreList() {
    try {
        if (fs.existsSync(IGNORE_LIST_FILE)) {
            const data = fs.readFileSync(IGNORE_LIST_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_IGNORE_LIST;
    } catch (error) {
        return DEFAULT_IGNORE_LIST;
    }
}

function writeIgnoreList(data) {
    try {
        fs.writeFileSync(IGNORE_LIST_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Auto block
function readAutoBlock() {
    try {
        if (fs.existsSync(AUTO_BLOCK_FILE)) {
            const data = fs.readFileSync(AUTO_BLOCK_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_AUTO_BLOCK;
    } catch (error) {
        return DEFAULT_AUTO_BLOCK;
    }
}

function writeAutoBlock(data) {
    try {
        fs.writeFileSync(AUTO_BLOCK_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Menu settings
function readMenuSettings() {
    try {
        if (fs.existsSync(MENU_SETTINGS_FILE)) {
            const data = fs.readFileSync(MENU_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_MENU;
    } catch (error) {
        return DEFAULT_MENU;
    }
}

function writeMenuSettings(data) {
    try {
        fs.writeFileSync(MENU_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Emoji settings
function readEmojiSettings() {
    try {
        if (fs.existsSync(EMOJI_SETTINGS_FILE)) {
            const data = fs.readFileSync(EMOJI_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_EMOJI;
    } catch (error) {
        return DEFAULT_EMOJI;
    }
}

function writeEmojiSettings(data) {
    try {
        fs.writeFileSync(EMOJI_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Reset functions
function resetAllSettings() {
    writeSettings(DEFAULT_SETTINGS);
    writeAntiCall(DEFAULT_ANTICALL);
    writeBotName({ name: DEFAULT_SETTINGS.botName });
    writeIgnoreList(DEFAULT_IGNORE_LIST);
    writeAutoBlock(DEFAULT_AUTO_BLOCK);
    writeMenuSettings(DEFAULT_MENU);
    writeEmojiSettings(DEFAULT_EMOJI);
    return true;
}

// ==================== GETTER FUNCTIONS ====================

async function getOwnerName() {
    return readSettings().ownerName;
}

async function getOwnerNumber() {
    return readSettings().ownerNumber;
}

async function getBotName() {
    return readBotName().name;
}

async function getWatermark() {
    return readSettings().watermark;
}

async function getStickerAuthor() {
    return readSettings().stickerAuthor;
}

async function getStickerPack() {
    return readSettings().stickerPackName;
}

async function getMenuImage() {
    return readSettings().menuImage;
}

async function getTimezone() {
    return readSettings().timezone;
}

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

async function getStatusEmoji(type) {
    const emojis = readEmojiSettings();
    return emojis[type] || '❓';
}

async function getMenuStyle() {
    return readMenuSettings();
}

async function getAllSettings() {
    return {
        main: readSettings(),
        anticall: readAntiCall(),
        botName: readBotName(),
        ignoreList: readIgnoreList(),
        autoBlock: readAutoBlock(),
        menu: readMenuSettings(),
        emoji: readEmojiSettings()
    };
}

// ==================== FAKE VCARD ====================
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

// ==================== MAIN SETTINGS COMMAND ====================
cmd({
    pattern: "settings4",
    alias: ["allsettings4", "config4", "setting4", "botconfig4"],
    react: "⚙️",
    desc: "View all bot settings",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    
    const all = await getAllSettings();
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    let text = `┏━❑ BOT SETTINGS ━━━━━━━━━
┃ 
┃ 👑 *OWNER*
┃ • Name: ${all.main.ownerName}
┃ • Number: ${all.main.ownerNumber}
┃ 
┃ 🤖 *BOT INFO*
┃ • Name: ${all.botName.name}
┃ • Version: ${all.main.botVersion}
┃ • Mode: ${all.main.mode}
┃ • Prefix: ${all.main.prefix}
┃ • Timezone: ${all.main.timezone}
┃ • Uptime: ${hours}h ${minutes}m
┃ 
┃ 🎨 *MENU*
┃ • Style: ${all.menu.style}
┃ • Theme: ${all.menu.theme}
┃ • Layout: ${all.menu.layout}
┃ 
┃ 🖼️ *STICKER*
┃ • Author: ${all.main.stickerAuthor}
┃ • Pack: ${all.main.stickerPackName}
┃ 
┃ 💧 *WATERMARK*
┃ • ${all.main.watermark}
┃ 
┃ 📞 *ANTI-CALL*
┃ • Status: ${all.anticall.enabled ? '✅' : '❌'}
┃ • Action: ${all.anticall.action}
┃ 
┃ 🛡️ *FEATURES*
┃ • Anti Link: ${all.main.antiLink ? '✅' : '❌'}
┃ • Anti Bad Word: ${all.main.antiBadWord ? '✅' : '❌'}
┃ • Anti Foreign: ${all.main.antiForeign ? '✅' : '❌'}
┃ • Anti Bot: ${all.main.antiBot ? '✅' : '❌'}
┃ • Anti Spam: ${all.main.antiSpam ? '✅' : '❌'}
┃ • Auto Block: ${all.autoBlock.enabled ? '✅' : '❌'}
┃ 
┃ 🚫 *IGNORE LIST*
┃ • Users: ${all.ignoreList.users.length}
┃ • Groups: ${all.ignoreList.groups.length}
┃ 
┃ 🌍 *COUNTRY CODES*
┃ • ${all.autoBlock.countryCodes.join(', ') || 'None'}
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(from, { text }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// ==================== OWNER SETTINGS ====================
cmd({
    pattern: "setownername4",
    alias: ["ownername"],
    react: "👑",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setownername Sila Tech` }, { quoted: fkontak });
    
    let settings = readSettings();
    settings.ownerName = args.join(' ');
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Owner name set to: ${args.join(' ')}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "setownernumber4",
    alias: ["ownernumber"],
    react: "📞",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setownernumber 255789661031` }, { quoted: fkontak });
    
    let number = args[0].replace(/[^0-9]/g, '');
    if (number.length < 10) return await conn.sendMessage(from, { text: `❌ Invalid number` }, { quoted: fkontak });
    
    let settings = readSettings();
    settings.ownerNumber = number;
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Owner number set to: ${number}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== BOT NAME SETTINGS ====================
cmd({
    pattern: "setbotname4",
    alias: ["botname"],
    react: "📛",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        const current = await getBotName();
        return await conn.sendMessage(from, { text: `📛 Current bot name: ${current}\n\nUse: .setbotname New Name` }, { quoted: fkontak });
    }
    
    let botData = readBotName();
    botData.name = args.join(' ');
    writeBotName(botData);
    
    await conn.sendMessage(from, { text: `✅ Bot name set to: ${args.join(' ')}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== WATERMARK SETTINGS ====================
cmd({
    pattern: "setwatermark4",
    alias: ["watermark"],
    react: "💧",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setwatermark © Your Watermark` }, { quoted: fkontak });
    
    let settings = readSettings();
    settings.watermark = args.join(' ');
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Watermark set to: ${args.join(' ')}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== STICKER SETTINGS ====================
cmd({
    pattern: "setstickerauthor4",
    alias: ["stickerauthor"],
    react: "✍️",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setstickerauthor Sila MD` }, { quoted: fkontak });
    
    let settings = readSettings();
    settings.stickerAuthor = args.join(' ');
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Sticker author set to: ${args.join(' ')}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "setstickerpackname4",
    alias: ["stickerpack"],
    react: "📦",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setstickerpackname Sila Pack` }, { quoted: fkontak });
    
    let settings = readSettings();
    settings.stickerPackName = args.join(' ');
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Sticker pack set to: ${args.join(' ')}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== MENU SETTINGS ====================
cmd({
    pattern: "setmenuimage4",
    alias: ["menupic"],
    react: "🖼️",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args, quoted}) => {
try{
    if (!isOwner) return;
    
    let settings = readSettings();
    
    if (m.quoted && m.quoted.message?.imageMessage) {
        await conn.sendMessage(from, { text: `⏳ Downloading image...` }, { quoted: fkontak });
        const media = await conn.downloadAndSaveMediaMessage(m.quoted);
        const localPath = path.join(SETTINGS_DIR, 'menu_image.jpg');
        fs.copyFileSync(media, localPath);
        settings.menuImage = 'local';
        writeSettings(settings);
        fs.unlinkSync(media);
        await conn.sendMessage(from, { text: `✅ Menu image set from local image` }, { quoted: fkontak });
    } else if (args[0]) {
        settings.menuImage = args[0];
        writeSettings(settings);
        await conn.sendMessage(from, { text: `✅ Menu image URL set` }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, { text: `Current: ${settings.menuImage}\n\nUse: .setmenuimage [url] or reply to image` }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

cmd({
    pattern: "setmenustyle4",
    alias: ["menustyle"],
    react: "🎨",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `Use: .setmenustyle v1/v2/v3/v4/v5` }, { quoted: fkontak });
    
    let menu = readMenuSettings();
    menu.style = args[0];
    writeMenuSettings(menu);
    
    await conn.sendMessage(from, { text: `✅ Menu style set to: ${args[0]}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "setmenutheme4",
    alias: ["menutheme"],
    react: "🎭",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `Use: .setmenutheme default/dark/light/neon` }, { quoted: fkontak });
    
    let menu = readMenuSettings();
    menu.theme = args[0];
    writeMenuSettings(menu);
    
    await conn.sendMessage(from, { text: `✅ Menu theme set to: ${args[0]}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== TIMEZONE SETTINGS ====================
cmd({
    pattern: "settimezone4",
    alias: ["timezone"],
    react: "🌍",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, { 
            text: `Current timezone: ${readSettings().timezone}\n\nCommon timezones:\n• Africa/Dar_es_Salaam\n• Africa/Nairobi\n• Africa/Johannesburg\n• Africa/Lagos\n• America/New_York\n• Europe/London\n• Asia/Dubai\n• Asia/Kolkata\n\nUse: .settimezone Africa/Dar_es_Salaam` 
        }, { quoted: fkontak });
    }
    
    try {
        moment().tz(args[0]).format();
    } catch (e) {
        return await conn.sendMessage(from, { text: `❌ Invalid timezone` }, { quoted: fkontak });
    }
    
    let settings = readSettings();
    settings.timezone = args[0];
    writeSettings(settings);
    
    await conn.sendMessage(from, { text: `✅ Timezone set to: ${args[0]}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== ANTI-CALL SETTINGS ====================
cmd({
    pattern: "anticall4",
    alias: ["setanticall"],
    react: "📵",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    let anticall = readAntiCall();
    
    if (!args[0]) {
        anticall.enabled = !anticall.enabled;
        await conn.sendMessage(from, { text: `✅ Anti-call: ${anticall.enabled ? 'ON' : 'OFF'}` }, { quoted: fkontak });
    } else if (args[0] === 'on') {
        anticall.enabled = true;
        await conn.sendMessage(from, { text: `✅ Anti-call ON` }, { quoted: fkontak });
    } else if (args[0] === 'off') {
        anticall.enabled = false;
        await conn.sendMessage(from, { text: `✅ Anti-call OFF` }, { quoted: fkontak });
    } else if (args[0] === 'action') {
        if (args[1] === 'reject' || args[1] === 'block' || args[1] === 'ignore') {
            anticall.action = args[1];
            await conn.sendMessage(from, { text: `✅ Action set to: ${args[1]}` }, { quoted: fkontak });
        }
    }
    
    writeAntiCall(anticall);

} catch (e) { console.log(e); }
});

cmd({
    pattern: "setanticallmsg4",
    alias: ["anticallmsg"],
    react: "📝",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return await conn.sendMessage(from, { text: `❌ Use: .setanticallmsg Your message here` }, { quoted: fkontak });
    
    let anticall = readAntiCall();
    anticall.message = args.join(' ');
    writeAntiCall(anticall);
    
    await conn.sendMessage(from, { text: `✅ Anti-call message updated` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "showanticallmsg4",
    alias: ["viewanticall"],
    react: "📋",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    const anticall = readAntiCall();
    await conn.sendMessage(from, { text: `📵 *ANTI-CALL MESSAGE*\n\n${anticall.message}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "testanticallmsg4",
    alias: ["testanticall"],
    react: "🧪",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    const anticall = readAntiCall();
    await conn.sendMessage(from, { text: `🧪 *TEST MESSAGE*\n\n${anticall.message}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "delanticallmsg4",
    alias: ["resetanticall"],
    react: "🗑️",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    writeAntiCall(DEFAULT_ANTICALL);
    await conn.sendMessage(from, { text: `✅ Anti-call reset to default` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== IGNORE LIST SETTINGS ====================
cmd({
    pattern: "addignorelist4",
    alias: ["ignore"],
    react: "🚫",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, quoted, mentionedJid, args}) => {
try{
    if (!isOwner) return;
    
    let target = quoted?.sender || mentionedJid?.[0] || (args[0] ? args[0] + '@s.whatsapp.net' : null);
    if (!target) return await conn.sendMessage(from, { text: `❌ Tag user or reply` }, { quoted: fkontak });
    
    let ignore = readIgnoreList();
    if (!ignore.users.includes(target)) {
        ignore.users.push(target);
        writeIgnoreList(ignore);
        await conn.sendMessage(from, { text: `✅ Added to ignore list` }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, { text: `❌ Already in ignore list` }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

cmd({
    pattern: "delignorelist4",
    alias: ["unignore"],
    react: "✅",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, quoted, mentionedJid, args}) => {
try{
    if (!isOwner) return;
    
    let target = quoted?.sender || mentionedJid?.[0] || (args[0] ? args[0] + '@s.whatsapp.net' : null);
    if (!target) return;
    
    let ignore = readIgnoreList();
    ignore.users = ignore.users.filter(u => u !== target);
    writeIgnoreList(ignore);
    await conn.sendMessage(from, { text: `✅ Removed from ignore list` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "listignore4",
    alias: ["ignorelist"],
    react: "📋",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    const ignore = readIgnoreList();
    let text = `┏━❑ IGNORE LIST ━━━━━━━━━\n┃\n`;
    ignore.users.forEach((u, i) => text += `┃ ${i+1}. @${u.split('@')[0]}\n`);
    text += `┃\n┃ Total: ${ignore.users.length}\n┗━━━━━━━━━━━━━━━━━━━━`;
    await conn.sendMessage(from, { text, mentions: ignore.users }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== COUNTRY CODE SETTINGS ====================
cmd({
    pattern: "addcountrycode4",
    alias: ["addcc"],
    react: "🌍",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return;
    
    let auto = readAutoBlock();
    let code = args[0].replace(/[^0-9]/g, '');
    if (!auto.countryCodes.includes(code)) {
        auto.countryCodes.push(code);
        writeAutoBlock(auto);
        await conn.sendMessage(from, { text: `✅ Added country code: +${code}` }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

cmd({
    pattern: "delcountrycode4",
    alias: ["delcc"],
    react: "🗑️",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    if (!args[0]) return;
    
    let auto = readAutoBlock();
    let code = args[0].replace(/[^0-9]/g, '');
    auto.countryCodes = auto.countryCodes.filter(c => c !== code);
    writeAutoBlock(auto);
    await conn.sendMessage(from, { text: `✅ Removed country code: +${code}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "listcountrycode4",
    alias: ["listcc"],
    react: "📋",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    const auto = readAutoBlock();
    let text = `┏━❑ COUNTRY CODES ━━━━━━━━━\n┃\n`;
    auto.countryCodes.forEach((c, i) => text += `┃ ${i+1}. +${c}\n`);
    text += `┃\n┃ Total: ${auto.countryCodes.length}\n┗━━━━━━━━━━━━━━━━━━━━`;
    await conn.sendMessage(from, { text }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== AUTO BLOCK SETTINGS ====================
cmd({
    pattern: "autoblock4",
    alias: ["toggleautoblock"],
    react: "🔒",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    let auto = readAutoBlock();
    
    if (!args[0]) {
        auto.enabled = !auto.enabled;
    } else if (args[0] === 'on') {
        auto.enabled = true;
    } else if (args[0] === 'off') {
        auto.enabled = false;
    }
    
    writeAutoBlock(auto);
    await conn.sendMessage(from, { text: `✅ Auto block: ${auto.enabled ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== FEATURE TOGGLES ====================
cmd({
    pattern: "antilink4",
    alias: ["toggleantilink"],
    react: "🔗",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    let settings = readSettings();
    if (args[0] === 'on') settings.antiLink = true;
    else if (args[0] === 'off') settings.antiLink = false;
    else settings.antiLink = !settings.antiLink;
    writeSettings(settings);
    await conn.sendMessage(from, { text: `✅ Anti-link: ${settings.antiLink ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "antibadword4",
    alias: ["antitoxic"],
    react: "🔞",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    let settings = readSettings();
    if (args[0] === 'on') settings.antiBadWord = true;
    else if (args[0] === 'off') settings.antiBadWord = false;
    else settings.antiBadWord = !settings.antiBadWord;
    writeSettings(settings);
    await conn.sendMessage(from, { text: `✅ Anti-bad word: ${settings.antiBadWord ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "antiforeign4",
    alias: ["antiforeigners"],
    react: "🚫",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    let settings = readSettings();
    if (args[0] === 'on') settings.antiForeign = true;
    else if (args[0] === 'off') settings.antiForeign = false;
    else settings.antiForeign = !settings.antiForeign;
    writeSettings(settings);
    await conn.sendMessage(from, { text: `✅ Anti-foreign: ${settings.antiForeign ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "antibots4",
    alias: ["antibot"],
    react: "🤖",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    let settings = readSettings();
    if (args[0] === 'on') settings.antiBot = true;
    else if (args[0] === 'off') settings.antiBot = false;
    else settings.antiBot = !settings.antiBot;
    writeSettings(settings);
    await conn.sendMessage(from, { text: `✅ Anti-bots: ${settings.antiBot ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

cmd({
    pattern: "antispam4",
    alias: ["toggleantispam"],
    react: "⛔",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    let settings = readSettings();
    if (args[0] === 'on') settings.antiSpam = true;
    else if (args[0] === 'off') settings.antiSpam = false;
    else settings.antiSpam = !settings.antiSpam;
    writeSettings(settings);
    await conn.sendMessage(from, { text: `✅ Anti-spam: ${settings.antiSpam ? 'ON' : 'OFF'}` }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== RESET COMMAND ====================
cmd({
    pattern: "resetsetting4",
    alias: ["resetall"],
    react: "🔄",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, { 
            text: `*RESET OPTIONS*\n\n• .resetsetting all - Reset everything\n• .resetsetting owner - Reset owner\n• .resetsetting anticall - Reset anti-call\n• .resetsetting menu - Reset menu\n• .resetsetting sticker - Reset sticker` 
        }, { quoted: fkontak });
    }
    
    switch(args[0].toLowerCase()) {
        case 'all':
            resetAllSettings();
            await conn.sendMessage(from, { text: `✅ All settings reset to default` }, { quoted: fkontak });
            break;
        case 'anticall':
            writeAntiCall(DEFAULT_ANTICALL);
            await conn.sendMessage(from, { text: `✅ Anti-call reset` }, { quoted: fkontak });
            break;
        case 'menu':
            writeMenuSettings(DEFAULT_MENU);
            await conn.sendMessage(from, { text: `✅ Menu settings reset` }, { quoted: fkontak });
            break;
        default:
            await conn.sendMessage(from, { text: `❌ Unknown option` }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ==================== GET SETTINGS COMMAND ====================
cmd({
    pattern: "getsettings4",
    alias: ["viewsettings"],
    react: "📋",
    category: "settings"
},
async(conn, mek, m, {from, sender, isOwner}) => {
try{
    if (!isOwner) return;
    const all = await getAllSettings();
    await conn.sendMessage(from, { 
        text: JSON.stringify(all, null, 2),
        contextInfo: getContextInfo({ sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ==================== EXPORT ALL FUNCTIONS ====================
module.exports = {
    // Read/Write functions
    readSettings,
    writeSettings,
    readAntiCall,
    writeAntiCall,
    readIgnoreList,
    writeIgnoreList,
    readAutoBlock,
    writeAutoBlock,
    readMenuSettings,
    writeMenuSettings,
    readEmojiSettings,
    writeEmojiSettings,
    readBotName,
    writeBotName,
    
    // Getter functions
    getOwnerName,
    getOwnerNumber,
    getBotName,
    getWatermark,
    getStickerAuthor,
    getStickerPack,
    getMenuImage,
    getTimezone,
    getFormattedTime,
    getStatusEmoji,
    getMenuStyle,
    getAllSettings,
    
    // Reset function
    resetAllSettings,
    
    // Anti-call handler
    handleAntiCall: async (conn, call) => {
        const anticall = readAntiCall();
        if (!anticall.enabled) return;
        
        const caller = call[0]?.from;
        if (!caller) return;
        
        try {
            await conn.sendMessage(caller, { text: anticall.message });
            if (anticall.action === 'reject') {
                await conn.rejectCall(call[0].id, caller);
            } else if (anticall.action === 'block') {
                await conn.updateBlockStatus(caller, 'block');
            }
        } catch (e) {
            console.log('Anti-call error:', e);
        }
    },
    
    // Fake vCard and context
    fkontak,
    getContextInfo
};
