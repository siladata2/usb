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
        },
    };
};

// PROMOTE COMMAND (IMEREKEBISHWA)
cmd({
    pattern: "promote",
    alias: ["admin", "makeadmin"],
    react: "👑",
    desc: "Promote a member to admin",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to promote someone\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // TOA CHECK YA BOT ADMIN KWA SASA (TUONE KAMA NDIO ISSUE)
    // if (!isBotAdmins) return await conn.sendMessage(from, {
    //     text: `❌ Bot needs to be admin to promote members\n\n> © Powered by Sila Tech`,
    //     contextInfo: getContextInfo({ sender: sender })
    // }, { quoted: fkontak });
    
    let usersToPromote = [];
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        usersToPromote.push(m.quoted.sender);
    }
    // Check if mentioning someone
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToPromote = m.mentionedJid;
    }
    // Check if providing number in args
    else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToPromote.push(number);
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Please provide a valid number or tag the user\n\nExample: *.promote @user*\nOr reply to user's message with *.promote*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else {
        return await conn.sendMessage(from, {
            text: `❌ Please tag the user or reply to their message\n\nExample: *.promote @user*`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Filter out users who are already admins
    usersToPromote = usersToPromote.filter(user => !groupAdmins.includes(user));
    
    if (usersToPromote.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ Selected user(s) are already admins or invalid`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Promoting ${usersToPromote.length} user(s)...\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Promote each user
    for (let user of usersToPromote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'promote');
            console.log(`Promoted: ${user}`);
        } catch (promoteError) {
            console.log(`Error promoting ${user}:`, promoteError);
            await conn.sendMessage(from, {
                text: `❌ Failed to promote @${user.split('@')[0]}: ${promoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Get usernames for mentioned users
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToPromote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ PROMOTED SUCCESSFULLY ━━━━━━━━━
┃ 👑 *Admin(s):* ${mentionText}
┃ ✅ ${usersToPromote.length} user(s) promoted to admin
┗━━━━━━━━━━━━━━━━━━━━
> © Powered by Sila Tech`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('PROMOTE ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to promote user(s). Error: ${e.message}\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// DEMOTE COMMAND (IMEREKEBISHWA)
cmd({
    pattern: "demote",
    alias: ["removeadmin", "unadmin"],
    react: "⬇️",
    desc: "Demote an admin to regular member",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, participants, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to demote someone\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // TOA CHECK YA BOT ADMIN KWA SASA (TUONE KAMA NDIO ISSUE)
    // if (!isBotAdmins) return await conn.sendMessage(from, {
    //     text: `❌ Bot needs to be admin to demote members\n\n> © Powered by Sila Tech`,
    //     contextInfo: getContextInfo({ sender: sender })
    // }, { quoted: fkontak });
    
    let usersToDemote = [];
    
    // Check if replying to a message
    if (m.quoted && m.quoted.sender) {
        usersToDemote.push(m.quoted.sender);
    }
    // Check if mentioning someone
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        usersToDemote = m.mentionedJid;
    }
    // Check if providing number in args
    else if (m.args && m.args[0]) {
        let input = m.args[0].replace(/[^0-9]/g, '');
        if (input.length >= 10) {
            let number = input + '@s.whatsapp.net';
            usersToDemote.push(number);
        } else {
            return await conn.sendMessage(from, {
                text: `❌ Please provide a valid number or tag the user\n\nExample: *.demote @user*\nOr reply to user's message with *.demote*`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    } else {
        return await conn.sendMessage(from, {
            text: `❌ Please tag the user or reply to their message\n\nExample: *.demote @user*`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Filter out users who are not admins
    usersToDemote = usersToDemote.filter(user => groupAdmins.includes(user));
    
    // Filter out bot from being demoted
    usersToDemote = usersToDemote.filter(user => user !== botNumber);
    
    if (usersToDemote.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ Selected user(s) are not admins or cannot be demoted`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Demoting ${usersToDemote.length} user(s)...\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Demote each user
    for (let user of usersToDemote) {
        try {
            await conn.groupParticipantsUpdate(from, [user], 'demote');
            console.log(`Demoted: ${user}`);
        } catch (demoteError) {
            console.log(`Error demoting ${user}:`, demoteError);
            await conn.sendMessage(from, {
                text: `❌ Failed to demote @${user.split('@')[0]}: ${demoteError.message}`,
                mentions: [user],
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
        }
    }
    
    // Get usernames for mentioned users
    let mentions = [];
    let mentionText = '';
    
    for (let user of usersToDemote) {
        mentions.push(user);
        let username = '@' + user.split('@')[0];
        mentionText += username + ' ';
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ DEMOTED SUCCESSFULLY ━━━━━━━━━
┃ ⬇️ *User(s):* ${mentionText}
┃ ✅ ${usersToDemote.length} user(s) demoted from admin
┗━━━━━━━━━━━━━━━━━━━━
> © Powered by Sila Tech`,
        mentions: mentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('DEMOTE ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to demote user(s). Error: ${e.message}\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});
