const { cmd } = require("../command");
const fs = require('fs');
const axios = require('axios');

// Fake vCard for quoting
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝙶𝚁𝙾𝚄𝙿"
    }
};

// Helper function for context info
const getContextInfo = (m, sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        }
    };
};

// Store for mute2 settings
let mute2Settings = {};

// ==================== GROUP MENU COMMAND ====================

cmd({
    pattern: "groupmenu2",
    alias: ["gmenu2", "adminmenu2", "groupcmds2"],
    desc: "Show all group admin commands",
    category: "group",
    react: "👥",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
    try {
        if (!isGroup) {
            return reply("❌ *This command can only be used in groups!*");
        }

        const menuText = `╔══════════════════════╗
║    👥 GROUP MENU 2   ║
╚══════════════════════╝

╔══════════════════════╗
║ 1️⃣ *GROUP SETTINGS*   ║
╠══════════════════════╣
║ ▸ .groupopen2        ║
║ ▸ .groupclose2       ║
║ ▸ .grouplock2        ║
║ ▸ .groupunlock2      ║
║ ▸ .gname2 <name>     ║
║ ▸ .gdesc2 <desc>     ║
║ ▸ .gpp2 <image>      ║
╚══════════════════════╝

╔══════════════════════╗
║ 2️⃣ *MEMBER MANAGEMENT*║
╠══════════════════════╣
║ ▸ .add2 255XXXXXXXXX ║
║ ▸ .kick2 @user       ║
║ ▸ .promote2 @user    ║
║ ▸ .demote2 @user     ║
║ ▸ .removeall2        ║
║ ▸ .kickall2          ║
║ ▸ .invite2           ║
╚══════════════════════╝

╔══════════════════════╗
║ 3️⃣ *MUTE/UNMUTE*      ║
╠══════════════════════╣
║ ▸ .mute2             ║
║ ▸ .unmute2           ║
║ ▸ .muteuser2 @user   ║
║ ▸ .unmuteuser2 @user ║
╚══════════════════════╝

╔══════════════════════╗
║ 4️⃣ *GROUP PROTECTION* ║
╠══════════════════════╣
║ ▸ .antilink2 on/off  ║
║ ▸ .antibug2 on/off   ║
║ ▸ .antibot2 on/off   ║
║ ▸ .welcome2 on/off   ║
║ ▸ .goodbye2 on/off   ║
╚══════════════════════╝

╔══════════════════════╗
║ 5️⃣ *GROUP INFO*       ║
╠══════════════════════╣
║ ▸ .ginfo2            ║
║ ▸ .admins2           ║
║ ▸ .owner2            ║
║ ▸ .members2          ║
║ ▸ .request2          ║
║ ▸ .link2             ║
╚══════════════════════╝

╔══════════════════════╗
║ 6️⃣ *GROUP ACTIONS*    ║
╠══════════════════════╣
║ ▸ .tagall2           ║
║ ▸ .hidetag2 <text>   ║
║ ▸ .vote2             ║
║ ▸ .poll2 <question>  ║
║ ▸ .everyone2         ║
╚══════════════════════╝

> © 𝐒𝐈𝐋𝐀 𝐌𝐃 | *Admin Commands Only*
> Bot Admin: ${isBotAdmins ? '✅ Yes' : '❌ No'}`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/36vahk.png' },
            caption: menuText,
            contextInfo: getContextInfo(m, sender)
        }, { quoted: fkontak });

    } catch (e) {
        console.error('Group Menu Error:', e);
        reply('❌ An error occurred while loading group menu.');
    }
});

// ==================== GROUP OPEN/CLOSE ====================

cmd({
    pattern: "groupopen2",
    alias: ["grupbuka2", "gcopen2"],
    desc: "Open group for all members (admin only)",
    category: "group",
    react: "🔓",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'unlocked');
        reply('✅ *Group has been opened (2).*\nAll members can now send messages.');

    } catch (e) {
        console.error('Group Open Error:', e);
        reply('❌ Failed to open group.');
    }
});

