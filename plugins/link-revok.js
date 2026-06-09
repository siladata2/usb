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

// ============ LINK COMMAND ============
cmd({
    pattern: "link",
    alias: ["grouplink", "invite", "linkgroup"],
    react: "🔗",
    desc: "Get group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, isBotAdmins, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins && !isBotAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const groupMetadata = await conn.groupMetadata(from);
    const response = await conn.groupInviteCode(from);
    const link = `https://chat.whatsapp.com/${response}`;
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP LINK ━━━━━━━━━
┃ 📌 *Group:* ${groupMetadata.subject}
┃ 🔗 *Link:* ${link}
┃ 👥 *Members:* ${groupMetadata.participants.length}
┃ ⏰ *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Failed to get group link`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ REVOKE COMMAND (IMEREKEBISHWA KAMA PROMOTE/DEMOTE) ============
cmd({
    pattern: "revoke",
    alias: ["resetlink", "newlink", "revokelink"],
    react: "🔄",
    desc: "Revoke and reset group invite link",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, isGroup, sender, isAdmins, reply}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to revoke group link`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // TOA CHECK YA BOT ADMIN (SAWA KAMA PROMOTE/DEMOTE)
    // if (!isBotAdmins) return await conn.sendMessage(from, {
    //     text: `❌ Bot needs to be admin to revoke group link`,
    //     contextInfo: getContextInfo({ sender: sender })
    // }, { quoted: fkontak });
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Revoking group link...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Revoke the old link and generate new one
    await conn.groupRevokeInvite(from);
    const newCode = await conn.groupInviteCode(from);
    const newLink = `https://chat.whatsapp.com/${newCode}`;
    
    const groupMetadata = await conn.groupMetadata(from);
    
    await conn.sendMessage(from, {
        text: `┏━❑ LINK REVOKED ━━━━━━━━━
┃ ✅ Group link has been reset successfully
┃ 📌 *Group:* ${groupMetadata.subject}
┃ 🔗 *New Link:* ${newLink}
┃ 👥 *Members:* ${groupMetadata.participants.length}
┃ ⏰ *Created:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log('REVOKE ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to revoke group link. Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});
