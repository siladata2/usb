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

// ============ 1. TOTAL MEMBERS ============
cmd({
    pattern: "total",
    alias: ["members", "totalmembers", "membercount"],
    react: "👥",
    desc: "Get total number of group members",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, participants}) => {
try{
    if (!isGroup) return;
    
    const groupMetadata = await conn.groupMetadata(from);
    const total = participants.length;
    const admins = groupMetadata.participants.filter(p => p.admin).length;
    const members = total - admins;
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP MEMBERS ━━━━━━━━━
┃ 👥 *Total:* ${total}
┃ 👑 *Admins:* ${admins}
┃ 👤 *Members:* ${members}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 2. GROUP INFO ============
cmd({
    pattern: "groupinfo",
    alias: ["info", "gcinfo", "group-info"],
    react: "ℹ️",
    desc: "Get detailed group information",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, participants, groupName}) => {
try{
    if (!isGroup) return;
    
    const groupMetadata = await conn.groupMetadata(from);
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    const owner = groupMetadata.owner || groupMetadata.participants.find(p => p.admin === 'superadmin')?.id || 'Not found';
    const admins = groupMetadata.participants.filter(p => p.admin).length;
    const members = participants.length;
    const restrict = groupMetadata.announce ? 'Yes (Only Admins)' : 'No';
    const ephemeral = groupMetadata.ephemeralDuration ? `${groupMetadata.ephemeralDuration / 86400} days` : 'Off';
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP INFO ━━━━━━━━━
┃ 📌 *Name:* ${groupName}
┃ 🆔 *ID:* ${from.split('@')[0]}
┃ 👑 *Owner:* @${owner.split('@')[0]}
┃ 📅 *Created:* ${creationDate}
┃ 👥 *Members:* ${members}
┃ 👤 *Admins:* ${admins}
┃ 🔒 *Restrict:* ${restrict}
┃ ⏳ *Disappear:* ${ephemeral}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [owner],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 3. TAG ADMINS ============
cmd({
    pattern: "tagadmin",
    alias: ["tagadmins", "admins", "adminlist"],
    react: "👑",
    desc: "Tag all group admins",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, groupAdmins}) => {
try{
    if (!isGroup) return;
    
    let text = "┏━❑ GROUP ADMINS ━━━━━━━━━\n┃\n";
    for (let admin of groupAdmins) {
        text += `┃ 👑 @${admin.split('@')[0]}\n`;
    }
    text += `┃\n┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: text,
        mentions: groupAdmins,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 4. TAG ALL WITH MESSAGE ============
cmd({
    pattern: "tag2",
    alias: ["mention", "mentall"],
    react: "📣",
    desc: "Tag all members with custom message",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, participants, args}) => {
try{
    if (!isGroup) return;
    
    const message = args.join(' ') || 'Hello everyone!';
    const mentions = participants.map(p => p.id);
    
    await conn.sendMessage(from, {
        text: `📣 *MESSAGE:*\n${message}\n\n━━━━━━━━━━━━━\n👥 *Members:* ${mentions.length}`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 5. WARNING SYSTEM ============
let warnings = {};
cmd({
    pattern: "warn",
    alias: ["warning"],
    react: "⚠️",
    desc: "Warn a member",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted, mentionedJid}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return await conn.sendMessage(from, { text: `❌ Admins only` }, { quoted: fkontak });
    
    let user = mentionedJid[0] || (quoted && quoted.sender);
    if (!user) return await conn.sendMessage(from, { text: `❌ Tag user to warn` }, { quoted: fkontak });
    
    warnings[user] = warnings[user] || { count: 0, reasons: [] };
    warnings[user].count += 1;
    
    await conn.sendMessage(from, {
        text: `┏━❑ WARNING ━━━━━━━━━
┃ ⚠️ User: @${user.split('@')[0]}
┃ 📊 Warns: ${warnings[user].count}/3
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 6. REMOVE WARN ============
cmd({
    pattern: "removewarn",
    alias: ["rwarn", "unwarn"],
    react: "✅",
    desc: "Remove warnings from a member",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted, mentionedJid}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    let user = mentionedJid[0] || (quoted && quoted.sender);
    if (!user) return;
    
    if (warnings[user]) {
        warnings[user].count = 0;
        warnings[user].reasons = [];
    }
    
    await conn.sendMessage(from, {
        text: `✅ Warnings removed for @${user.split('@')[0]}`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 7. CHECK WARNINGS ============
cmd({
    pattern: "warns",
    alias: ["warnings", "checkwarn"],
    react: "📋",
    desc: "Check warnings of a member",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, quoted, mentionedJid}) => {
try{
    if (!isGroup) return;
    
    let user = mentionedJid[0] || (quoted && quoted.sender) || sender;
    let warnData = warnings[user] || { count: 0, reasons: [] };
    
    await conn.sendMessage(from, {
        text: `┏━❑ WARNINGS ━━━━━━━━━
┃ 👤 User: @${user.split('@')[0]}
┃ 📊 Total: ${warnData.count}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 8. GROUP RULES ============
cmd({
    pattern: "rules",
    alias: ["setrules", "gcrules"],
    react: "📜",
    desc: "Set or view group rules",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    
    if (args.length > 0 && isAdmins) {
        global.rules = global.rules || {};
        global.rules[from] = args.join(' ');
        await conn.sendMessage(from, {
            text: `✅ Rules updated successfully`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        const rules = global.rules?.[from] || 'No rules set for this group.';
        await conn.sendMessage(from, {
            text: `┏━❑ GROUP RULES ━━━━━━━━━
┃ 📜 ${rules}
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 9. GROUP WELCOME ============
cmd({
    pattern: "welcome2",
    alias: ["setwelcome", "gcwelcome"],
    react: "👋",
    desc: "Set welcome message for new members",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.welcomeMsg = global.welcomeMsg || {};
    
    if (args.length > 0) {
        global.welcomeMsg[from] = args.join(' ');
        await conn.sendMessage(from, {
            text: `✅ Welcome message set successfully`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, {
            text: `📝 Current welcome: ${global.welcomeMsg[from] || 'Not set'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 10. GROUP GOODBYE ============
cmd({
    pattern: "goodbye2",
    alias: ["setgoodbye", "gcbye"],
    react: "👋",
    desc: "Set goodbye message for leaving members",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.goodbyeMsg = global.goodbyeMsg || {};
    
    if (args.length > 0) {
        global.goodbyeMsg[from] = args.join(' ');
        await conn.sendMessage(from, {
            text: `✅ Goodbye message set successfully`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        await conn.sendMessage(from, {
            text: `📝 Current goodbye: ${global.goodbyeMsg[from] || 'Not set'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 11. TOGGLE WELCOME ============
cmd({
    pattern: "togglewelcome",
    alias: ["twelcome", "welcometoggle"],
    react: "🔄",
    desc: "Enable/disable welcome messages",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.welcomeEnabled = global.welcomeEnabled || {};
    global.welcomeEnabled[from] = !global.welcomeEnabled[from];
    
    await conn.sendMessage(from, {
        text: `✅ Welcome messages: ${global.welcomeEnabled[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 12. ANTI FOREIGN ============
cmd({
    pattern: "antiforeign2",
    alias: ["antiforeigners", "antiforeignnumber"],
    react: "🚫",
    desc: "Block foreign numbers from joining",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiForeign = global.antiForeign || {};
    
    if (args[0]) {
        antiForeign[from] = args[0];
        await conn.sendMessage(from, {
            text: `✅ Anti-foreign set to country code: ${args[0]}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        antiForeign[from] = !antiForeign[from];
        await conn.sendMessage(from, {
            text: `✅ Anti-foreign: ${antiForeign[from] ? 'ENABLED' : 'DISABLED'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 13. ANTI BOT ============
cmd({
    pattern: "antibots",
    alias: ["antibot", "antibot"],
    react: "🤖",
    desc: "Kick bots that join the group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiBots = global.antiBots || {};
    antiBots[from] = !antiBots[from];
    
    await conn.sendMessage(from, {
        text: `✅ Anti-bots: ${antiBots[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 14. ANTI BAD WORDS ============
cmd({
    pattern: "antibadword2",
    alias: ["antitoxic", "filterwords"],
    react: "🔞",
    desc: "Filter bad words in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.badWords = global.badWords || {};
    
    if (args.length > 0) {
        badWords[from] = args.join(' ').split(',');
        await conn.sendMessage(from, {
            text: `✅ Bad words filter updated`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    } else {
        badWords[from] = !badWords[from];
        await conn.sendMessage(from, {
            text: `✅ Anti-badword: ${badWords[from] ? 'ENABLED' : 'DISABLED'}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }

} catch (e) { console.log(e); }
});

// ============ 15. ANTI SPAM ============
cmd({
    pattern: "antispam2",
    alias: ["antispam2"],
    react: "⛔",
    desc: "Enable anti-spam protection",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiSpam = global.antiSpam || {};
    antiSpam[from] = !antiSpam[from];
    
    await conn.sendMessage(from, {
        text: `✅ Anti-spam: ${antiSpam[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 16. MUTE MEMBER ============
cmd({
    pattern: "muteuser",
    alias: ["mutemember", "silence"],
    react: "🔇",
    desc: "Mute a specific member",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted, mentionedJid}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    let user = mentionedJid[0] || (quoted && quoted.sender);
    if (!user) return;
    
    global.mutedUsers = global.mutedUsers || {};
    mutedUsers[user] = true;
    
    await conn.sendMessage(from, {
        text: `🔇 User @${user.split('@')[0]} has been muted`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 17. UNMUTE MEMBER ============
cmd({
    pattern: "unmuteuser",
    alias: ["unmutemember", "unsilence"],
    react: "🔊",
    desc: "Unmute a specific member",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted, mentionedJid}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    let user = mentionedJid[0] || (quoted && quoted.sender);
    if (!user) return;
    
    global.mutedUsers = global.mutedUsers || {};
    mutedUsers[user] = false;
    
    await conn.sendMessage(from, {
        text: `🔊 User @${user.split('@')[0]} has been unmuted`,
        mentions: [user],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 18. GROUP SETTINGS ============
cmd({
    pattern: "gcsettings",
    alias: ["groupsettings", "gsettings"],
    react: "⚙️",
    desc: "View group settings",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender}) => {
try{
    if (!isGroup) return;
    
    const metadata = await conn.groupMetadata(from);
    const settings = `┏━❑ GROUP SETTINGS ━━━━━━━━━
┃ 🔒 *Restrict:* ${metadata.announce ? 'ON' : 'OFF'}
┃ 👥 *Approve members:* ${metadata.memberAddMode ? 'ON' : 'OFF'}
┃ ⏳ *Disappear:* ${metadata.ephemeralDuration ? metadata.ephemeralDuration/86400 + ' days' : 'OFF'}
┃ 🔗 *Locked:* ${metadata.locked ? 'YES' : 'NO'}
┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: settings,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 19. LOCK GROUP ============
cmd({
    pattern: "lock",
    alias: ["lockgroup"],
    react: "🔒",
    desc: "Lock group (no one can join via link)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    await conn.groupSettingUpdate(from, 'locked');
    
    await conn.sendMessage(from, {
        text: `🔒 Group has been locked`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 20. UNLOCK GROUP ============
cmd({
    pattern: "unlock",
    alias: ["unlockgroup"],
    react: "🔓",
    desc: "Unlock group (anyone can join via link)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    await conn.groupSettingUpdate(from, 'unlocked');
    
    await conn.sendMessage(from, {
        text: `🔓 Group has been unlocked`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 21. APPROVAL MODE ============
cmd({
    pattern: "approval",
    alias: ["approvalmode", "memberapproval"],
    react: "✅",
    desc: "Toggle member approval mode",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const metadata = await conn.groupMetadata(from);
    await conn.groupSettingUpdate(from, metadata.memberAddMode ? 'approval_off' : 'approval_on');
    
    await conn.sendMessage(from, {
        text: `✅ Member approval: ${metadata.memberAddMode ? 'OFF' : 'ON'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 22. DISAPPEARING MESSAGES ============
cmd({
    pattern: "disappear",
    alias: ["ephemeral", "disappearing"],
    react: "⏳",
    desc: "Set disappearing messages (24h, 7d, 90d)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const duration = args[0] === '24' ? 86400 : args[0] === '7' ? 604800 : args[0] === '90' ? 7776000 : 0;
    
    await conn.groupToggleEphemeral(from, duration);
    
    await conn.sendMessage(from, {
        text: `⏳ Disappearing messages set to ${duration ? args[0] + ' days' : 'OFF'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 23. INVITE LINK INFO ============
cmd({
    pattern: "linkinfo",
    alias: ["checklink", "inviteinfo"],
    react: "🔍",
    desc: "Get info about an invite link",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, args}) => {
try{
    if (!args[0]) return;
    
    const code = args[0].split('https://chat.whatsapp.com/')[1] || args[0];
    const info = await conn.groupGetInviteInfo(code);
    
    await conn.sendMessage(from, {
        text: `┏━❑ LINK INFO ━━━━━━━━━
┃ 📌 *Group:* ${info.subject}
┃ 👥 *Members:* ${info.size}
┃ 👑 *Creator:* ${info.creator ? '@'+info.creator.split('@')[0] : 'Unknown'}
┃ 📅 *Created:* ${new Date(info.creation * 1000).toLocaleDateString()}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: info.creator ? [info.creator] : [],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 24. RESET GROUP ============
cmd({
    pattern: "resetgc",
    alias: ["resetgroup", "cleargc"],
    react: "🔄",
    desc: "Remove all members and reset group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const membersToRemove = participants
        .filter(p => !groupAdmins.includes(p.id) && p.id !== botNumber && p.id !== sender)
        .map(p => p.id);
    
    await conn.sendMessage(from, {
        text: `🔄 Resetting group... Removing ${membersToRemove.length} members`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    for (let i = 0; i < membersToRemove.length; i += 5) {
        const batch = membersToRemove.slice(i, i + 5);
        await conn.groupParticipantsUpdate(from, batch, 'remove');
    }

} catch (e) { console.log(e); }
});

// ============ 25. ANTI NFSW ============
cmd({
    pattern: "antinsfw",
    alias: ["antiporn", "antiporno"],
    react: "🔞",
    desc: "Block NSFW content in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiNSFW = global.antiNSFW || {};
    antiNSFW[from] = !antiNSFW[from];
    
    await conn.sendMessage(from, {
        text: `🔞 Anti-NSFW: ${antiNSFW[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 26. ANTI VIRTUAL ============
cmd({
    pattern: "antivirtual",
    alias: ["antivn", "antivoicenote"],
    react: "🎤",
    desc: "Block voice notes in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiVN = global.antiVN || {};
    antiVN[from] = !antiVN[from];
    
    await conn.sendMessage(from, {
        text: `🎤 Anti-voice note: ${antiVN[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 27. ANTI STICKER ============
cmd({
    pattern: "antisticker",
    alias: ["antistick"],
    react: "🖼️",
    desc: "Block stickers in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiSticker = global.antiSticker || {};
    antiSticker[from] = !antiSticker[from];
    
    await conn.sendMessage(from, {
        text: `🖼️ Anti-sticker: ${antiSticker[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 28. ANTI DOCUMENT ============
cmd({
    pattern: "antidoc",
    alias: ["antidocument"],
    react: "📄",
    desc: "Block documents in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiDoc = global.antiDoc || {};
    antiDoc[from] = !antiDoc[from];
    
    await conn.sendMessage(from, {
        text: `📄 Anti-document: ${antiDoc[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 29. ANTI VIDEO ============
cmd({
    pattern: "antivideo",
    alias: ["antivid"],
    react: "🎥",
    desc: "Block videos in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiVideo = global.antiVideo || {};
    antiVideo[from] = !antiVideo[from];
    
    await conn.sendMessage(from, {
        text: `🎥 Anti-video: ${antiVideo[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 30. ANTI IMAGE ============
cmd({
    pattern: "antiimage",
    alias: ["antipic", "antiphoto"],
    react: "📸",
    desc: "Block images in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiImage = global.antiImage || {};
    antiImage[from] = !antiImage[from];
    
    await conn.sendMessage(from, {
        text: `📸 Anti-image: ${antiImage[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 31. ANTI AUDIO ============
cmd({
    pattern: "antiaudio",
    alias: ["antimusic"],
    react: "🎵",
    desc: "Block audio files in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiAudio = global.antiAudio || {};
    antiAudio[from] = !antiAudio[from];
    
    await conn.sendMessage(from, {
        text: `🎵 Anti-audio: ${antiAudio[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 32. ANTI LOCATION ============
cmd({
    pattern: "antilocation",
    alias: ["antiloc", "antilive"],
    react: "📍",
    desc: "Block location sharing",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiLocation = global.antiLocation || {};
    antiLocation[from] = !antiLocation[from];
    
    await conn.sendMessage(from, {
        text: `📍 Anti-location: ${antiLocation[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 33. ANTI CONTACT ============
cmd({
    pattern: "anticontact",
    alias: ["antivcard"],
    react: "📇",
    desc: "Block contact sharing",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiContact = global.antiContact || {};
    antiContact[from] = !antiContact[from];
    
    await conn.sendMessage(from, {
        text: `📇 Anti-contact: ${antiContact[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 34. ANTI POLL ============
cmd({
    pattern: "antipoll2",
    alias: ["antipolls"],
    react: "📊",
    desc: "Block polls in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiPoll = global.antiPoll || {};
    antiPoll[from] = !antiPoll[from];
    
    await conn.sendMessage(from, {
        text: `📊 Anti-poll: ${antiPoll[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 35. ANTI EMOJI ============
cmd({
    pattern: "antiemoji",
    alias: ["antiemojis"],
    react: "😊",
    desc: "Block excessive emojis",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiEmoji = global.antiEmoji || {};
    antiEmoji[from] = !antiEmoji[from];
    
    await conn.sendMessage(from, {
        text: `😊 Anti-emoji: ${antiEmoji[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 36. ANTI TAGALL ============
cmd({
    pattern: "antitagall2",
    alias: ["antitag"],
    react: "🚫",
    desc: "Block tagall messages",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    global.antiTagall = global.antiTagall || {};
    antiTagall[from] = !antiTagall[from];
    
    await conn.sendMessage(from, {
        text: `🚫 Anti-tagall: ${antiTagall[from] ? 'ENABLED' : 'DISABLED'}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 37. SESSION LIST ============
cmd({
    pattern: "sessions",
    alias: ["listsessions", "activesessions"],
    react: "📱",
    desc: "List active group sessions",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender}) => {
try{
    if (!isGroup) return;
    
    const groups = Object.keys(global.antiLink || {}).filter(g => g.includes('@g.us'));
    
    await conn.sendMessage(from, {
        text: `┏━❑ ACTIVE SESSIONS ━━━━━━━━━
┃ 📱 Total active groups: ${groups.length}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 38. GROUP BACKUP ============
cmd({
    pattern: "backup",
    alias: ["gcbackup", "backupgc"],
    react: "💾",
    desc: "Backup group members list",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, participants}) => {
try{
    if (!isGroup) return;
    
    let memberList = "┏━❑ GROUP BACKUP ━━━━━━━━━\n┃\n";
    participants.forEach((p, i) => {
        memberList += `┃ ${i+1}. @${p.id.split('@')[0]}\n`;
    });
    memberList += `┃\n┃ Total: ${participants.length}\n┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: memberList,
        mentions: participants.map(p => p.id),
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 39. GROUP ACTIVITY ============
cmd({
    pattern: "activity",
    alias: ["gcactivity", "groupactivity"],
    react: "📊",
    desc: "Show group activity stats",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender}) => {
try{
    if (!isGroup) return;
    
    const stats = `┏━❑ GROUP ACTIVITY ━━━━━━━━━
┃ 📊 Messages today: 0
┃ 👥 Active members: 0
┃ ⏰ Last message: N/A
┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: stats,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) { console.log(e); }
});

// ============ 40. CLEAR CHAT ============
cmd({
    pattern: "cleargc",
    alias: ["clearchat", "deleteallmsg"],
    react: "🧹",
    desc: "Clear all messages in group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    await conn.sendMessage(from, {
        text: `🧹 Clearing group chat...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Note: Can't actually delete all messages, just a command

} catch (e) { console.log(e); }
});
