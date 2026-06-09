const { cmd } = require('../command');
const fs = require('fs');

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

// ============ GROUPJID COMMAND ============
cmd({
    pattern: "groupjid",
    alias: ["gcjid", "idgc", "groupid"],
    react: "🆔",
    desc: "Get group JID/ID",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP JID ━━━━━━━━━
┃ 📌 *Group JID:* ${from}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ GCDESC COMMAND ============
cmd({
    pattern: "gcdesc",
    alias: ["groupdesc", "setdesc", "description"],
    react: "📝",
    desc: "Set group description",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide description\n\nExample: .gcdesc Welcome to our group`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const desc = args.join(' ');
    await conn.groupUpdateDescription(from, desc);
    
    await conn.sendMessage(from, {
        text: `┏━❑ DESCRIPTION UPDATED ━━━━━━━━━
┃ ✅ Group description has been set
┃ 📝 *Description:* ${desc}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ GROUPNAME COMMAND ============
cmd({
    pattern: "groupname",
    alias: ["gcname", "setname", "setgcname"],
    react: "📛",
    desc: "Set group name",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide group name\n\nExample: .groupname My Group Name`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const name = args.join(' ');
    await conn.groupUpdateSubject(from, name);
    
    await conn.sendMessage(from, {
        text: `┏━❑ NAME UPDATED ━━━━━━━━━
┃ ✅ Group name has been changed
┃ 📛 *New Name:* ${name}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ DEMOTEALL COMMAND ============
cmd({
    pattern: "demoteall",
    alias: ["removealladmin", "unadminall"],
    react: "⬇️",
    desc: "Demote all admins except bot and owner",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, groupAdmins, botNumber}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const adminsToDemote = groupAdmins.filter(admin => 
        admin !== botNumber && admin !== sender
    );
    
    if (adminsToDemote.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ No other admins to demote`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    await conn.sendMessage(from, {
        text: `⏳ Demoting ${adminsToDemote.length} admin(s)...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    for (let admin of adminsToDemote) {
        await conn.groupParticipantsUpdate(from, [admin], 'demote');
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ DEMOTEALL COMPLETE ━━━━━━━━━
┃ ✅ Demoted ${adminsToDemote.length} admin(s)
┃ 👑 You and bot remain as admins
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ GPP COMMAND ============
cmd({
    pattern: "gpp",
    alias: ["gcpp", "gcpic", "grouppic", "setgpic", "setpp"],
    react: "🖼️",
    desc: "Set group profile picture",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const media = await conn.downloadAndSaveMediaMessage(quoted);
    
    await conn.updateProfilePicture(from, { url: media });
    fs.unlinkSync(media);
    
    await conn.sendMessage(from, {
        text: `┏━❑ GPP UPDATED ━━━━━━━━━
┃ ✅ Group profile picture has been set
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Please reply to an image with .gpp`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ OPENTIME COMMAND ============
cmd({
    pattern: "opentime",
    alias: ["open", "unmute", "open group"],
    react: "🔓",
    desc: "Open group (members can send messages)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.groupSettingUpdate(from, 'not_announcement');
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP OPENED ━━━━━━━━━
┃ 🔓 All members can now send messages
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ CLOSETIME COMMAND ============
cmd({
    pattern: "closetime",
    alias: ["close", "mute", "close group"],
    react: "🔒",
    desc: "Close group (only admins can send messages)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.groupSettingUpdate(from, 'announcement');
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP CLOSED ━━━━━━━━━
┃ 🔒 Only admins can send messages now
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ DISAP-OFF COMMAND ============
cmd({
    pattern: "disap-off",
    alias: ["disappearoff", "disappear-off"],
    react: "⏳",
    desc: "Turn off disappearing messages",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.groupToggleEphemeral(from, 0);
    
    await conn.sendMessage(from, {
        text: `┏━❑ DISAPPEARING MESSAGES OFF ━━━━━━━━━
┃ ✅ Disappearing messages have been disabled
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ APPROVEALL COMMAND ============
cmd({
    pattern: "approveall",
    alias: ["acceptall", "approve-all"],
    react: "✅",
    desc: "Approve all pending join requests",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `✅ No pending join requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let approved = 0;
    for (const request of requests) {
        await conn.groupRequestParticipantsUpdate(from, [request.jid], 'approve');
        approved++;
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ APPROVEALL COMPLETE ━━━━━━━━━
┃ ✅ Approved ${approved} pending requests
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ ADD COMMAND ============
cmd({
    pattern: "add",
    alias: ["addmember", "addparticipant"],
    react: "➕",
    desc: "Add members to group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide numbers\n\nExample: .add 2557xxxxxx 2557xxxxxx`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const numbers = args.map(num => {
        let clean = num.replace(/[^0-9]/g, '');
        return clean + '@s.whatsapp.net';
    });
    
    await conn.groupParticipantsUpdate(from, numbers, 'add');
    
    await conn.sendMessage(from, {
        text: `┏━❑ ADDED SUCCESSFULLY ━━━━━━━━━
┃ ✅ Added ${numbers.length} member(s) to group
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ DISMISSALL COMMAND ============
cmd({
    pattern: "dismissall",
    alias: ["rejectall", "dismiss-all"],
    react: "❌",
    desc: "Reject all pending join requests",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `✅ No pending join requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let rejected = 0;
    for (const request of requests) {
        await conn.groupRequestParticipantsUpdate(from, [request.jid], 'reject');
        rejected++;
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ DISMISSALL COMPLETE ━━━━━━━━━
┃ ✅ Rejected ${rejected} pending requests
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ ACCEPTALL COMMAND ============
cmd({
    pattern: "acceptall",
    alias: ["accept-all"],
    react: "✅",
    desc: "Accept all pending join requests",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `✅ No pending join requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let accepted = 0;
    for (const request of requests) {
        await conn.groupRequestParticipantsUpdate(from, [request.jid], 'approve');
        accepted++;
    }
    
    await conn.sendMessage(from, {
        text: `┏━❑ ACCEPTALL COMPLETE ━━━━━━━━━
┃ ✅ Accepted ${accepted} pending requests
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ REQUESTS COMMAND ============
cmd({
    pattern: "requests",
    alias: ["joinrequests", "pending"],
    react: "📋",
    desc: "View pending join requests",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `✅ No pending join requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    let requestList = "┏━❑ PENDING REQUESTS ━━━━━━━━━\n┃\n";
    
    for (let i = 0; i < requests.length; i++) {
        const req = requests[i];
        requestList += `┃ ${i+1}. @${req.jid.split('@')[0]}\n`;
        if (req.requestMethod) {
            requestList += `┃    Method: ${req.requestMethod}\n`;
        }
    }
    
    requestList += `┃\n┃ Total: ${requests.length}\n┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: requestList,
        mentions: requests.map(r => r.jid),
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ ACCEPT COMMAND ============
cmd({
    pattern: "accept",
    alias: ["approve"],
    react: "✅",
    desc: "Accept a specific join request",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide number or request ID\n\nExample: .accept 2557xxxxxx`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ No pending requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const input = args[0].replace(/[^0-9]/g, '');
    const userJid = input + '@s.whatsapp.net';
    
    const request = requests.find(r => r.jid === userJid);
    
    if (!request) {
        return await conn.sendMessage(from, {
            text: `❌ No pending request from this number`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    await conn.groupRequestParticipantsUpdate(from, [userJid], 'approve');
    
    await conn.sendMessage(from, {
        text: `┏━❑ ACCEPTED ━━━━━━━━━
┃ ✅ Accepted request from @${input}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [userJid],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ REJECT COMMAND ============
cmd({
    pattern: "reject",
    alias: ["dismiss"],
    react: "❌",
    desc: "Reject a specific join request",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide number\n\nExample: .reject 2557xxxxxx`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const requests = await conn.groupRequestParticipantsList(from);
    
    if (!requests || requests.length === 0) {
        return await conn.sendMessage(from, {
            text: `❌ No pending requests`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const input = args[0].replace(/[^0-9]/g, '');
    const userJid = input + '@s.whatsapp.net';
    
    const request = requests.find(r => r.jid === userJid);
    
    if (!request) {
        return await conn.sendMessage(from, {
            text: `❌ No pending request from this number`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    await conn.groupRequestParticipantsUpdate(from, [userJid], 'reject');
    
    await conn.sendMessage(from, {
        text: `┏━❑ REJECTED ━━━━━━━━━
┃ ❌ Rejected request from @${input}
┗━━━━━━━━━━━━━━━━━━━━`,
        mentions: [userJid],
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ END COMMAND ============
cmd({
    pattern: "end",
    alias: ["endgc", "endgroup"],
    react: "⏹️",
    desc: "End/Delete group (admin only)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP ENDED ━━━━━━━━━
┃ ⚠️ This group will be deleted
┃ 👋 Goodbye everyone!
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 3000);

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ OUT COMMAND ============
cmd({
    pattern: "out",
    alias: ["leavegc", "exitgc"],
    react: "👋",
    desc: "Bot leaves the group",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `┏━❑ BOT LEAVING ━━━━━━━━━
┃ 👋 Bot is leaving the group
┃ Thanks for using Sila MD!
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 2000);

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ GCPP COMMAND (Alias for GPP) ============
cmd({
    pattern: "gcpp",
    alias: ["gcpic", "gcphoto"],
    react: "🖼️",
    desc: "Set group profile picture (alias for gpp)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins, quoted}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const media = await conn.downloadAndSaveMediaMessage(quoted);
    
    await conn.updateProfilePicture(from, { url: media });
    fs.unlinkSync(media);
    
    await conn.sendMessage(from, {
        text: `┏━❑ GCPP UPDATED ━━━━━━━━━
┃ ✅ Group profile picture has been set
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Please reply to an image with .gcpp`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ DELETE COMMAND ============
cmd({
    pattern: "delete",
    alias: ["del", "removegc"],
    react: "🗑️",
    desc: "Delete group (admin only)",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to use this command`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    await conn.sendMessage(from, {
        text: `┏━❑ GROUP DELETED ━━━━━━━━━
┃ ⚠️ This group will be deleted
┃ 👋 Goodbye everyone!
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    setTimeout(async () => {
        await conn.groupLeave(from);
    }, 3000);

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// ============ VOTE COMMAND ============
cmd({
    pattern: "vote",
    alias: ["poll", "voting"],
    react: "📊",
    desc: "Create a vote/poll",
    category: "group"
},
async(conn, mek, m, {from, isGroup, sender, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command is only for groups`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!args[0]) return await conn.sendMessage(from, {
        text: `❌ Please provide vote question and options\n\nExample: .vote "Best color?" Red Blue Green`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const input = args.join(' ');
    const match = input.match(/(?:"([^"]*)")?\s*(.+)/);
    
    let question, options;
    
    if (match[1]) {
        question = match[1];
        options = match[2] ? match[2].split(/\s+/) : [];
    } else {
        question = "Vote";
        options = input.split(/\s+/);
    }
    
    if (options.length < 2) {
        return await conn.sendMessage(from, {
            text: `❌ Please provide at least 2 options`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const pollOptions = options.map(opt => ({
        name: opt,
        voters: []
    }));
    
    // Store vote in memory (you might want to use database)
    global.votes = global.votes || {};
    global.votes[from] = {
        question,
        options: pollOptions,
        creator: sender,
        active: true,
        voters: []
    };
    
    let voteText = `┏━❑ VOTE ━━━━━━━━━\n`;
    voteText += `┃ 📊 *${question}*\n┃\n`;
    
    for (let i = 0; i < pollOptions.length; i++) {
        voteText += `┃ ${i+1}. ${pollOptions[i].name} (0 votes)\n`;
    }
    
    voteText += `┃\n┃ To vote: .vote 1, .vote 2, etc.\n`;
    voteText += `┃ To end: .vote end\n┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: voteText,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    console.log(e);
}
});

// Vote command with number selection
cmd({
    pattern: "vote \\d+",
    fromMe: false,
    dontAddCommandList: true
},
async(conn, mek, m, {from, isGroup, sender, args}) => {
try{
    if (!isGroup) return;
    
    const voteNumber = parseInt(args[0]) - 1;
    
    if (!global.votes || !global.votes[from] || !global.votes[from].active) {
        return await conn.sendMessage(from, {
            text: `❌ No active vote in this group`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const vote = global.votes[from];
    
    if (voteNumber < 0 || voteNumber >= vote.options.length) {
        return await conn.sendMessage(from, {
            text: `❌ Invalid option. Choose 1-${vote.options.length}`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Check if already voted
    if (vote.voters.includes(sender)) {
        return await conn.sendMessage(from, {
            text: `❌ You have already voted`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Add vote
    vote.options[voteNumber].voters.push(sender);
    vote.voters.push(sender);
    
    await conn.sendMessage(from, {
        text: `✅ Vote recorded for option ${args[0]}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});

// Vote end command
cmd({
    pattern: "vote end",
    fromMe: false,
    dontAddCommandList: true
},
async(conn, mek, m, {from, isGroup, sender, isAdmins}) => {
try{
    if (!isGroup) return;
    
    if (!global.votes || !global.votes[from] || !global.votes[from].active) {
        return await conn.sendMessage(from, {
            text: `❌ No active vote in this group`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    const vote = global.votes[from];
    
    if (vote.creator !== sender && !isAdmins) {
        return await conn.sendMessage(from, {
            text: `❌ Only the vote creator or admin can end the vote`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    vote.active = false;
    
    let resultText = `┏━❑ VOTE RESULTS ━━━━━━━━━\n`;
    resultText += `┃ 📊 *${vote.question}*\n┃\n`;
    resultText += `┃ Total voters: ${vote.voters.length}\n┃\n`;
    
    for (let i = 0; i < vote.options.length; i++) {
        const opt = vote.options[i];
        const percentage = vote.voters.length ? Math.round((opt.voters.length / vote.voters.length) * 100) : 0;
        resultText += `┃ ${i+1}. ${opt.name}: ${opt.voters.length} votes (${percentage}%)\n`;
    }
    
    resultText += `┗━━━━━━━━━━━━━━━━━━━━`;
    
    await conn.sendMessage(from, {
        text: resultText,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});
