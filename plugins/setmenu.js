const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path za settings
const SETTINGS_DIR = path.join(__dirname, '../data');
const MENU_SETTINGS_FILE = path.join(SETTINGS_DIR, 'menusettings.json');

// Hakikisha folder ipo
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// Default menu settings
const DEFAULT_MENU = {
    style: 'v1',           // v1, v2, v3, v4, v5
    theme: 'default',      // default, dark, light, neon, ocean, forest, sunset, galaxy
    layout: 'list',        // list, grid, compact, detailed
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
    },
    colors: {
        header: '#00ff00',
        category: '#ffff00',
        command: '#ffffff',
        alias: '#888888',
        desc: '#cccccc'
    }
};

// Function ya kusoma menu settings
function readMenuSettings() {
    try {
        if (fs.existsSync(MENU_SETTINGS_FILE)) {
            const data = fs.readFileSync(MENU_SETTINGS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return DEFAULT_MENU;
    } catch (error) {
        console.log('Error reading menu settings:', error);
        return DEFAULT_MENU;
    }
}

// Function ya kuandika menu settings
function writeMenuSettings(data) {
    try {
        fs.writeFileSync(MENU_SETTINGS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.log('Error writing menu settings:', error);
        return false;
    }
}

// Function ya kureset menu settings
function resetMenuSettings() {
    return writeMenuSettings(DEFAULT_MENU);
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

// ============ SETMENU COMMAND ============
cmd({
    pattern: "setmenu",
    alias: ["menusetting", "menusettings", "menuconfig"],
    react: "🎨",
    desc: "Configure menu appearance and style",
    category: "settings",
    filename: __filename
},
async(conn, mek, m, {from, l, sender, isOwner, args, reply}) => {
try{
    if (!isOwner) return await conn.sendMessage(from, {
        text: `❌ This command is only for bot owner`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    let menuSettings = readMenuSettings();
    
    // No arguments - show current settings
    if (!args[0]) {
        let settingsText = `┏━❑ CURRENT MENU SETTINGS ━━━━━━━━━
┃ 
┃ 🎨 *STYLE:* ${menuSettings.style}
┃ 🎭 *THEME:* ${menuSettings.theme}
┃ 📋 *LAYOUT:* ${menuSettings.layout}
┃ 
┃ ⚙️ *Options:*
┃ • Show Header: ${menuSettings.showCategoryHeader}
┃ • Show Aliases: ${menuSettings.showAlias}
┃ • Show Desc: ${menuSettings.showDescription}
┃ • Show React: ${menuSettings.showReact}
┃ 
┃ 🎯 *Available Commands:*
┃ 
┃ *STYLES:*
┃ • .setmenu style v1 (simple)
┃ • .setmenu style v2 (boxed)
┃ • .setmenu style v3 (modern)
┃ • .setmenu style v4 (minimal)
┃ • .setmenu style v5 (fancy)
┃ 
┃ *THEMES:*
┃ • .setmenu theme default
┃ • .setmenu theme dark
┃ • .setmenu theme light
┃ • .setmenu theme neon
┃ • .setmenu theme ocean
┃ • .setmenu theme forest
┃ • .setmenu theme sunset
┃ • .setmenu theme galaxy
┃ 
┃ *LAYOUTS:*
┃ • .setmenu layout list
┃ • .setmenu layout grid
┃ • .setmenu layout compact
┃ • .setmenu layout detailed
┃ 
┃ *TOGGLES:*
┃ • .setmenu header on/off
┃ • .setmenu alias on/off
┃ • .setmenu desc on/off
┃ • .setmenu react on/off
┃ 
┃ *OTHER:*
┃ • .setmenu reset (default)
┃ • .setmenu preview (test)
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
        
        // ===== STYLE COMMANDS =====
        case 'style':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please specify style: v1, v2, v3, v4, v5`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const validStyles = ['v1', 'v2', 'v3', 'v4', 'v5'];
            if (!validStyles.includes(args[1].toLowerCase())) {
                return await conn.sendMessage(from, {
                    text: `❌ Invalid style. Use: v1, v2, v3, v4, v5`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            menuSettings.style = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            
            await conn.sendMessage(from, {
                text: `✅ Menu style set to: *${args[1]}*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== THEME COMMANDS =====
        case 'theme':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please specify theme: default, dark, light, neon, ocean, forest, sunset, galaxy`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const validThemes = ['default', 'dark', 'light', 'neon', 'ocean', 'forest', 'sunset', 'galaxy'];
            if (!validThemes.includes(args[1].toLowerCase())) {
                return await conn.sendMessage(from, {
                    text: `❌ Invalid theme`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            menuSettings.theme = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            
            await conn.sendMessage(from, {
                text: `✅ Menu theme set to: *${args[1]}*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== LAYOUT COMMANDS =====
        case 'layout':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please specify layout: list, grid, compact, detailed`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const validLayouts = ['list', 'grid', 'compact', 'detailed'];
            if (!validLayouts.includes(args[1].toLowerCase())) {
                return await conn.sendMessage(from, {
                    text: `❌ Invalid layout`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            menuSettings.layout = args[1].toLowerCase();
            writeMenuSettings(menuSettings);
            
            await conn.sendMessage(from, {
                text: `✅ Menu layout set to: *${args[1]}*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== TOGGLE HEADER =====
        case 'header':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setmenu header on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            if (args[1].toLowerCase() === 'on') {
                menuSettings.showCategoryHeader = true;
                await conn.sendMessage(from, {
                    text: `✅ Category headers: *ON*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showCategoryHeader = false;
                await conn.sendMessage(from, {
                    text: `✅ Category headers: *OFF*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                return await conn.sendMessage(from, {
                    text: `❌ Use on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            writeMenuSettings(menuSettings);
            break;
            
        // ===== TOGGLE ALIAS =====
        case 'alias':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setmenu alias on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            if (args[1].toLowerCase() === 'on') {
                menuSettings.showAlias = true;
                await conn.sendMessage(from, {
                    text: `✅ Show aliases: *ON*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showAlias = false;
                await conn.sendMessage(from, {
                    text: `✅ Show aliases: *OFF*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                return await conn.sendMessage(from, {
                    text: `❌ Use on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            writeMenuSettings(menuSettings);
            break;
            
        // ===== TOGGLE DESCRIPTION =====
        case 'desc':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setmenu desc on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            if (args[1].toLowerCase() === 'on') {
                menuSettings.showDescription = true;
                await conn.sendMessage(from, {
                    text: `✅ Show descriptions: *ON*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showDescription = false;
                await conn.sendMessage(from, {
                    text: `✅ Show descriptions: *OFF*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                return await conn.sendMessage(from, {
                    text: `❌ Use on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            writeMenuSettings(menuSettings);
            break;
            
        // ===== TOGGLE REACT =====
        case 'react':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setmenu react on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            if (args[1].toLowerCase() === 'on') {
                menuSettings.showReact = true;
                await conn.sendMessage(from, {
                    text: `✅ Show reactions: *ON*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else if (args[1].toLowerCase() === 'off') {
                menuSettings.showReact = false;
                await conn.sendMessage(from, {
                    text: `✅ Show reactions: *OFF*`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                return await conn.sendMessage(from, {
                    text: `❌ Use on/off`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            writeMenuSettings(menuSettings);
            break;
            
        // ===== RESET TO DEFAULT =====
        case 'reset':
            resetMenuSettings();
            await conn.sendMessage(from, {
                text: `✅ Menu settings reset to default`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== PREVIEW MENU =====
        case 'preview':
            await showMenuPreview(conn, from, sender, menuSettings);
            break;
            
        // ===== CUSTOM HEADER =====
        case 'setheader':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please provide header text\nUse {botName} for bot name`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const headerText = args.slice(1).join(' ');
            menuSettings.header = headerText;
            writeMenuSettings(menuSettings);
            
            await conn.sendMessage(from, {
                text: `✅ Custom header set:\n${headerText}`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== CUSTOM FOOTER =====
        case 'setfooter':
            if (!args[1]) {
                return await conn.sendMessage(from, {
                    text: `❌ Please provide footer text\nUse {botName} for bot name`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const footerText = args.slice(1).join(' ');
            menuSettings.footer = footerText;
            writeMenuSettings(menuSettings);
            
            await conn.sendMessage(from, {
                text: `✅ Custom footer set:\n${footerText}`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            break;
            
        // ===== SET EMOJI =====
        case 'setemoji':
            if (!args[1] || !args[2]) {
                return await conn.sendMessage(from, {
                    text: `❌ Use: .setmenu setemoji [type] [emoji]\n\nTypes: category, command, alias, desc, react`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            
            const emojiType = args[1].toLowerCase();
            const emoji = args[2];
            
            if (menuSettings.emoji.hasOwnProperty(emojiType)) {
                menuSettings.emoji[emojiType] = emoji;
                writeMenuSettings(menuSettings);
                await conn.sendMessage(from, {
                    text: `✅ ${emojiType} emoji set to: ${emoji}`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            } else {
                await conn.sendMessage(from, {
                    text: `❌ Invalid emoji type`,
                    contextInfo: getContextInfo({ sender: sender })
                }, { quoted: fkontak });
            }
            break;
            
        default:
            await conn.sendMessage(from, {
                text: `❌ Unknown command. Use .setmenu for help`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
    }

} catch (e) {
    console.log('SETMENU ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// Function ya kuonyesha preview ya menu
async function showMenuPreview(conn, from, sender, settings) {
    try {
        const botName = '𝐒𝐈𝐋𝐀 𝐌𝐃';
        let preview = '';
        
        // Header
        let header = settings.header.replace('{botName}', botName);
        preview += header + '\n┃\n';
        
        // Sample categories
        const sampleCategories = ['MAIN', 'GROUP', 'DOWNLOAD'];
        
        sampleCategories.forEach((category, catIndex) => {
            if (settings.showCategoryHeader) {
                preview += `┃ ${settings.emoji.category} *${category}*\n`;
            }
            
            // Sample commands
            const sampleCommands = catIndex === 0 ? ['menu', 'ping'] : 
                                  catIndex === 1 ? ['mute', 'link'] : 
                                  ['play', 'video'];
            
            sampleCommands.forEach(cmd => {
                let line = '┃ ';
                
                // Different layouts
                if (settings.layout === 'grid') {
                    line += `[ ${cmd} ]  `;
                } else if (settings.layout === 'compact') {
                    line += `${settings.emoji.command} .${cmd}`;
                    if (settings.showAlias) line += ` (al)`;
                } else if (settings.layout === 'detailed') {
                    line += `${settings.emoji.command} .${cmd}\n`;
                    if (settings.showAlias) line += `┃   ${settings.emoji.alias} aliases: menu, mn\n`;
                    if (settings.showDescription) line += `┃   ${settings.emoji.desc} Show bot menu\n`;
                } else {
                    // list layout
                    line += `${settings.emoji.command} .${cmd}`;
                    if (settings.showAlias) line += ` ${settings.emoji.alias}(mn)`;
                    if (settings.showDescription) line += ` ${settings.emoji.desc} description`;
                }
                
                if (settings.layout !== 'detailed') {
                    preview += line + '\n';
                } else {
                    preview += line;
                }
                
                if (settings.showReact) {
                    preview += ` ${settings.emoji.react}⚡`;
                }
            });
            
            preview += '┃\n';
        });
        
        // Footer
        let footer = settings.footer.replace('{botName}', botName);
        preview += footer;
        
        // Theme note
        preview += `\n\n*Theme: ${settings.theme} | Style: ${settings.style}*`;
        
        await conn.sendMessage(from, {
            text: preview,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
    } catch (e) {
        console.log('Preview error:', e);
    }
}

// ============ GET MENU FUNCTION ============
// Function ya kupata menu settings kwa ajili ya menu command
async function getMenuStyle() {
    return readMenuSettings();
}

// Export functions
module.exports = {
    getMenuStyle,
    readMenuSettings
};
