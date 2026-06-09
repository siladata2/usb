const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path za settings
const SETTINGS_DIR = path.join(__dirname, '../data');
const EMOJI_SETTINGS_FILE = path.join(SETTINGS_DIR, 'statusemoji.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Default emoji settings
const DEFAULT_EMOJI = {
    // Status categories
    online: '🟢',
    offline: '⚫',
    typing: '✍️',
    recording: '🎤',
    read: '👁️',
    delivered: '✅',
    sent: '📤',
    pending: '⏳',
    failed: '❌',
    
    // Bot status
    botOnline: '🤖',
    botOffline: '💤',
    botProcessing: '⚙️',
    botSuccess: '✅',
    botError: '❌',
    botWarning: '⚠️',
    
    // Message status
    messageSent: '📨',
    messageReceived: '📩',
    messageRead: '👀',
    messageDeleted: '🗑️',
    
    // Group status
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
    
    // Command status
    commandSuccess: '✅',
    commandError: '❌',
    commandProcessing: '⏳',
    commandInvalid: '⚠️',
    commandNotFound: '❓',
    
    // Media status
    image: '📸',
    video: '🎥',
    audio: '🎵',
    document: '📄',
    sticker: '🖼️',
    contact: '📇',
    location: '📍',
    poll: '📊',
    
    // User status
    userAdmin: '👑',
    userMember: '👤',
    userOwner: '👑',
    userBot: '🤖',
    userVerified: '✅',
    userBlocked: '🚫',
    
    // Time status
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌆',
    night: '🌙',
    midnight: '🌃',
    
    // Weather status
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '☔',
    stormy: '⛈️',
    snowy: '❄️',
    
    // Mood status
    happy: '😊',
    sad: '😢',
    angry: '😠',
    love: '❤️',
    cool: '😎',
    sleepy: '😴',
    
    // Custom status
    custom1: '✨',
    custom2: '🌟',
    custom3: '💫',
    custom4: '⭐',
    custom5: '⚡'
};

// Function ya kusoma emoji settings
function readEmojiSettings() {
    try {
        if (fs.existsSync(EMOJI_SETTINGS_FILE)) {
            const data = fs.readFileSync(EMOJI_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_EMOJI;
    } catch (error) {
        console.log('Error reading emoji settings:', error);
        return DEFAULT_EMOJI;
    }
}

// Function ya kuandika emoji settings
function writeEmojiSettings(data) {
    try {
        fs.writeFileSync(EMOJI_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing emoji settings:', error);
        return false;
    }
}

// Function ya kureset emoji settings
function resetEmojiSettings() {
    return writeEmojiSettings(DEFAULT_EMOJI);
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

// ============ SETSTATUSEMOJI COMMAND ============
cmd({
    pattern: "setstatusemoji",
    alias: ["setemoji", "statusemoji", "emojisettings", "emoji"],
    react: "😊",
    desc: "Configure status emojis for bot",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let emojiSettings = readEmojiSettings();
    
    // No arguments - show current settings
    if (!args[0]) {
        let settingsText = `┏━❑ STATUS EMOJI SETTINGS ━━━━━━━━━
┃ 
┃ *🟢 ONLINE STATUS:*
┃ Online: ${emojiSettings.online} | Offline: ${emojiSettings.offline}
┃ Typing: ${emojiSettings.typing} | Recording: ${emojiSettings.recording}
┃ 
┃ *📨 MESSAGE STATUS:*
┃ Sent: ${emojiSettings.sent} | Delivered: ${emojiSettings.delivered}
┃ Read: ${emojiSettings.read} | Failed: ${emojiSettings.failed}
┃ 
┃ *🤖 BOT STATUS:*
┃ Online: ${emojiSettings.botOnline} | Offline: ${emojiSettings.botOffline}
┃ Processing: ${emojiSettings.botProcessing}
┃ Success: ${emojiSettings.botSuccess} | Error: ${emojiSettings.botError}
┃ 
┃ *👥 GROUP STATUS:*
┃ Open: ${emojiSettings.groupOpen} | Close: ${emojiSettings.groupClose}
┃ Mute: ${emojiSettings.groupMute} | Unmute: ${emojiSettings.groupUnmute}
┃ Promote: ${emojiSettings.groupPromote} | Demote: ${emojiSettings.groupDemote}
┃ 
┃ *📁 MEDIA STATUS:*
┃ Image: ${emojiSettings.image} | Video: ${emojiSettings.video}
┃ Audio: ${emojiSettings.audio} | Document: ${emojiSettings.document}
┃ Sticker: ${emojiSettings.sticker} | Location: ${emojiSettings.location}
┃ 
┃ *👤 USER STATUS:*
┃ Admin: ${emojiSettings.userAdmin} | Member: ${emojiSettings.userMember}
┃ Owner: ${emojiSettings.userOwner} | Bot: ${emojiSettings.userBot}
┃ 
┃ *✨ CUSTOM EMOJIS:*
┃ Custom1: ${emojiSettings.custom1} | Custom2: ${emojiSettings.custom2}
┃ Custom3: ${emojiSettings.custom3} | Custom4: ${emojiSettings.custom4}
┃ 
┃ *📝 AVAILABLE COMMANDS:*
┃ 
┃ *View Categories:*
┃ • .setstatusemoji list online
┃ • .setstatusemoji list message
┃ • .setstatusemoji list bot
┃ • .setstatusemoji list group
┃ • .setstatusemoji list media
┃ • .setstatusemoji list user
┃ • .setstatusemoji list custom
┃ 
┃ *Set Emoji:*
┃ • .setstatusemoji set [type] [emoji]
┃   Example: .setstatusemoji set online 🔵
┃ 
┃ *Reset:*
┃ • .setstatusemoji reset
┃ • .setstatusemoji reset [category]
┃ 
┃ *Search:*
┃ • .setstatusemoji search [keyword]
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;

        await conn.sendMessage(from, {
            text: settingsText,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        return;
    }
    
    // Handle different commands
    switch (args[0].toLowerCase()) {
        
        // ===== LIST COMMANDS =====
        case 'list':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please specify category: online, message, bot, group, media, user, custom`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            let listText = `┏━❑ ${args[1].toUpperCase()} EMOJIS ━━━━━━━━━\n┃\n`;
            
            switch (args[1].toLowerCase()) {
                case 'online':
                    listText += `┃ Online: ${emojiSettings.online}\n`;
                    listText += `┃ Offline: ${emojiSettings.offline}\n`;
                    listText += `┃ Typing: ${emojiSettings.typing}\n`;
                    listText += `┃ Recording: ${emojiSettings.recording}\n`;
                    break;
                    
                case 'message':
                    listText += `┃ Sent: ${emojiSettings.sent}\n`;
                    listText += `┃ Delivered: ${emojiSettings.delivered}\n`;
                    listText += `┃ Read: ${emojiSettings.read}\n`;
                    listText += `┃ Pending: ${emojiSettings.pending}\n`;
                    listText += `┃ Failed: ${emojiSettings.failed}\n`;
                    break;
                    
                case 'bot':
                    listText += `┃ Online: ${emojiSettings.botOnline}\n`;
                    listText += `┃ Offline: ${emojiSettings.botOffline}\n`;
                    listText += `┃ Processing: ${emojiSettings.botProcessing}\n`;
                    listText += `┃ Success: ${emojiSettings.botSuccess}\n`;
                    listText += `┃ Error: ${emojiSettings.botError}\n`;
                    listText += `┃ Warning: ${emojiSettings.botWarning}\n`;
                    break;
                    
                case 'group':
                    listText += `┃ Open: ${emojiSettings.groupOpen}\n`;
                    listText += `┃ Close: ${emojiSettings.groupClose}\n`;
                    listText += `┃ Mute: ${emojiSettings.groupMute}\n`;
                    listText += `┃ Unmute: ${emojiSettings.groupUnmute}\n`;
                    listText += `┃ Promote: ${emojiSettings.groupPromote}\n`;
                    listText += `┃ Demote: ${emojiSettings.groupDemote}\n`;
                    listText += `┃ Add: ${emojiSettings.groupAdd}\n`;
                    listText += `┃ Remove: ${emojiSettings.groupRemove}\n`;
                    listText += `┃ Join: ${emojiSettings.groupJoin}\n`;
                    listText += `┃ Leave: ${emojiSettings.groupLeave}\n`;
                    break;
                    
                case 'media':
                    listText += `┃ Image: ${emojiSettings.image}\n`;
                    listText += `┃ Video: ${emojiSettings.video}\n`;
                    listText += `┃ Audio: ${emojiSettings.audio}\n`;
                    listText += `┃ Document: ${emojiSettings.document}\n`;
                    listText += `┃ Sticker: ${emojiSettings.sticker}\n`;
                    listText += `┃ Contact: ${emojiSettings.contact}\n`;
                    listText += `┃ Location: ${emojiSettings.location}\n`;
                    listText += `┃ Poll: ${emojiSettings.poll}\n`;
                    break;
                    
                case 'user':
                    listText += `┃ Admin: ${emojiSettings.userAdmin}\n`;
                    listText += `┃ Member: ${emojiSettings.userMember}\n`;
                    listText += `┃ Owner: ${emojiSettings.userOwner}\n`;
                    listText += `┃ Bot: ${emojiSettings.userBot}\n`;
                    listText += `┃ Verified: ${emojiSettings.userVerified}\n`;
                    listText += `┃ Blocked: ${emojiSettings.userBlocked}\n`;
                    break;
                    
                case 'custom':
                    listText += `┃ Custom1: ${emojiSettings.custom1}\n`;
                    listText += `┃ Custom2: ${emojiSettings.custom2}\n`;
                    listText += `┃ Custom3: ${emojiSettings.custom3}\n`;
                    listText += `┃ Custom4: ${emojiSettings.custom4}\n`;
                    listText += `┃ Custom5: ${emojiSettings.custom5}\n`;
                    break;
                    
                default:
                    return await conn.sendMessage(from, {
                        text: `❌ Invalid category`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: fkontak });
            }
            
            listText += `┃\n┗━━━━━━━━━━━━━━━━━━━━`;
            
            await conn.sendMessage(from, {
                text: listText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== SET EMOJI COMMAND =====
        case 'set':
            if (!args[1] || !args[2]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setstatusemoji set [type] [emoji]\n\nExample: .setstatusemoji set online 🟢`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const type = args[1].toLowerCase();
            const emoji = args[2];
            
            // Check if emoji exists in settings
            if (emojiSettings.hasOwnProperty(type)) {
                const oldEmoji = emojiSettings[type];
                emojiSettings[type] = emoji;
                writeEmojiSettings(emojiSettings);
                
                await conn.sendMessage(from, {
                    text: `┏━❑ EMOJI UPDATED ━━━━━━━━━
┃ ✅ *${type}* emoji changed
┃ ┣ Old: ${oldEmoji}
┃ ┗ New: ${emoji}
┗━━━━━━━━━━━━━━━━━━━━`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                // Show available types
                let types = Object.keys(emojiSettings).join(', ');
                await conn.sendMessage(from, {
                    text: `❌ Invalid type: ${type}\n\nAvailable types:\n${types}`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            break;
            
        // ===== RESET COMMANDS =====
        case 'reset':
            if (!args[1]) {
                resetEmojiSettings();
                await conn.sendMessage(from, {
                    text: `✅ All emoji settings reset to default`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                // Reset specific category
                const category = args[1].toLowerCase();
                const categoryEmojis = {
                    online: ['online', 'offline', 'typing', 'recording'],
                    message: ['sent', 'delivered', 'read', 'pending', 'failed'],
                    bot: ['botOnline', 'botOffline', 'botProcessing', 'botSuccess', 'botError', 'botWarning'],
                    group: ['groupOpen', 'groupClose', 'groupMute', 'groupUnmute', 'groupPromote', 'groupDemote', 'groupAdd', 'groupRemove', 'groupJoin', 'groupLeave'],
                    media: ['image', 'video', 'audio', 'document', 'sticker', 'contact', 'location', 'poll'],
                    user: ['userAdmin', 'userMember', 'userOwner', 'userBot', 'userVerified', 'userBlocked'],
                    custom: ['custom1', 'custom2', 'custom3', 'custom4', 'custom5']
                };
                
                if (categoryEmojis[category]) {
                    categoryEmojis[category].forEach(key => {
                        emojiSettings[key] = DEFAULT_EMOJI[key];
                    });
                    writeEmojiSettings(emojiSettings);
                    
                    await conn.sendMessage(from, {
                        text: `✅ ${category} emojis reset to default`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: fkontak });
                } else {
                    await conn.sendMessage(from, {
                        text: `❌ Invalid category. Use: online, message, bot, group, media, user, custom`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: fkontak });
                }
            }
            break;
            
        // ===== SEARCH COMMAND =====
        case 'search':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setstatusemoji search [keyword]`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const keyword = args[1].toLowerCase();
            let results = [];
            
            for (let [key, value] of Object.entries(emojiSettings)) {
                if (key.toLowerCase().includes(keyword) || value.includes(keyword)) {
                    results.push({ key, value });
                }
            }
            
            if (results.length > 0) {
                let searchText = `┏━❑ SEARCH RESULTS FOR "${keyword}" ━━━━━━━━━\n┃\n`;
                results.forEach((r, i) => {
                    searchText += `┃ ${i+1}. ${r.key}: ${r.value}\n`;
                });
                searchText += `┃\n┃ Total: ${results.length}\n┗━━━━━━━━━━━━━━━━━━━━`;
                
                await conn.sendMessage(from, {
                    text: searchText,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                await conn.sendMessage(from, {
                    text: `❌ No results found for "${keyword}"`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            break;
            
        // ===== EXPORT COMMAND =====
        case 'export':
            const exportData = JSON.stringify(emojiSettings, null, 2);
            await conn.sendMessage(from, {
                text: `┏━❑ EXPORT EMOJI SETTINGS ━━━━━━━━━\n┃\n┃ \`\`\`${exportData}\`\`\`\n┃\n┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== IMPORT COMMAND =====
        case 'import':
            try {
                const imported = JSON.parse(args.slice(1).join(' '));
                if (typeof imported === 'object') {
                    emojiSettings = { ...emojiSettings, ...imported };
                    writeEmojiSettings(emojiSettings);
                    await conn.sendMessage(from, {
                        text: `✅ Emoji settings imported successfully`,
                        contextInfo: getContextInfo({ sender: sender })
                    }, { quoted: fkontak });
                }
            } catch (e) {
                await conn.sendMessage(from, {
                    text: `❌ Invalid JSON format`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            break;
            
        // ===== PREVIEW COMMAND =====
        case 'preview':
            let previewText = `┏━❑ EMOJI PREVIEW ━━━━━━━━━\n┃\n`;
            previewText += `┃ ${emojiSettings.botOnline} Bot Online\n`;
            previewText += `┃ ${emojiSettings.botProcessing} Processing\n`;
            previewText += `┃ ${emojiSettings.botSuccess} Success\n`;
            previewText += `┃ ${emojiSettings.botError} Error\n`;
            previewText += `┃ ${emojiSettings.messageSent} Message Sent\n`;
            previewText += `┃ ${emojiSettings.messageRead} Message Read\n`;
            previewText += `┃ ${emojiSettings.groupOpen} Group Open\n`;
            previewText += `┃ ${emojiSettings.groupClose} Group Close\n`;
            previewText += `┃ ${emojiSettings.image} Image\n`;
            previewText += `┃ ${emojiSettings.video} Video\n`;
            previewText += `┃ ${emojiSettings.userAdmin} Admin\n`;
            previewText += `┃ ${emojiSettings.userMember} Member\n`;
            previewText += `┃ ${emojiSettings.custom1} Custom 1\n`;
            previewText += `┃\n┗━━━━━━━━━━━━━━━━━━━━`;
            
            await conn.sendMessage(from, {
                text: previewText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        default:
            await conn.sendMessage(from, {
                text: `❌ Unknown command. Use .setstatusemoji for help`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
    }

} catch (e) {
    console.log('SETSTATUSEMOJI ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ FUNCTION YA KUPATA EMOJI ============
async function getStatusEmoji(type) {
    try {
        const settings = readEmojiSettings();
        return settings[type] || '❓';
    } catch (e) {
        return '❓';
    }
}

// ============ FUNCTION YA KUPATA ALL EMOJIS ============
async function getAllEmojis() {
    return readEmojiSettings();
}

// Export functions
module.exports = {
    getStatusEmoji,
    getAllEmojis,
    readEmojiSettings
};
