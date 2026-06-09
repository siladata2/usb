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
            newsletterName: '𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============ GINFO COMMAND WITH FIXED isBotAdmin ============
cmd({
    pattern: "ginfo",
    alias: ["groupinfo", "infogroup", "grouppic", "gp"],
    react: "ℹ️",
    desc: "Get detailed group information",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, botNumber, participants, reply}) => {
try{
    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ This command is only for groups`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Get fresh group metadata
    const groupMetadata = await conn.groupMetadata(from);
    const botJid = botNumber + '@s.whatsapp.net';
    
    // ===== FIXED isBotAdmin =====
    // Hii ndio tutakayotumia kwenye commands zingine
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const isBotAdmin = botParticipant ? (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin') : false;
    
    // Get group picture
    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(from, 'image');
    } catch {
        ppUrl = 'https://i.ibb.co/RQ28wpb/default-profile.jpg'; // default image
    }
    
    // Get admins list
    let adminList = '';
    let adminMentions = [];
    let adminCount = 0;
    
    for (let participant of groupMetadata.participants) {
        if (participant.admin === 'admin' || participant.admin === 'superadmin') {
            adminList += `┃ 👑 @${participant.id.split('@')[0]}\n`;
            adminMentions.push(participant.id);
            adminCount++;
        }
    }
    
    if (adminList === '') {
        adminList = '┃ No admins found\n';
    }
    
    // Get group settings
    let groupSettings = '';
    try {
        const groupInviteCode = await conn.groupInviteCode(from);
        groupSettings += `┃ 🔗 Invite: https://chat.whatsapp.com/${groupInviteCode}\n`;
    } catch {
        groupSettings += `┃ 🔗 Invite: Unable to fetch\n`;
    }
    
    // Get member stats
    const totalMembers = groupMetadata.participants.length;
    const totalAdmins = adminCount;
    const totalRegular = totalMembers - totalAdmins;
    
    // Get group creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleString();
    
    // Prepare response
    let response = `┏━❑ GROUP INFORMATION ━━━━━━━━━\n`;
    response += `┃\n`;
    response += `┃ 📌 *Group:* ${groupMetadata.subject}\n`;
    response += `┃ 🆔 *ID:* ${from}\n`;
    response += `┃ 📅 *Created:* ${creationDate}\n`;
    response += `┃ 👥 *Total Members:* ${totalMembers}\n`;
    response += `┃ 👑 *Admins:* ${totalAdmins}\n`;
    response += `┃ 👤 *Regular:* ${totalRegular}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *BOT STATUS:*\n`;
    response += `┃ 🤖 Bot is ${isBotAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}\n`;
    response += `┃ 🔧 Bot can ${isBotAdmin ? '✅ perform all admin actions' : '❌ only perform basic actions'}\n`;
    response += `┃ 📊 isBotAdmin = ${isBotAdmin}\n`; // Hii inaonyesha value halisi
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *ADMIN LIST:*\n`;
    response += adminList;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += groupSettings;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *Group Description:*\n`;
    response += `┃ ${groupMetadata.desc || 'No description'}\n`;
    response += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    // Send with image if available
    await conn.sendMessage(from, {
        image: { url: ppUrl },
        caption: response,
        mentions: adminMentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('GINFO ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to get group info. Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ COMMAND EXAMPLE USING isBotAdmin ============
// Hii inaonyesha jinsi ya kutumia isBotAdmin kwenye command nyingine
cmd({
    pattern: "test",
    alias: ["testbot"],
    react: "🧪",
    desc: "Test command with fixed isBotAdmin",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, sender, botNumber, reply}) => {
try{
    if (!isGroup) return;
    
    // Get fresh metadata every time
    const groupMetadata = await conn.groupMetadata(from);
    const botJid = botNumber + '@s.whatsapp.net';
    
    // ===== FIXED isBotAdmin =====
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const isBotAdmin = botParticipant ? (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin') : false;
    
    if (!isBotAdmin) {
        return await conn.sendMessage(from, {
            text: `❌ Bot is not admin. Cannot perform admin actions.`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    await conn.sendMessage(from, {
        text: `✅ Bot is admin! Ready to perform admin actions.`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    l(e);
}
});
