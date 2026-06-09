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

// ============ TEST BOT ADMIN COMMAND ============
cmd({
    pattern: "testadmin",
    alias: ["checkadmin", "amadmin", "botadmin"],
    react: "🤖",
    desc: "Check if bot is admin in the group",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, botNumber, participants, groupAdmins, reply}) => {
try{
    if (!isGroup) {
        return await conn.sendMessage(from, {
            text: `❌ This command is only for groups`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Get fresh group metadata to ensure accurate data
    const groupMetadata = await conn.groupMetadata(from);
    const botJid = botNumber + '@s.whatsapp.net';
    
    // Method 1: Check using groupAdmins array from parameters
    const isBotAdmin1 = groupAdmins ? groupAdmins.includes(botJid) : false;
    
    // Method 2: Check using groupMetadata participants
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    const isBotAdmin2 = botParticipant ? botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin' : false;
    
    // Method 3: Check manually by filtering admins
    const allAdmins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    const isBotAdmin3 = allAdmins.some(admin => admin.id === botJid);
    
    // Get all admins list
    let adminList = '';
    let adminMentions = [];
    
    for (let participant of groupMetadata.participants) {
        if (participant.admin === 'admin' || participant.admin === 'superadmin') {
            adminList += `┃ 👑 @${participant.id.split('@')[0]}\n`;
            adminMentions.push(participant.id);
        }
    }
    
    if (adminList === '') {
        adminList = '┃ No admins found\n';
    }
    
    // Prepare response
    let response = `┏━❑ BOT ADMIN CHECK ━━━━━━━━━\n`;
    response += `┃\n`;
    response += `┃ 🤖 *Bot JID:* ${botJid}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *CHECK RESULTS:*\n`;
    response += `┃ Method 1 (groupAdmins): ${isBotAdmin1 ? '✅ YES' : '❌ NO'}\n`;
    response += `┃ Method 2 (participant.admin): ${isBotAdmin2 ? '✅ YES' : '❌ NO'}\n`;
    response += `┃ Method 3 (filter): ${isBotAdmin3 ? '✅ YES' : '❌ NO'}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *FINAL RESULT:* ${(isBotAdmin1 || isBotAdmin2 || isBotAdmin3) ? '✅ BOT IS ADMIN' : '❌ BOT IS NOT ADMIN'}\n`;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *ALL ADMINS:*\n`;
    response += adminList;
    response += `┃\n`;
    response += `┃ ━━━━━━━━━━━━━━━━━━━\n`;
    response += `┃ *Group:* ${groupMetadata.subject}\n`;
    response += `┃ *Total Members:* ${groupMetadata.participants.length}\n`;
    response += `┃ *Total Admins:* ${allAdmins.length}\n`;
    response += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: response,
        mentions: adminMentions,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('TESTADMIN ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to check bot admin status. Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ FIX ISBOTADMIN VARIABLE ============
// Hii command itasaidia kuona kama isBotAdmins inafika vizuri
cmd({
    pattern: "debugadmin",
    alias: ["debugbot", "checkvars"],
    react: "🐛",
    desc: "Debug bot admin variables",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isBotAdmins, groupAdmins, botNumber, participants, reply}) => {
try{
    if (!isGroup) return;
    
    const botJid = botNumber + '@s.whatsapp.net';
    const groupMetadata = await conn.groupMetadata(from);
    
    let debug = `┏━❑ DEBUG INFO ━━━━━━━━━\n`;
    debug += `┃\n`;
    debug += `┃ *VARIABLES:*\n`;
    debug += `┃ isBotAdmins: ${isBotAdmins !== undefined ? isBotAdmins : 'UNDEFINED'}\n`;
    debug += `┃ Type: ${typeof isBotAdmins}\n`;
    debug += `┃\n`;
    debug += `┃ *BOT INFO:*\n`;
    debug += `┃ botNumber: ${botNumber}\n`;
    debug += `┃ botJid: ${botJid}\n`;
    debug += `┃\n`;
    debug += `┃ *GROUP ADMINS:*\n`;
    
    if (groupAdmins && groupAdmins.length > 0) {
        groupAdmins.forEach((admin, i) => {
            debug += `┃ Admin ${i+1}: ${admin}\n`;
        });
        debug += `┃\n`;
        debug += `┃ Bot in groupAdmins: ${groupAdmins.includes(botJid) ? 'YES' : 'NO'}\n`;
    } else {
        debug += `┃ groupAdmins is EMPTY or UNDEFINED\n`;
    }
    
    debug += `┃\n`;
    debug += `┃ *MANUAL CHECK:*\n`;
    
    const botParticipant = groupMetadata.participants.find(p => p.id === botJid);
    debug += `┃ Bot found: ${botParticipant ? 'YES' : 'NO'}\n`;
    if (botParticipant) {
        debug += `┃ Bot admin status: ${botParticipant.admin || 'not admin'}\n`;
    }
    
    debug += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: debug,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    l(e);
}
});

// Command ya kujifanya bot iwe admin (kama inawezekana)
cmd({
    pattern: "makebotadmin",
    alias: ["botadmin"],
    react: "🤖",
    desc: "Make bot admin (if you are group owner)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, isGroup, sender, isCreator, botNumber, reply}) => {
try{
    if (!isGroup) return;
    
    // Check if sender is group owner or super admin
    const groupMetadata = await conn.groupMetadata(from);
    const isOwner = groupMetadata.owner === sender || groupMetadata.owner === sender.split('@')[0];
    
    if (!isOwner && !isCreator) {
        return await conn.sendMessage(from, {
            text: `❌ Only group owner can make bot admin`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const botJid = botNumber + '@s.whatsapp.net';
    
    // Try to make bot admin
    await conn.groupParticipantsUpdate(from, [botJid], 'promote');
    
    await conn.sendMessage(from, {
        text: `✅ Bot has been made admin successfully!`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, {
        text: `❌ Failed to make bot admin. Please do it manually.`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});