cmd({
    pattern: "groupclose2",
    alias: ["gruptutup2", "gcclose2"],
    desc: "Close group (admin only)",
    category: "group",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'locked');
        reply('✅ *Group has been closed (2).*\nOnly admins can send messages.');

    } catch (e) {
        console.error('Group Close Error:', e);
        reply('❌ Failed to close group.');
    }
});

// ==================== GROUP LOCK/UNLOCK ====================

cmd({
    pattern: "grouplock2",
    alias: ["gclock2", "lockgc2"],
    desc: "Lock group settings (admin only)",
    category: "group",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'locked');
        reply('✅ *Group has been locked (2).*\nOnly admins can edit group settings.');

    } catch (e) {
        console.error('Group Lock Error:', e);
        reply('❌ Failed to lock group.');
    }
});

cmd({
    pattern: "groupunlock2",
    alias: ["gcup2", "unlockgc2"],
    desc: "Unlock group settings (admin only)",
    category: "group",
    react: "🔓",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'unlocked');
        reply('✅ *Group has been unlocked (2).*\nAll members can now edit group settings.');

    } catch (e) {
        console.error('Group Unlock Error:', e);
        reply('❌ Failed to unlock group.');
    }
});

// ==================== CHANGE GROUP NAME ====================

cmd({
    pattern: "gname2",
    alias: ["setname2", "groupname2"],
    desc: "Change group name (admin only)",
    category: "group",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");
        if (!q) return reply("❌ *Please provide a new group name!*\nExample: .gname2 SILA MD Family 2");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ *Group name changed to (2):*\n"${q}"`);

    } catch (e) {
        console.error('Group Name Error:', e);
        reply('❌ Failed to change group name.');
    }
});

// ==================== CHANGE GROUP DESCRIPTION ====================

cmd({
    pattern: "gdesc2",
    alias: ["setdesc2", "groupdesc2"],
    desc: "Change group description (admin only)",
    category: "group",
    react: "📄",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");
        if (!q) return reply("❌ *Please provide a new group description!*\nExample: .gdesc2 Welcome to SILA MD 2");

        await conn.groupUpdateDescription(from, q);
        reply(`✅ *Group description changed to (2):*\n"${q}"`);

    } catch (e) {
        console.error('Group Description Error:', e);
        reply('❌ Failed to change group description.');
    }
});

// ==================== CHANGE GROUP PROFILE PICTURE ====================

cmd({
    pattern: "gpp2",
    alias: ["setpp2", "grouppic2"],
    desc: "Change group profile picture (admin only)",
    category: "group",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';

        if (!/image/.test(mime)) {
            return reply("❌ *Please reply to an image!*\nExample: Reply to an image with .gpp2");
        }

        const media = await quoted.download();
        await conn.updateProfilePicture(from, media);
        reply('✅ *Group profile picture updated (2).*');

    } catch (e) {
        console.error('Group PP Error:', e);
        reply('❌ Failed to update group picture.');
    }
});

// ==================== ADD MEMBER ====================

cmd({
    pattern: "add2",
    alias: ["addmember2", "tambah2"],
    desc: "Add member to group (admin only)",
    category: "group",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");
        if (!q) return reply("❌ *Please provide a phone number!*\nExample: .add2 255768978061");

        const number = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(from, [number], 'add');
        reply(`✅ *User added to group (2).*`);

    } catch (e) {
        console.error('Add Member Error:', e);
        reply('❌ Failed to add member. Make sure the number is valid and has WhatsApp.');
    }
});

// ==================== KICK MEMBER ====================

cmd({
    pattern: "kick2",
    alias: ["remove2", "ondoa2"],
    desc: "Kick member from group (admin only)",
    category: "group",
    react: "👢",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Please mention the user to kick!*\nExample: .kick2 @user");
        }

        await conn.groupParticipantsUpdate(from, mentioned, 'remove');
        reply(`✅ *${mentioned.length} user(s) kicked from group (2).*`);

    } catch (e) {
        console.error('Kick Member Error:', e);
        reply('❌ Failed to kick member.');
    }
});

// ==================== PROMOTE MEMBER ====================

cmd({
    pattern: "promote2",
    alias: ["promoteadmin2"],
    desc: "Promote member to admin (admin only)",
    category: "group",
    react: "⬆️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Please mention the user to promote!*\nExample: .promote2 @user");
        }

        await conn.groupParticipantsUpdate(from, mentioned, 'promote');
        reply(`✅ *${mentioned.length} user(s) promoted to admin (2).*`);

    } catch (e) {
        console.error('Promote Error:', e);
        reply('❌ Failed to promote member.');
    }
});

// ==================== DEMOTE MEMBER ====================

cmd({
    pattern: "demote2",
    alias: ["demoteadmin2"],
    desc: "Demote admin to member (admin only)",
    category: "group",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Please mention the admin to demote!*\nExample: .demote2 @admin");
        }

        await conn.groupParticipantsUpdate(from, mentioned, 'demote');
        reply(`✅ *${mentioned.length} admin(s) demoted to members (2).*`);

    } catch (e) {
        console.error('Demote Error:', e);
        reply('❌ Failed to demote admin.');
    }
});

// ==================== REMOVE ALL MEMBERS ====================

cmd({
    pattern: "removeall2",
    alias: ["kickall2", "ondoatemii2"],
    desc: "Remove all non-admin members (admin only)",
    category: "group",
    react: "🗑️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const botJid = conn.user.id;
        
        let kicked = 0;
        for (let participant of participants) {
            if (!participant.admin && participant.id !== botJid) {
                await conn.groupParticipantsUpdate(from, [participant.id], 'remove');
                kicked++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        reply(`✅ *${kicked} members removed from group (2).*`);

    } catch (e) {
        console.error('Remove All Error:', e);
        reply('❌ Failed to remove members.');
    }
});

// ==================== KICK ALL ====================

cmd({
    pattern: "kickall2",
    alias: ["kikatemii2"],
    desc: "Kick all members (admin only)",
    category: "group",
    react: "👢👢",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const botJid = conn.user.id;
        const admins = participants.filter(p => p.admin).map(p => p.id);
        
        let kicked = 0;
        for (let participant of participants) {
            if (!admins.includes(participant.id) && participant.id !== botJid) {
                await conn.groupParticipantsUpdate(from, [participant.id], 'remove');
                kicked++;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        reply(`✅ *${kicked} members kicked from group (2).*`);

    } catch (e) {
        console.error('Kick All Error:', e);
        reply('❌ Failed to kick members.');
    }
});

// ==================== INVITE LINK ====================

cmd({
    pattern: "invite2",
    alias: ["link2", "gclink2"],
    desc: "Get group invite link (admin only)",
    category: "group",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const code = await conn.groupInviteCode(from);
        const link = `https://chat.whatsapp.com/${code}`;
        
        reply(`🔗 *Group Invite Link (2):*\n${link}`);

    } catch (e) {
        console.error('Invite Link Error:', e);
        reply('❌ Failed to get invite link.');
    }
});

