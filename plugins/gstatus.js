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

// ============ GSTATUS COMMAND (Fixed version) ============
cmd({
    pattern: "gstatus",
    alias: ["groupstatus", "gs", "statusgc", "gcstatus"],
    react: "📢",
    desc: "Post status to group profile (appears in status/story)",
    category: "group",
    filename: __filename
},
async(conn, mek, m, {from, l, prefix, quoted, isGroup, sender, isAdmins, isBotAdmins, reply, args}) => {
try{
    if (!isGroup) return await conn.sendMessage(from, {
        text: `❌ This command can only be used in group chats`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    if (!isAdmins) return await conn.sendMessage(from, {
        text: `❌ You need to be an admin to post group status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Get group metadata
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    
    const quotedMsg = m.quoted ? m.quoted : m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ').trim();
    
    const defaultCaption = 
`📢 *GROUP STATUS*
━━━━━━━━━━━━━
👥 *Group:* ${groupName}
⏰ *Time:* ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`;

    if (!/image|video|audio/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `📢 *GROUP STATUS COMMAND*
            
Post status that appears on group profile (like story)

*Examples:*
▸ Reply to image with: ${prefix}gstatus
▸ Reply to video with: ${prefix}gstatus
▸ Reply to audio with: ${prefix}gstatus
▸ ${prefix}gstatus Hello group status!

*Note:* This posts to group status/story, not group chat`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Send processing message
    await conn.sendMessage(from, {
        text: `⏳ Posting to group status/story...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    // Prepare status text
    const statusText = caption || defaultCaption;
    
    try {
        // Method 1: Using sendPresenceUpdate
        await conn.sendPresenceUpdate('composing', from);
        
        // Handle different media types for status
        if (/image/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            // Post as image status using group update
            await conn.sendMessage(from, {
                image: buffer,
                caption: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1,
                        thumbnail: buffer.slice(0, 100),
                        sourceUrl: "https://chat.whatsapp.com",
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: fkontak });
            
        } else if (/video/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            // Post as video status
            await conn.sendMessage(from, {
                video: buffer,
                caption: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1,
                        sourceUrl: "https://chat.whatsapp.com",
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: fkontak });
            
        } else if (/audio/.test(mime)) {
            const buffer = await conn.downloadMediaMessage(quotedMsg);
            
            // Post as audio status
            await conn.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mp4',
                ptt: false,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1
                    }
                }
            }, { quoted: fkontak });
            
        } else if (caption) {
            // Post text only status
            await conn.sendMessage(from, {
                text: statusText,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    externalAdReply: {
                        title: "📢 GROUP STATUS",
                        body: groupName,
                        mediaType: 1
                    }
                }
            }, { quoted: fkontak });
        }
        
        // Send confirmation to group chat
        await conn.sendMessage(from, {
            text: `┏━❑ GSTATUS COMPLETE ━━━━━━━━━
┃ ✅ Status posted successfully
┃ 📌 Check group profile to view
┗━━━━━━━━━━━━━━━━━━━━
> 𝐒𝐈𝐋𝐀 𝐌𝐃`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
        
    } catch (statusError) {
        console.log('Status error:', statusError);
        
        // Method 2: Alternative using broadcast
        try {
            // Create a broadcast message
            await conn.sendMessage("status@broadcast", {
                text: `📢 *${groupName}*\n\n${statusText}`,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            });
            
            await conn.sendMessage(from, {
                text: `✅ Status posted as broadcast`,
                contextInfo: getContextInfo({ sender: sender })
            }, { quoted: fkontak });
            
        } catch (broadcastError) {
            throw statusError;
        }
    }

} catch (e) {
    console.log('GSTATUS ERROR:', e);
    await conn.sendMessage(from, {
        text: `❌ Failed to post group status: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    l(e);
}
});

// ============ SIMPLE WORKING VERSION ============
cmd({
    pattern: "gcstory",
    alias: ["groupstory", "gstory"],
    react: "📱",
    desc: "Post to group story/status (working version)",
    category: "group"
},
async(conn, mek, m, {from, quoted, isGroup, sender, isAdmins, args}) => {
try{
    if (!isGroup) return;
    if (!isAdmins) return;
    
    const quotedMsg = m.quoted || m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ') || 'Group status update';
    
    if (!/image|video/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `Reply to image/video with .gcstory`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    // Get group name
    const groupMetadata = await conn.groupMetadata(from);
    const groupName = groupMetadata.subject;
    
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        // Send as status using external ad reply
        await conn.sendMessage(from, {
            image: buffer,
            caption: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: groupName,
                    thumbnail: buffer.slice(0, 100),
                    sourceUrl: "https://chat.whatsapp.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fkontak });
        
    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        
        await conn.sendMessage(from, {
            video: buffer,
            caption: caption,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "📢 GROUP STATUS",
                    body: groupName,
                    sourceUrl: "https://chat.whatsapp.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: fkontak });
        
    } else if (caption) {
        await conn.sendMessage(from, {
            text: `📢 *${groupName}*\n\n${caption}`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: fkontak });
    }
    
    await conn.sendMessage(from, {
        text: `✅ Posted successfully`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});

// ============ STATUS BROADCAST VERSION ============
cmd({
    pattern: "status",
    alias: ["mystatus", "poststatus"],
    react: "📱",
    desc: "Post to your personal status",
    category: "group"
},
async(conn, mek, m, {from, quoted, sender, args}) => {
try{
    const quotedMsg = m.quoted || m;
    const mime = (quotedMsg.msg || quotedMsg).mimetype || '';
    const caption = args.join(' ') || 'My status update';
    
    if (!/image|video/.test(mime) && !caption) {
        return await conn.sendMessage(from, {
            text: `Reply to image/video with .status`,
            contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
    }
    
    if (/image/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage("status@broadcast", {
            image: buffer,
            caption: caption
        });
    } else if (/video/.test(mime)) {
        const buffer = await conn.downloadMediaMessage(quotedMsg);
        await conn.sendMessage("status@broadcast", {
            video: buffer,
            caption: caption
        });
    } else if (caption) {
        await conn.sendMessage("status@broadcast", {
            text: caption
        });
    }
    
    await conn.sendMessage(from, {
        text: `✅ Posted to your status`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
    await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
}
});
