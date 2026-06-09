const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path za settings
const SETTINGS_DIR = path.join(__dirname, '../Database');
const BOT_NAME_FILE = path.join(SETTINGS_DIR, 'botname.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Default bot name
const DEFAULT_BOT_NAME = '𝐒𝐈𝐋𝐀 𝐌𝐃';

// Function ya kusoma bot name
function readBotName() {
    try {
        if (fs.existsSync(BOT_NAME_FILE)) {
            const data = fs.readFileSync(BOT_NAME_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { name: DEFAULT_BOT_NAME };
    } catch (error) {
        console.log('Error reading bot name:', error);
        return { name: DEFAULT_BOT_NAME };
    }
}

// Function ya kuandika bot name
function writeBotName(data) {
    try {
        fs.writeFileSync(BOT_NAME_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing bot name:', error);
        return false;
    }
}

// Function ya kureset bot name
function resetBotName() {
    return writeBotName({ name: DEFAULT_BOT_NAME });
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

// ============ SETBOTNAME COMMAND ============
cmd({
    pattern: "setbotname",
    alias: ["botname", "setname", "changename", "renamebot"],
    react: "📛",
    desc: "Change bot name/username",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let botNameData = readBotName();
    let currentName = botNameData.name;
    
    // No arguments - show current name
    if (!args[0]) {
        await conn.sendMessage(from, {
            text: `┏━❑ BOT NAME SETTINGS ━━━━━━━━━
┃ 
┃ 📛 *Current Bot Name:*
┃ ${currentName}
┃ 
┃ *Commands:*
┃ 
┃ *Set New Name:*
┃ • .setbotname New Name Here
┃ • .setbotname 𝐒𝐈𝐋𝐀 𝐌𝐃
┃ 
┃ *Styling Options:*
┃ • Bold: *text*
┃ • Italic: _text_
┃ • Monospace: \`\`\`text\`\`\`
┃ • Strikethrough: ~text~
┃ 
┃ *Special Characters:*
┃ • 𝐒𝐈𝐋𝐀 𝐌𝐃 (Bold)
┃ • 𝘚𝘐𝘓𝘈 𝘔𝘋 (Italic)
┃ • 𝕊𝕀𝕃𝔸 𝕄𝔻 (Double struck)
┃ • S̶I̶L̶A̶ ̶M̶D̶ (Strikethrough)
┃ • S⃠I⃠L⃠A⃠ ⃠M⃠D⃠ (Crossed)
┃ 
┃ *Other:*
┃ • .setbotname reset - Reset to default
┃ • .setbotname preview - See different styles
┃ • .setbotname add [text] - Add to current name
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        return;
    }
    
    // Handle special commands
    switch (args[0].toLowerCase()) {
        
        // ===== RESET TO DEFAULT =====
        case 'reset':
            resetBotName();
            await conn.sendMessage(from, {
                text: `✅ Bot name reset to default: *${DEFAULT_BOT_NAME}*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== PREVIEW STYLES =====
        case 'preview':
            let previewText = `┏━❑ BOT NAME STYLES ━━━━━━━━━
┃ 
┃ *Normal:* Sila MD
┃ 
┃ *Bold:* 𝐒𝐢𝐥𝐚 𝐌𝐃
┃ 
┃ *Italic:* 𝘚𝘪𝘭𝘢 𝘔𝘋
┃ 
┃ *Bold Italic:* 𝑺𝒊𝒍𝒂 𝑴𝑫
┃ 
┃ *Monospace:* \`Sila MD\`
┃ 
┃ *Double Struck:* 𝕊𝕚𝕝𝕒 𝕄𝔻
┃ 
┃ *Script:* 𝒮𝒾𝓁𝒶 ℳ𝒟
┃ 
┃ *Fraktur:* 𝔖𝔦𝔩𝔞 𝔐𝔇
┃ 
┃ *Strikethrough:* S̶i̶l̶a̶ ̶M̶D̶
┃ 
┃ *Underline:* S̲i̲l̲a̲ ̲M̲D̲
┃ 
┃ *Circled:* Ⓢⓘⓛⓐ ⓂⒹ
┃ 
┃ *Squared:* 🆂🅸🅻🅰 🅼🅳
┃ 
┃ *Colored:* 🇸​🇮​🇱​🇦​ ​🇲​🇩
┃ 
┃ *Use:* .setbotname [styled name]
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;
            
            await conn.sendMessage(from, {
                text: previewText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== ADD TO CURRENT NAME =====
        case 'add':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please provide text to add\n\nExample: .setbotname add V2`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const addText = args.slice(1).join(' ');
            const newName = `${currentName} ${addText}`;
            botNameData.name = newName;
            writeBotName(botNameData);
            
            await conn.sendMessage(from, {
                text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Name changed
┃ ┣ Old: ${currentName}
┃ ┗ New: ${newName}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== REMOVE LAST WORD =====
        case 'remove':
        case 'pop':
            const words = currentName.split(' ');
            if (words.length > 1) {
                words.pop();
                const newName = words.join(' ');
                botNameData.name = newName;
                writeBotName(botNameData);
                
                await conn.sendMessage(from, {
                    text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Last word removed
┃ ┣ Old: ${currentName}
┃ ┗ New: ${newName}
┗━━━━━━━━━━━━━━━━━━━━`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                await conn.sendMessage(from, {
                    text: `❌ Cannot remove last word`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            break;
            
        // ===== UPPERCASE =====
        case 'upper':
        case 'uppercase':
            const upperName = currentName.toUpperCase();
            botNameData.name = upperName;
            writeBotName(botNameData);
            
            await conn.sendMessage(from, {
                text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Converted to UPPERCASE
┃ ┣ Old: ${currentName}
┃ ┗ New: ${upperName}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== LOWERCASE =====
        case 'lower':
        case 'lowercase':
            const lowerName = currentName.toLowerCase();
            botNameData.name = lowerName;
            writeBotName(botNameData);
            
            await conn.sendMessage(from, {
                text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Converted to lowercase
┃ ┣ Old: ${currentName}
┃ ┗ New: ${lowerName}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== CAPITALIZE =====
        case 'capitalize':
        case 'cap':
            const capName = currentName.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ).join(' ');
            botNameData.name = capName;
            writeBotName(botNameData);
            
            await conn.sendMessage(from, {
                text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Capitalized each word
┃ ┣ Old: ${currentName}
┃ ┗ New: ${capName}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== HISTORY =====
        case 'history':
            // Read history file if exists
            const historyFile = path.join(SETTINGS_DIR, 'botname_history.json');
            let history = [];
            if (fs.existsSync(historyFile)) {
                history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
            }
            
            let historyText = `┏━❑ BOT NAME HISTORY ━━━━━━━━━\n┃\n`;
            if (history.length > 0) {
                history.slice(-10).reverse().forEach((name, i) => {
                    historyText += `┃ ${i+1}. ${name}\n`;
                });
            } else {
                historyText += `┃ No history available\n`;
            }
            historyText += `┃\n┗━━━━━━━━━━━━━━━━━━━━`;
            
            await conn.sendMessage(from, {
                text: historyText,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== SET NEW NAME =====
        default:
            // Save to history
            const newBotName = args.join(' ');
            
            // Validate
            if (newBotName.length < 2) {
                return await conn.sendMessage(from, {
                    text: `❌ Bot name too short (minimum 2 characters)`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            if (newBotName.length > 50) {
                return await conn.sendMessage(from, {
                    text: `❌ Bot name too long (maximum 50 characters)`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            // Update name
            botNameData.name = newBotName;
            writeBotName(botNameData);
            
            // Save to history
            const histFile = path.join(SETTINGS_DIR, 'botname_history.json');
            let hist = [];
            if (fs.existsSync(histFile)) {
                hist = JSON.parse(fs.readFileSync(histFile, 'utf8'));
            }
            hist.push(currentName);
            if (hist.length > 20) hist.shift(); // Keep last 20
            fs.writeFileSync(histFile, JSON.stringify(hist, null, 2));
            
            await conn.sendMessage(from, {
                text: `┏━❑ BOT NAME UPDATED ━━━━━━━━━
┃ ✅ Bot name changed successfully
┃ 
┃ *Old Name:* 
┃ ${currentName}
┃ 
┃ *New Name:* 
┃ ${newBotName}
┃ 
┃ *Styled Examples:*
┃ 𝐁𝐨𝐥𝐝: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56832 + c.charCodeAt(0)))}
┃ 𝘐𝘵𝘢𝘭𝘪𝘤: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56864 + c.charCodeAt(0)))}
┃ 𝕊𝕔𝕣𝕚𝕡𝕥: ${newBotName.replace(/[A-Za-z]/g, c => String.fromCharCode(55349, 56944 + c.charCodeAt(0)))}
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
    }

} catch (e) {
    console.log('SETBOTNAME ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ FUNCTION YA KUPATA BOT NAME ============
async function getBotName() {
    try {
        const data = readBotName();
        return data.name;
    } catch (e) {
        return DEFAULT_BOT_NAME;
    }
}

// ============ FUNCTION YA KUBADILISHA BOT NAME KWENYE MESSAGES ============
async function replaceBotName(text) {
    try {
        const botName = await getBotName();
        return text.replace(/{botName}/g, botName);
    } catch (e) {
        return text;
    }
}

// ============ STYLING FUNCTIONS ============
function styleBold(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56832 + c.charCodeAt(0))
    );
}

function styleItalic(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56864 + c.charCodeAt(0))
    );
}

function styleBoldItalic(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56896 + c.charCodeAt(0))
    );
}

function styleScript(text) {
    return text.replace(/[A-Za-z]/g, c => 
        String.fromCharCode(55349, 56944 + c.charCodeAt(0))
    );
}

function styleDoubleStruck(text) {
    return text.replace(/[A-Za-z]/g, c => {
        const base = c === c.toUpperCase() ? 120120 : 120122;
        return String.fromCodePoint(base + c.toUpperCase().charCodeAt(0) - 65);
    });
}

function styleCircled(text) {
    const circled = {
        'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ',
        'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ',
        'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ',
        'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ',
        'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ'
    };
    return text.split('').map(c => circled[c.toUpperCase()] || c).join('');
}

// Export functions
module.exports = {
    getBotName,
    replaceBotName,
    styleBold,
    styleItalic,
    styleBoldItalic,
    styleScript,
    styleDoubleStruck,
    styleCircled
};