// ==================== MUTE GROUP ====================

cmd({
    pattern: "mute2",
    alias: ["senyap2", "muteall2"],
    desc: "Mute group (only admins can chat)",
    category: "group",
    react: "🔇",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'locked');
        mute2Settings[from] = { muted: true, mutedBy: sender, time: Date.now() };
        reply('🔇 *Group has been muted (2).*\nOnly admins can send messages.');

    } catch (e) {
        console.error('Mute Error:', e);
        reply('❌ Failed to mute group.');
    }
});

// ==================== UNMUTE GROUP ====================

cmd({
    pattern: "unmute2",
    alias: ["sauti2", "unmuteall2"],
    desc: "Unmute group (all members can chat)",
    category: "group",
    react: "🔊",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        await conn.groupSettingUpdate(from, 'unlocked');
        if (mute2Settings[from]) delete mute2Settings[from];
        reply('🔊 *Group has been unmuted (2).*\nAll members can send messages.');

    } catch (e) {
        console.error('Unmute Error:', e);
        reply('❌ Failed to unmute group.');
    }
});

// ==================== MUTE USER ====================

let mutedUsers = {};

cmd({
    pattern: "muteuser2",
    alias: ["muteu2", "senyapuser2"],
    desc: "Mute specific user in group",
    category: "group",
    react: "🙊",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Please mention the user to mute!*\nExample: .muteuser2 @user");
        }

        if (!mutedUsers[from]) mutedUsers[from] = [];
        mutedUsers[from].push(...mentioned);

        reply(`🙊 *${mentioned.length} user(s) muted in this group (2).*\nThey won't be able to send messages.`);

    } catch (e) {
        console.error('Mute User Error:', e);
        reply('❌ Failed to mute user.');
    }
});

