const { cmd } = require("../command");
const fs = require('fs');

// Owner numbers (should match your index.js)
const ownerNumbers = ['255768978061', '255789661031'];
const sudoNumbers = ['255732297194']; // Add sudo users here

// Security settings file path
const securityFile = './security.json';

// Load security settings
function loadSecurity() {
  try {
    if (fs.existsSync(securityFile)) {
      return JSON.parse(fs.readFileSync(securityFile));
    }
  } catch (e) {
    console.error('Error loading security:', e);
  }
  return {
    antiMedia: {
      enabled: false,
      deleteSilently: true,
      mediaTypes: {
        image: true,
        video: true,
        audio: true,
        document: true,
        sticker: true,
        gif: true
      },
      allowedGroups: []
    },
    antiTag: {
      enabled: false,
      maxMentions: 5,
      action: 'warn',
      warnCount: 3
    },
    antiBug: {
      enabled: true,
      blockBugMessages: true,
      logBugs: true
    },
    antiSpam: {
      enabled: false,
      maxMessages: 5,
      timeWindow: 5000,
      action: 'warn',
      warnCount: 3,
      userMessages: {}
    },
    antiBan: {
      enabled: true,
      protectOwner: true,
      protectAdmins: true,
      protectBot: true,
      blockDeleteGroup: true,
      blockPromoteDemote: true
    }
  };
}

