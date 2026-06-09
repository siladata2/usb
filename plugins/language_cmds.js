const { cmd } = require("../command");
const fs = require('fs');
const path = require('path');
const languages = require('../lib/languages');

// Path to language database
const langDbPath = path.join(__dirname, '../data/user_lang.json');

// Load user languages
let userLanguages = {};
try {
    if (fs.existsSync(langDbPath)) {
        userLanguages = JSON.parse(fs.readFileSync(langDbPath));
    }
} catch (e) {
    console.error('Error loading language database:', e);
}

// Save user language
function saveUserLanguage(userJid, langCode) {
    try {
        userLanguages[userJid] = {
            code: langCode,
            updatedAt: Date.now()
        };
        fs.writeFileSync(langDbPath, JSON.stringify(userLanguages, null, 2));
        return true;
    } catch (e) {
        console.error('Error saving language:', e);
        return false;
    }
}

// Get user language (default to sw)
function getUserLanguage(userJid) {
    return userLanguages[userJid]?.code || 'sw';
}

// Get language text
function getLangText(userJid, key) {
    const langCode = getUserLanguage(userJid);
    const lang = languages[langCode] || languages['sw'];
    
    // Support nested keys (e.g., 'groupMenu')
    const keys = key.split('.');
    let value = lang;
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            // Fallback to Swahili if key not found
            let fallback = languages['sw'];
            for (const fk of keys) {
                fallback = fallback?.[fk];
            }
            return fallback || key;
        }
    }
    return value;
}

// ==================== COMMAND YA KUANGALIA LUGHA ====================

cmd({
    pattern: "lang",
    alias: ["language", "lugha", "اللغة"],
    desc: "Change bot language",
    category: "settings",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const args = q.toLowerCase().trim();
        
        // If no argument, show current language and list
        if (!args) {
            const currentLang = getUserLanguage(sender);
            const current = languages[currentLang];
            
            let msg = `🌐 *LANGUAGE SETTINGS*\n\n`;
            msg += `${getLangText(sender, 'langCurrent')} ${current.flag} ${current.name}\n\n`;
            msg += `${getLangText(sender, 'langList')}\n`;
            
            // List all available languages
            for (const [code, lang] of Object.entries(languages)) {
                const status = code === currentLang ? '✅' : '🔘';
                msg += `${status} ${lang.flag} .lang ${code} - ${lang.name}\n`;
            }
            
            msg += `\n${getLangText(sender, 'langChoose')}`;
            
            return reply(msg);
        }
        
        // Check if requested language exists
        if (!languages[args]) {
            return reply(`❌ Lugha "${args}" haipo. Chagua: sw, en, ar`);
        }
        
        // Save user's language preference
        if (saveUserLanguage(sender, args)) {
            const newLang = languages[args];
            reply(`${getLangText(sender, 'langChanged')} ${newLang.flag} ${newLang.name}!`);
            
            // Send confirmation in new language
            setTimeout(() => {
                const confirmMsg = getLangText(sender, 'success');
                conn.sendMessage(from, { text: confirmMsg }, { quoted: m });
            }, 500);
        } else {
            reply(getLangText(sender, 'error') + ' Failed to save language.');
        }
        
    } catch (e) {
        console.error('Language command error:', e);
        reply('❌ Error in language command.');
    }
});

// ==================== COMMAND YA KUPATA LUGHA YA SASA ====================

cmd({
    pattern: "mylang",
    alias: ["currentlang", "lughayangu"],
    desc: "Show your current language",
    category: "settings",
    react: "🔤",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const currentLang = getUserLanguage(sender);
        const lang = languages[currentLang];
        
        reply(`${getLangText(sender, 'langCurrent')} ${lang.flag} ${lang.name}`);
        
    } catch (e) {
        console.error('MyLang error:', e);
        reply('❌ Error.');
    }
});

// ==================== COMMAND YA KURESETI LUGHA ====================

cmd({
    pattern: "resetlang",
    alias: ["defaultlang"],
    desc: "Reset language to default (Swahili)",
    category: "settings",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (saveUserLanguage(sender, 'sw')) {
            reply(`${getLangText(sender, 'langChanged')} 🇹🇿 Kiswahili (Default)!`);
        } else {
            reply(getLangText(sender, 'error'));
        }
    } catch (e) {
        console.error('Reset lang error:', e);
        reply('❌ Error.');
    }
});

// Export functions for use in other commands
module.exports = {
    getUserLanguage,
    getLangText,
    languages
};