// ==================== UNMUTE USER ====================

cmd({
    pattern: "unmuteuser2",
    alias: ["unmuteu2", "sautiuser2"],
    desc: "Unmute specific user in group",
    category: "group",
    react: "🙈",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Please mention the user to unmute!*\nExample: .unmuteuser2 @user");
        }

        if (mutedUsers[from]) {
            mutedUsers[from] = mutedUsers[from].filter(id => !mentioned.includes(id));
        }

        reply(`🙈 *${mentioned.length} user(s) unmuted in this group (2).*\nThey can now send messages.`);

    } catch (e) {
        console.error('Unmute User Error:', e);
        reply('❌ Failed to unmute user.');
    }
});

// ==================== ANTI-LINK ====================

let antiLinkSettings = {};

cmd({
    pattern: "antilink2",
    alias: ["antilinkgc2"],
    desc: "Toggle anti-link protection",
    category: "group",
    react: "🔗🚫",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        const action = q.toLowerCase();
        if (action !== 'on' && action !== 'off') {
            return reply("❌ *Usage:* .antilink2 on / .antilink2 off");
        }

        antiLinkSettings[from] = (action === 'on');
        reply(`${action === 'on' ? '✅' : '❌'} *Anti-link turned ${action} (2).*`);

    } catch (e) {
        console.error('Anti-Link Error:', e);
        reply('❌ Failed to toggle anti-link.');
    }
});

// ==================== ANTI-BOT ====================

let antiBotSettings = {};

cmd({
    pattern: "antibot2",
    alias: ["antibotgc2"],
    desc: "Toggle anti-bot protection",
    category: "group",
    react: "🤖🚫",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        const action = q.toLowerCase();
        if (action !== 'on' && action !== 'off') {
            return reply("❌ *Usage:* .antibot2 on / .antibot2 off");
        }

        antiBotSettings[from] = (action === 'on');
        reply(`${action === 'on' ? '✅' : '❌'} *Anti-bot turned ${action} (2).*`);

    } catch (e) {
        console.error('Anti-Bot Error:', e);
        reply('❌ Failed to toggle anti-bot.');
    }
});

// ==================== WELCOME ====================

let welcomeSettings = {};

cmd({
    pattern: "welcome2",
    alias: ["selamatdatang2"],
    desc: "Toggle welcome message",
    category: "group",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        const action = q.toLowerCase();
        if (action !== 'on' && action !== 'off') {
            return reply("❌ *Usage:* .welcome2 on / .welcome2 off");
        }

        welcomeSettings[from] = (action === 'on');
        reply(`${action === 'on' ? '✅' : '❌'} *Welcome message turned ${action} (2).*`);

    } catch (e) {
        console.error('Welcome Error:', e);
        reply('❌ Failed to toggle welcome.');
    }
});

// ==================== GOODBYE ====================

let goodbyeSettings = {};

