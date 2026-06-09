const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path za settings files
const SETTINGS_DIR = path.join(__dirname, '../data');
const IGNORE_LIST_FILE = path.join(SETTINGS_DIR, 'ignorelist.json');
const COUNTRY_CODES_FILE = path.join(SETTINGS_DIR, 'countrycodes.json');
const AUTO_BLOCK_FILE = path.join(SETTINGS_DIR, 'autoblock.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// ============ FUNCTIONS ZA KUSOMA NA KUANDIKA DATA ============

// Function ya kusoma ignore list
function readIgnoreList() {
    try {
        if (fs.existsSync(IGNORE_LIST_FILE)) {
            const data = fs.readFileSync(IGNORE_LIST_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { users: [], groups: [] };
    } catch (error) {
        console.log('Error reading ignore list:', error);
        return { users: [], groups: [] };
    }
}

// Function ya kuandika ignore list
function writeIgnoreList(data) {
    try {
        fs.writeFileSync(IGNORE_LIST_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing ignore list:', error);
        return false;
    }
}

// Function ya kusoma country codes
function readCountryCodes() {
    try {
        if (fs.existsSync(COUNTRY_CODES_FILE)) {
            const data = fs.readFileSync(COUNTRY_CODES_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('Error reading country codes:', error);
        return [];
    }
}

// Function ya kuandika country codes
function writeCountryCodes(data) {
    try {
        fs.writeFileSync(COUNTRY_CODES_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing country codes:', error);
        return false;
    }
}

// Function ya kusoma auto block settings
function readAutoBlock() {
    try {
        if (fs.existsSync(AUTO_BLOCK_FILE)) {
            const data = fs.readFileSync(AUTO_BLOCK_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { enabled: false, countryCodes: [] };
    } catch (error) {
        console.log('Error reading auto block:', error);
        return { enabled: false, countryCodes: [] };
    }
}

// Function ya kuandika auto block settings
function writeAutoBlock(data) {
    try {
        fs.writeFileSync(AUTO_BLOCK_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing auto block:', error);
        return false;
    }
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

// ============ 1. ADD IGNORE LIST COMMAND ============
cmd({
    pattern: "addignorelist",
    alias: ["addignore", "ignoreuser", "ignoregroup"],
    react: "🚫",
    desc: "Add user or group to ignore list",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isOwner, args, quoted, mentionedJid}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `┏━❑ ADD IGNORE LIST ━━━━━━━━━
┃ 📝 *Usage:*
┃ 
┃ • Add user: .addignorelist @user
┃ • Add user: .addignorelist 2557xxxxxx
┃ • Add group: .addignorelist groupjid
┃ • Reply to user: .addignorelist
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let target = '';
    let type = '';
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
        type = 'user';
    }
    // Check if mentioning someone
    else if (mentionedJid && mentionedJid.length > 0) {
        target = mentionedJid[0];
        type = 'user';
    }
    // Check if it's a group JID
    else if (args[0].includes('@g.us')) {
        target = args[0];
        type = 'group';
    }
    // Check if it's a phone number
    else {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length >= 10) {
            target = number + '@s.whatsapp.net';
            type = 'user';
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Invalid number format`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Read current ignore list
    let ignoreList = readIgnoreList();
    
    // Add to appropriate list
    if (type === 'user') {
        if (!ignoreList.users.includes(target)) {
            ignoreList.users.push(target);
            await conn.sendMessage(from, {
                text: `┏━❑ IGNORE LIST UPDATED ━━━━━━━━━
┃ ✅ User added to ignore list
┃ 👤 @${target.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
                mentions: [target],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        } else {
            return await conn.sendMessage(from, {
                text: `❌ User already in ignore list`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else if (type === 'group') {
        if (!ignoreList.groups.includes(target)) {
            ignoreList.groups.push(target);
            await conn.sendMessage(from, {
                text: `┏━❑ IGNORE LIST UPDATED ━━━━━━━━━
┃ ✅ Group added to ignore list
┃ 🆔 ${target}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Group already in ignore list`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Save to file
    writeIgnoreList(ignoreList);

} catch (e) {
    console.log('ADDIGNORELIST ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ 2. DEL IGNORE LIST COMMAND ============
cmd({
    pattern: "delignorelist",
    alias: ["removeignore", "unignoreuser", "unignoregroup"],
    react: "✅",
    desc: "Remove user or group from ignore list",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isOwner, args, quoted, mentionedJid}) => {
try{
    if (!isOwner) return;
    
    if (!args[0] && !m.quoted) {
        return await conn.sendMessage(from, {
            text: `┏━❑ REMOVE IGNORE LIST ━━━━━━━━━
┃ 📝 *Usage:*
┃ 
┃ • Remove user: .delignorelist @user
┃ • Remove user: .delignorelist 2557xxxxxx
┃ • Remove group: .delignorelist groupjid
┃ • Reply to user: .delignorelist
┃ 
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let target = '';
    let type = '';
    
    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
        type = 'user';
    } else if (mentionedJid && mentionedJid.length > 0) {
        target = mentionedJid[0];
        type = 'user';
    } else if (args[0].includes('@g.us')) {
        target = args[0];
        type = 'group';
    } else {
        let number = args[0].replace(/[^0-9]/g, '');
        if (number.length >= 10) {
            target = number + '@s.whatsapp.net';
            type = 'user';
        } else {
            return;
        }
    }
    
    let ignoreList = readIgnoreList();
    let removed = false;
    
    if (type === 'user') {
        const index = ignoreList.users.indexOf(target);
        if (index > -1) {
            ignoreList.users.splice(index, 1);
            removed = true;
            await conn.sendMessage(from, {
                text: `✅ User @${target.split('@')[0]} removed from ignore list`,
                mentions: [target],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else if (type === 'group') {
        const index = ignoreList.groups.indexOf(target);
        if (index > -1) {
            ignoreList.groups.splice(index, 1);
            removed = true;
            await conn.sendMessage(from, {
                text: `✅ Group removed from ignore list`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    if (!removed) {
        return await conn.sendMessage(from, {
            text: `❌ Not found in ignore list`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    writeIgnoreList(ignoreList);

} catch (e) { console.log(e); }
});

// ============ 3. AUTO BLOCK COMMAND ============
cmd({
    pattern: "autoblock",
    alias: ["toggleautoblock", "setautoblock"],
    react: "🔒",
    desc: "Enable/disable auto block for specific countries",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    let autoBlock = readAutoBlock();
    
    if (!args[0]) {
        const status = autoBlock.enabled ? 'ENABLED' : 'DISABLED';
        const countries = autoBlock.countryCodes.length > 0 
            ? autoBlock.countryCodes.join(', ') 
            : 'None';
        
        return await conn.sendMessage(from, {
            text: `┏━❑ AUTO BLOCK SETTINGS ━━━━━━━━━
┃ 🔒 *Status:* ${status}
┃ 🌍 *Countries:* ${countries}
┃ 
┃ *Commands:*
┃ • .autoblock on - Enable
┃ • .autoblock off - Disable
┃ • .addcountrycode 255 - Add country
┃ • .delcountrycode 255 - Remove country
┃ • .listcountrycode - List all
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    if (args[0] === 'on' || args[0] === 'enable') {
        autoBlock.enabled = true;
        writeAutoBlock(autoBlock);
        await conn.sendMessage(from, {
            text: `✅ Auto block ENABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else if (args[0] === 'off' || args[0] === 'disable') {
        autoBlock.enabled = false;
        writeAutoBlock(autoBlock);
        await conn.sendMessage(from, {
            text: `✅ Auto block DISABLED`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 4. ADD COUNTRY CODE COMMAND ============
cmd({
    pattern: "addcountrycode",
    alias: ["addcountry", "addcc"],
    react: "🌍",
    desc: "Add country code to auto block list",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide country code\n\nExample: .addcountrycode 255`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let countryCode = args[0].replace(/[^0-9]/g, '');
    
    if (countryCode.length < 1 || countryCode.length > 4) {
        return await conn.sendMessage(from, {
            text: `❌ Invalid country code`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let autoBlock = readAutoBlock();
    
    if (!autoBlock.countryCodes.includes(countryCode)) {
        autoBlock.countryCodes.push(countryCode);
        writeAutoBlock(autoBlock);
        
        await conn.sendMessage(from, {
            text: `┏━❑ COUNTRY CODE ADDED ━━━━━━━━━
┃ ✅ Added: +${countryCode}
┃ 📋 Total: ${autoBlock.countryCodes.length} countries
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, {
            text: `❌ Country code +${countryCode} already exists`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 5. DEL COUNTRY CODE COMMAND ============
cmd({
    pattern: "delcountrycode",
    alias: ["removecountry", "delcc", "removecc"],
    react: "🗑️",
    desc: "Remove country code from auto block list",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args}) => {
try{
    if (!isOwner) return;
    
    if (!args[0]) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide country code\n\nExample: .delcountrycode 255`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let countryCode = args[0].replace(/[^0-9]/g, '');
    let autoBlock = readAutoBlock();
    
    const index = autoBlock.countryCodes.indexOf(countryCode);
    
    if (index > -1) {
        autoBlock.countryCodes.splice(index, 1);
        writeAutoBlock(autoBlock);
        
        await conn.sendMessage(from, {
            text: `┏━❑ COUNTRY CODE REMOVED ━━━━━━━━━
┃ ✅ Removed: +${countryCode}
┃ 📋 Remaining: ${autoBlock.countryCodes.length} countries
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, {
            text: `❌ Country code +${countryCode} not found`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 6. LIST COUNTRY CODE COMMAND ============
cmd({
    pattern: "listcountrycode",
    alias: ["listcountries", "listcc", "countries"],
    react: "📋",
    desc: "List all country codes in auto block",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner}) => {
try{
    if (!isOwner) return;
    
    let autoBlock = readAutoBlock();
    let ignoreList = readIgnoreList();
    
    let countryList = "┏━❑ AUTO BLOCK COUNTRIES ━━━━━━━━━\n┃\n";
    
    if (autoBlock.countryCodes.length > 0) {
        autoBlock.countryCodes.sort().forEach((code, i) => {
            countryList += `┃ ${i+1}. +${code}\n`;
        });
        countryList += `┃\n┃ Total: ${autoBlock.countryCodes.length} countries\n`;
    } else {
        countryList += `┃ No country codes added\n`;
    }
    
    countryList += `┃\n┃ 🔒 Auto Block: ${autoBlock.enabled ? 'ON' : 'OFF'}\n`;
    countryList += `┃\n┃━━━━━━━━━━━━━━━━━━━━\n┃\n`;
    countryList += `┃ 🚫 Ignored Users: ${ignoreList.users.length}\n`;
    countryList += `┃ 🚫 Ignored Groups: ${ignoreList.groups.length}\n`;
    countryList += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: countryList,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 7. LIST IGNORE COMMAND ============
cmd({
    pattern: "listignore",
    alias: ["ignorelist", "viewignore"],
    react: "📋",
    desc: "List all ignored users and groups",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner}) => {
try{
    if (!isOwner) return;
    
    let ignoreList = readIgnoreList();
    
    let ignoreText = "┏━❑ IGNORE LIST ━━━━━━━━━\n┃\n";
    
    ignoreText += "┃ 👤 *IGNORED USERS:*\n";
    if (ignoreList.users.length > 0) {
        ignoreList.users.forEach((user, i) => {
            ignoreText += `┃ ${i+1}. @${user.split('@')[0]}\n`;
        });
    } else {
        ignoreText += `┃ No ignored users\n`;
    }
    
    ignoreText += `┃\n┃ 👥 *IGNORED GROUPS:*\n`;
    if (ignoreList.groups.length > 0) {
        ignoreList.groups.forEach((group, i) => {
            ignoreText += `┃ ${i+1}. ${group.split('@')[0]}\n`;
        });
    } else {
        ignoreText += `┃ No ignored groups\n`;
    }
    
    ignoreText += `┃\n┃ Total: ${ignoreList.users.length + ignoreList.groups.length} items\n`;
    ignoreText += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: ignoreText,
        mentions: ignoreList.users,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ AUTO BLOCK MIDDLEWARE ============
// Hii inaangalia na kublock automatically watu wenye country codes zilizopo kwenye list

async function checkAndBlockAuto(conn, jid, userJid) {
    try {
        let autoBlock = readAutoBlock();
        if (!autoBlock.enabled || autoBlock.countryCodes.length === 0) return false;
        
        // Extract country code from user JID
        const number = userJid.split('@')[0];
        for (let code of autoBlock.countryCodes) {
            if (number.startsWith(code)) {
                // Block the user
                await conn.updateBlockStatus(userJid, 'block');
                console.log(`Auto-blocked: ${userJid} (Country code: +${code})`);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('Auto block error:', error);
        return false;
    }
}

// ============ IGNORE LIST MIDDLEWARE ============
// Hii inaangalia kama user/group ipo kwenye ignore list

async function isIgnored(jid, isGroup) {
    try {
        let ignoreList = readIgnoreList();
        
        if (isGroup) {
            return ignoreList.groups.includes(jid);
        } else {
            return ignoreList.users.includes(jid);
        }
    } catch (error) {
        console.log('Ignore check error:', error);
        return false;
    }
}

// Export functions for use in other files
module.exports = {
    checkAndBlockAuto,
    isIgnored,
    readIgnoreList,
    readAutoBlock,
    readCountryCodes
};