// Save security settings
function saveSecurity(data) {
  try {
    // Convert Map to Object for antiSpam.userMessages
    if (data.antiSpam.userMessages instanceof Map) {
      data.antiSpam.userMessages = Object.fromEntries(data.antiSpam.userMessages);
    }
    fs.writeFileSync(securityFile, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error saving security:', e);
    return false;
  }
}

// Check if user is owner or sudo
function isAuthorized(senderNumber) {
  return ownerNumbers.includes(senderNumber) || sudoNumbers.includes(senderNumber);
}

// ==================== ANTI-MEDIA COMMANDS ====================

cmd({
  pattern: "antimedia",
  alias: ["antim", "amedia"],
  desc: "Manage anti-media settings",
  category: "security",
  react: "🛡️",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    // Check authorization
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    const args = q.toLowerCase().split(' ');
    const subCmd = args[0];

    if (!subCmd) {
      let status = security.antiMedia.enabled ? '✅ ENABLED' : '❌ DISABLED';
      let mediaStatus = '';
      for (let [type, enabled] of Object.entries(security.antiMedia.mediaTypes)) {
        mediaStatus += `\n   ${enabled ? '✅' : '❌'} ${type}`;
      }
      return reply(`🛡️ *ANTI-MEDIA SETTINGS*
      
Status: ${status}
Delete Silently: ${security.antiMedia.deleteSilently ? '✅ Yes' : '❌ No'}

*Media Types:*
${mediaStatus}

*Commands:*
.antimedia on/off
.antimedia silent true/false
.antimedia type <image/video/audio/document/sticker/gif>
.antimedia allow @group/remove
.antimedia list

> © Sila MD Security`);
    }

    // ANTI-MEDIA ON/OFF
    if (subCmd === 'on' || subCmd === 'off') {
      security.antiMedia.enabled = (subCmd === 'on');
      if (saveSecurity(security)) {
        reply(`✅ Anti-Media has been ${subCmd === 'on' ? 'enabled' : 'disabled'}.`);
      } else {
        reply('❌ Failed to save settings.');
      }
      return;
    }

    // ANTI-MEDIA SILENT MODE
    if (subCmd === 'silent') {
      const value = args[1];
      if (value === 'true' || value === 'false') {
        security.antiMedia.deleteSilently = (value === 'true');
        if (saveSecurity(security)) {
          reply(`✅ Silent mode set to ${value}.`);
        } else {
          reply('❌ Failed to save settings.');
        }
      } else {
        reply('❌ Use: .antimedia silent true/false');
      }
      return;
    }

    // ANTI-MEDIA TYPE CONFIGURATION
    if (subCmd === 'type') {
      const mediaType = args[1];
      const action = args[2];
      
      if (!mediaType || !action) {
        return reply('❌ Use: .antimedia type <image/video/audio/document/sticker/gif> on/off');
      }

      if (!security.antiMedia.mediaTypes.hasOwnProperty(mediaType)) {
        return reply('❌ Invalid media type. Use: image, video, audio, document, sticker, gif');
      }

      if (action !== 'on' && action !== 'off') {
        return reply('❌ Use on or off');
      }

      security.antiMedia.mediaTypes[mediaType] = (action === 'on');
      if (saveSecurity(security)) {
        reply(`✅ ${mediaType} blocking turned ${action}.`);
      } else {
        reply('❌ Failed to save settings.');
      }
      return;
    }

    // ANTI-MEDIA ALLOW GROUP
    if (subCmd === 'allow') {
      const groupAction = args[1];
      const groupJid = args[2] || from;

      if (!groupAction || (groupAction !== 'add' && groupAction !== 'remove')) {
        return reply('❌ Use: .antimedia allow add/remove @group');
      }

      if (groupAction === 'add') {
        if (!security.antiMedia.allowedGroups.includes(groupJid)) {
          security.antiMedia.allowedGroups.push(groupJid);
          reply(`✅ Group added to allowed list.`);
        } else {
          reply('❌ Group already in allowed list.');
        }
      } else {
        security.antiMedia.allowedGroups = security.antiMedia.allowedGroups.filter(g => g !== groupJid);
        reply(`✅ Group removed from allowed list.`);
      }
      saveSecurity(security);
      return;
    }

    // ANTI-MEDIA LIST
    if (subCmd === 'list') {
      let list = '*Allowed Groups:*\n';
      if (security.antiMedia.allowedGroups.length === 0) {
        list += 'No groups allowed.';
      } else {
        security.antiMedia.allowedGroups.forEach(g => {
          list += `- ${g}\n`;
        });
      }
      reply(list);
      return;
    }

  } catch (e) {
    console.error('Anti-Media Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== ANTI-TAG COMMANDS ====================

cmd({
  pattern: "antitag",
  alias: ["antimentions", "atag"],
  desc: "Manage anti-tag settings",
  category: "security",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    const args = q.toLowerCase().split(' ');
    const subCmd = args[0];

    if (!subCmd) {
      return reply(`🛡️ *ANTI-TAG SETTINGS*
      
Status: ${security.antiTag.enabled ? '✅ ENABLED' : '❌ DISABLED'}
Max Mentions: ${security.antiTag.maxMentions}
Action: ${security.antiTag.action}
Warn Count: ${security.antiTag.warnCount}

*Commands:*
.antitag on/off
.antitag max <number>
.antitag action <warn/delete/kick>
.antitag warncount <number>

> © Sila MD Security`);
    }

    if (subCmd === 'on' || subCmd === 'off') {
      security.antiTag.enabled = (subCmd === 'on');
      if (saveSecurity(security)) {
        reply(`✅ Anti-Tag ${subCmd === 'on' ? 'enabled' : 'disabled'}.`);
      }
      return;
    }

    if (subCmd === 'max') {
      const max = parseInt(args[1]);
      if (isNaN(max) || max < 1) {
        return reply('❌ Please provide a valid number (minimum 1).');
      }
      security.antiTag.maxMentions = max;
      if (saveSecurity(security)) {
        reply(`✅ Max mentions set to ${max}.`);
      }
      return;
    }

    if (subCmd === 'action') {
      const action = args[1];
      if (!['warn', 'delete', 'kick'].includes(action)) {
        return reply('❌ Action must be: warn, delete, or kick');
      }
      security.antiTag.action = action;
      if (saveSecurity(security)) {
        reply(`✅ Anti-Tag action set to ${action}.`);
      }
      return;
    }

    if (subCmd === 'warncount') {
      const count = parseInt(args[1]);
      if (isNaN(count) || count < 1) {
        return reply('❌ Please provide a valid number (minimum 1).');
      }
      security.antiTag.warnCount = count;
      if (saveSecurity(security)) {
        reply(`✅ Warn count set to ${count}.`);
      }
      return;
    }

  } catch (e) {
    console.error('Anti-Tag Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== ANTI-SPAM COMMANDS ====================

cmd({
  pattern: "antispam",
  alias: ["aspam"],
  desc: "Manage anti-spam settings",
  category: "security",
  react: "🔄",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    const args = q.toLowerCase().split(' ');
    const subCmd = args[0];

    if (!subCmd) {
      return reply(`🛡️ *ANTI-SPAM SETTINGS*
      
Status: ${security.antiSpam.enabled ? '✅ ENABLED' : '❌ DISABLED'}
Max Messages: ${security.antiSpam.maxMessages}
Time Window: ${security.antiSpam.timeWindow / 1000}s
Action: ${security.antiSpam.action}
Warn Count: ${security.antiSpam.warnCount}

*Commands:*
.antispam on/off
.antispam max <number> <seconds>
.antispam action <warn/mute/kick>
.antispam warncount <number>
.antispam reset

> © Sila MD Security`);
    }

    if (subCmd === 'on' || subCmd === 'off') {
      security.antiSpam.enabled = (subCmd === 'on');
      if (saveSecurity(security)) {
        reply(`✅ Anti-Spam ${subCmd === 'on' ? 'enabled' : 'disabled'}.`);
      }
      return;
    }

    if (subCmd === 'max') {
      const max = parseInt(args[1]);
      const seconds = parseInt(args[2]) || 5;
      if (isNaN(max) || max < 1) {
        return reply('❌ Please provide a valid max messages (minimum 1).');
      }
      security.antiSpam.maxMessages = max;
      security.antiSpam.timeWindow = seconds * 1000;
      if (saveSecurity(security)) {
        reply(`✅ Max ${max} messages per ${seconds} seconds.`);
      }
      return;
    }

    if (subCmd === 'action') {
      const action = args[1];
      if (!['warn', 'mute', 'kick'].includes(action)) {
        return reply('❌ Action must be: warn, mute, or kick');
      }
      security.antiSpam.action = action;
      if (saveSecurity(security)) {
        reply(`✅ Anti-Spam action set to ${action}.`);
      }
      return;
    }

    if (subCmd === 'warncount') {
      const count = parseInt(args[1]);
      if (isNaN(count) || count < 1) {
        return reply('❌ Please provide a valid number (minimum 1).');
      }
      security.antiSpam.warnCount = count;
      if (saveSecurity(security)) {
        reply(`✅ Warn count set to ${count}.`);
      }
      return;
    }

    if (subCmd === 'reset') {
      security.antiSpam.userMessages = {};
      if (saveSecurity(security)) {
        reply('✅ Anti-Spam user data has been reset.');
      }
      return;
    }

  } catch (e) {
    console.error('Anti-Spam Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== ANTI-BUG COMMANDS ====================

cmd({
  pattern: "antibug",
  alias: ["abug"],
  desc: "Manage anti-bug settings",
  category: "security",
  react: "🐛",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    const args = q.toLowerCase().split(' ');
    const subCmd = args[0];

    if (!subCmd) {
      return reply(`🛡️ *ANTI-BUG SETTINGS*
      
Status: ${security.antiBug.enabled ? '✅ ENABLED' : '❌ DISABLED'}
Block Bug Messages: ${security.antiBug.blockBugMessages ? '✅ Yes' : '❌ No'}
Log Bugs: ${security.antiBug.logBugs ? '✅ Yes' : '❌ No'}

*Commands:*
.antibug on/off
.antibug block on/off
.antibug log on/off

> © Sila MD Security`);
    }

    if (subCmd === 'on' || subCmd === 'off') {
      security.antiBug.enabled = (subCmd === 'on');
      if (saveSecurity(security)) {
        reply(`✅ Anti-Bug ${subCmd === 'on' ? 'enabled' : 'disabled'}.`);
      }
      return;
    }

    if (subCmd === 'block') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBug.blockBugMessages = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Block bug messages turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antibug block on/off');
      }
      return;
    }

    if (subCmd === 'log') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBug.logBugs = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Log bugs turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antibug log on/off');
      }
      return;
    }

  } catch (e) {
    console.error('Anti-Bug Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== ANTI-BAN COMMANDS ====================

cmd({
  pattern: "antiban",
  alias: ["aban"],
  desc: "Manage anti-ban settings",
  category: "security",
  react: "🛡️",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    const args = q.toLowerCase().split(' ');
    const subCmd = args[0];

    if (!subCmd) {
      return reply(`🛡️ *ANTI-BAN SETTINGS*
      
Status: ${security.antiBan.enabled ? '✅ ENABLED' : '❌ DISABLED'}
Protect Owner: ${security.antiBan.protectOwner ? '✅ Yes' : '❌ No'}
Protect Admins: ${security.antiBan.protectAdmins ? '✅ Yes' : '❌ No'}
Protect Bot: ${security.antiBan.protectBot ? '✅ Yes' : '❌ No'}
Block Delete Group: ${security.antiBan.blockDeleteGroup ? '✅ Yes' : '❌ No'}
Block Promote/Demote: ${security.antiBan.blockPromoteDemote ? '✅ Yes' : '❌ No'}

*Commands:*
.antiban on/off
.antiban owner on/off
.antiban admins on/off
.antiban bot on/off
.antiban deletegroup on/off
.antiban promotedemote on/off

> © Sila MD Security`);
    }

    if (subCmd === 'on' || subCmd === 'off') {
      security.antiBan.enabled = (subCmd === 'on');
      if (saveSecurity(security)) {
        reply(`✅ Anti-Ban ${subCmd === 'on' ? 'enabled' : 'disabled'}.`);
      }
      return;
    }

    if (subCmd === 'owner') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBan.protectOwner = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Protect owner turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antiban owner on/off');
      }
      return;
    }

    if (subCmd === 'admins') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBan.protectAdmins = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Protect admins turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antiban admins on/off');
      }
      return;
    }

    if (subCmd === 'bot') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBan.protectBot = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Protect bot turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antiban bot on/off');
      }
      return;
    }

    if (subCmd === 'deletegroup') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBan.blockDeleteGroup = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Block delete group turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antiban deletegroup on/off');
      }
      return;
    }

    if (subCmd === 'promotedemote') {
      const value = args[1];
      if (value === 'on' || value === 'off') {
        security.antiBan.blockPromoteDemote = (value === 'on');
        if (saveSecurity(security)) {
          reply(`✅ Block promote/demote turned ${value}.`);
        }
      } else {
        reply('❌ Use: .antiban promotedemote on/off');
      }
      return;
    }

  } catch (e) {
    console.error('Anti-Ban Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== SECURITY STATUS COMMAND ====================

cmd({
  pattern: "security",
  alias: ["secstatus", "secconfig"],
  desc: "View all security settings",
  category: "security",
  react: "📊",
  filename: __filename
}, async (conn, mek, m, { from, sender, senderNumber, reply, isOwner }) => {
  try {
    if (!isAuthorized(senderNumber) && !isOwner) {
      return reply("❌ *This command is only for Owner and Sudo users!*");
    }

    const security = loadSecurity();
    
    const status = `╔══════════════════════╗
║   SECURITY STATUS    ║
╚══════════════════════╝

╔══════════════════════╗
║ 1️⃣ *ANTI-MEDIA*       ║
╠══════════════════════╣
║ Status: ${security.antiMedia.enabled ? '✅ ACTIVE' : '❌ INACTIVE'}
║ Silent: ${security.antiMedia.deleteSilently ? '✅ Yes' : '❌ No'}
║ Image: ${security.antiMedia.mediaTypes.image ? '✅' : '❌'}
║ Video: ${security.antiMedia.mediaTypes.video ? '✅' : '❌'}
║ Audio: ${security.antiMedia.mediaTypes.audio ? '✅' : '❌'}
║ Document: ${security.antiMedia.mediaTypes.document ? '✅' : '❌'}
║ Sticker: ${security.antiMedia.mediaTypes.sticker ? '✅' : '❌'}
║ GIF: ${security.antiMedia.mediaTypes.gif ? '✅' : '❌'}
╚══════════════════════╝

╔══════════════════════╗
║ 2️⃣ *ANTI-TAG*         ║
╠══════════════════════╣
║ Status: ${security.antiTag.enabled ? '✅ ACTIVE' : '❌ INACTIVE'}
║ Max Mentions: ${security.antiTag.maxMentions}
║ Action: ${security.antiTag.action}
║ Warn Count: ${security.antiTag.warnCount}
╚══════════════════════╝

╔══════════════════════╗
║ 3️⃣ *ANTI-SPAM*        ║
╠══════════════════════╣
║ Status: ${security.antiSpam.enabled ? '✅ ACTIVE' : '❌ INACTIVE'}
║ Max Msgs: ${security.antiSpam.maxMessages}
║ Time: ${security.antiSpam.timeWindow / 1000}s
║ Action: ${security.antiSpam.action}
║ Warn Count: ${security.antiSpam.warnCount}
╚══════════════════════╝

╔══════════════════════╗
║ 4️⃣ *ANTI-BUG*         ║
╠══════════════════════╣
║ Status: ${security.antiBug.enabled ? '✅ ACTIVE' : '❌ INACTIVE'}
║ Block: ${security.antiBug.blockBugMessages ? '✅ Yes' : '❌ No'}
║ Log: ${security.antiBug.logBugs ? '✅ Yes' : '❌ No'}
╚══════════════════════╝

╔══════════════════════╗
║ 5️⃣ *ANTI-BAN*         ║
╠══════════════════════╣
║ Status: ${security.antiBan.enabled ? '✅ ACTIVE' : '❌ INACTIVE'}
║ Protect Owner: ${security.antiBan.protectOwner ? '✅ Yes' : '❌ No'}
║ Protect Admins: ${security.antiBan.protectAdmins ? '✅ Yes' : '❌ No'}
║ Protect Bot: ${security.antiBan.protectBot ? '✅ Yes' : '❌ No'}
║ Block Delete Group: ${security.antiBan.blockDeleteGroup ? '✅ Yes' : '❌ No'}
║ Block Promote: ${security.antiBan.blockPromoteDemote ? '✅ Yes' : '❌ No'}
╚══════════════════════╝

*Allowed Groups (Anti-Media):*
${security.antiMedia.allowedGroups.length > 0 ? security.antiMedia.allowedGroups.map(g => `- ${g}`).join('\n') : 'None'}

> © Sila MD Security`;

    reply(status);

  } catch (e) {
    console.error('Security Status Error:', e);
    reply('❌ An error occurred.');
  }
});

// ==================== SUDO MANAGEMENT ====================

cmd({
  pattern: "sudo2",
  alias: ["addsudo2", "removesudo2"],
  desc: "Manage sudo users",
  category: "owner",
  react: "👑",
  filename: __filename
}, async (conn, mek, m, { from, q, sender, senderNumber, reply, isOwner }) => {
  try {
    // Only owner can manage sudo
    if (!ownerNumbers.includes(senderNumber)) {
      return reply("❌ *Only the main owner can manage sudo users!*");
    }

    const args = q.toLowerCase().split(' ');
    const action = args[0];
    const user = args[1]?.replace(/[^0-9]/g, '');

    if (!action || !user) {
      return reply(`👑 *SUDO MANAGEMENT*
      
Current Sudo: ${sudoNumbers.join(', ') || 'None'}

*Commands:*
.sudo add 255XXXXXXXXX
.sudo remove 255XXXXXXXXX
.sudo list

> © Sila MD Security`);
    }

    if (action === 'list') {
      return reply(`👑 *SUDO USERS*\n\n${sudoNumbers.join('\n') || 'None'}`);
    }

    if (action === 'add') {
      if (sudoNumbers.includes(user)) {
        return reply('❌ User is already a sudo.');
      }
      sudoNumbers.push(user);
      reply(`✅ ${user} has been added to sudo list.`);
      return;
    }

    if (action === 'remove') {
      const index = sudoNumbers.indexOf(user);
      if (index === -1) {
        return reply('❌ User is not in sudo list.');
      }
      sudoNumbers.splice(index, 1);
      reply(`✅ ${user} has been removed from sudo list.`);
      return;
    }

  } catch (e) {
    console.error('Sudo Error:', e);
    reply('❌ An error occurred.');
  }
});