cmd({
    pattern: "goodbye2",
    alias: ["kwaheri2"],
    desc: "Toggle goodbye message",
    category: "group",
    react: "👋🚪",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        const action = q.toLowerCase();
        if (action !== 'on' && action !== 'off') {
            return reply("❌ *Usage:* .goodbye2 on / .goodbye2 off");
        }

        goodbyeSettings[from] = (action === 'on');
        reply(`${action === 'on' ? '✅' : '❌'} *Goodbye message turned ${action} (2).*`);

    } catch (e) {
        console.error('Goodbye Error:', e);
        reply('❌ Failed to toggle goodbye.');
    }
});

// ==================== GROUP INFO ====================

cmd({
    pattern: "ginfo2",
    alias: ["groupinfo2", "infogc2"],
    desc: "Get group information",
    category: "group",
    react: "ℹ️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const admins = participants.filter(p => p.admin);
        const botJid = conn.user.id;

        const info = `📊 *GROUP INFO 2*
        
*Name:* ${groupMetadata.subject}
*ID:* ${from}
*Created:* ${new Date(groupMetadata.creation * 1000).toLocaleString()}
*Members:* ${participants.length}
*Admins:* ${admins.length}
*Bot Admin:* ${participants.some(p => p.id === botJid && p.admin) ? '✅ Yes' : '❌ No'}
*Description:* ${groupMetadata.desc || 'No description'}`;

        reply(info);

    } catch (e) {
        console.error('Group Info Error:', e);
        reply('❌ Failed to get group info.');
    }
});

// ==================== ADMINS LIST ====================

cmd({
    pattern: "admins2",
    alias: ["adminlist2", "listadmin2"],
    desc: "List all group admins",
    category: "group",
    react: "👮",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");

        const groupMetadata = await conn.groupMetadata(from);
        const admins = groupMetadata.participants.filter(p => p.admin);
        
        let adminList = '*👮 GROUP ADMINS 2*\n\n';
        admins.forEach((admin, i) => {
            const number = admin.id.split('@')[0];
            adminList += `${i + 1}. @${number} (${admin.admin === 'superadmin' ? '👑 Owner' : '👮 Admin'})\n`;
        });

        await conn.sendMessage(from, {
            text: adminList,
            contextInfo: { mentionedJid: admins.map(a => a.id) }
        }, { quoted: m });

    } catch (e) {
        console.error('Admins List Error:', e);
        reply('❌ Failed to get admins list.');
    }
});

// ==================== GROUP OWNER ====================

cmd({
    pattern: "owner2",
    alias: ["groupowner2", "creator2"],
    desc: "Get group owner",
    category: "group",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");

        const groupMetadata = await conn.groupMetadata(from);
        const owner = groupMetadata.owner || groupMetadata.participants.find(p => p.admin === 'superadmin')?.id;

        if (owner) {
            const number = owner.split('@')[0];
            reply(`👑 *Group Owner 2:* @${number}`, { contextInfo: { mentionedJid: [owner] } });
        } else {
            reply('❌ Could not find group owner.');
        }

    } catch (e) {
        console.error('Group Owner Error:', e);
        reply('❌ Failed to get group owner.');
    }
});

// ==================== MEMBERS LIST ====================

cmd({
    pattern: "members2",
    alias: ["memberlist2", "listmember2"],
    desc: "List all group members",
    category: "group",
    react: "👥",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");

        const groupMetadata = await conn.groupMetadata(from);
        const members = groupMetadata.participants;
        
        let memberList = '*👥 GROUP MEMBERS 2*\n\n';
        members.forEach((member, i) => {
            const number = member.id.split('@')[0];
            memberList += `${i + 1}. @${number} ${member.admin ? '(Admin)' : ''}\n`;
        });

        // Send in chunks if too long
        if (memberList.length > 40000) {
            await conn.sendMessage(from, {
                document: Buffer.from(memberList),
                mimetype: 'text/plain',
                fileName: 'members2.txt'
            }, { quoted: m });
        } else {
            await conn.sendMessage(from, {
                text: memberList,
                contextInfo: { mentionedJid: members.map(m => m.id) }
            }, { quoted: m });
        }

    } catch (e) {
        console.error('Members List Error:', e);
        reply('❌ Failed to get members list.');
    }
});

// ==================== JOIN REQUESTS ====================

cmd({
    pattern: "request2",
    alias: ["pending2", "joinreq2"],
    desc: "View pending join requests",
    category: "group",
    react: "📥",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!isBotAdmins) return reply("❌ *Bot needs to be admin to use this command!*");

        const requests = await conn.groupRequestParticipantsList(from);
        
        if (requests.length === 0) {
            return reply('📭 *No pending join requests (2).*');
        }

        let reqList = '*📥 PENDING JOIN REQUESTS 2*\n\n';
        requests.forEach((req, i) => {
            const number = req.jid.split('@')[0];
            reqList += `${i + 1}. @${number} - ${req.request_method}\n`;
        });

        await conn.sendMessage(from, {
            text: reqList,
            contextInfo: { mentionedJid: requests.map(r => r.jid) }
        }, { quoted: m });

    } catch (e) {
        console.error('Join Requests Error:', e);
        reply('❌ Failed to get join requests.');
    }
});

// ==================== TAG ALL ====================

cmd({
    pattern: "tagall2",
    alias: ["mentionsemua2", "everyone2"],
    desc: "Tag all group members",
    category: "group",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply, text }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const mentions = participants.map(p => p.id);
        
        let message = text || '📢 *Attention all members!*';
        message += '\n\n';
        participants.forEach(p => {
            const number = p.id.split('@')[0];
            message += `@${number} `;
        });

        await conn.sendMessage(from, {
            text: message,
            contextInfo: { mentionedJid: mentions }
        }, { quoted: m });

    } catch (e) {
        console.error('Tag All Error:', e);
        reply('❌ Failed to tag all members.');
    }
});

// ==================== HIDE TAG ====================

cmd({
    pattern: "hidetag2",
    alias: ["ht2", "silentmentions2"],
    desc: "Send silent message to all members",
    category: "group",
    react: "🤫",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!q) return reply("❌ *Please provide a message!*\nExample: .hidetag2 Hello everyone");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        const mentions = participants.map(p => p.id);

        await conn.sendMessage(from, {
            text: q,
            contextInfo: { mentionedJid: mentions }
        }, { quoted: m });

    } catch (e) {
        console.error('Hide Tag Error:', e);
        reply('❌ Failed to send hide tag.');
    }
});

// ==================== VOTE ====================

cmd({
    pattern: "vote2",
    alias: ["voting2"],
    desc: "Start a vote",
    category: "group",
    react: "🗳️",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");

        // Simple vote implementation
        const buttons = [
            { buttonId: 'vote_yes', buttonText: { displayText: '✅ Yes' }, type: 1 },
            { buttonId: 'vote_no', buttonText: { displayText: '❌ No' }, type: 1 }
        ];

        await conn.sendMessage(from, {
            text: '🗳️ *VOTE 2*\n\nPlease vote:',
            buttons: buttons,
            footer: 'Click a button to vote'
        }, { quoted: m });

    } catch (e) {
        console.error('Vote Error:', e);
        reply('❌ Failed to start vote.');
    }
});

// ==================== POLL ====================

cmd({
    pattern: "poll2",
    alias: ["polling2"],
    desc: "Create a poll",
    category: "group",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmins, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This command can only be used in groups!*");
        if (!isAdmins) return reply("❌ *This command is for group admins only!*");
        if (!q) return reply("❌ *Please provide a poll question!*\nExample: .poll2 What is your favorite color?");

        const pollMessage = {
            name: q,
            values: ['Option 1', 'Option 2', 'Option 3'],
            multiselect: false,
            selectableCount: 1
        };

        await conn.sendMessage(from, {
            poll: pollMessage
        }, { quoted: m });

    } catch (e) {
        console.error('Poll Error:', e);
        reply('❌ Failed to create poll.');
    }
});

// Export settings for use in index.js
module.exports = {
    antiLinkSettings,
    antiBotSettings,
    welcomeSettings,
    goodbyeSettings,
    mutedUsers,
    mute2Settings
};
