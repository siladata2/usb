const { cmd } = require("../command");
const axios = require("axios");

// FakevCard sawa na zilizopita
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
        }
    };
};

const processedMessages = new Set();

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl", "tiktokvideo"],
    desc: "Download TikTok videos without watermark",
    category: "download",
    react: "🎵",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender, args }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return await conn.sendMessage(from, { 
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚃𝚒𝚔𝚃𝚘𝚔 𝚟𝚒𝚍𝚎𝚘 𝚕𝚒𝚗𝚔*\n\n*Example:* .tiktok https://www.tiktok.com/@user/video/123456789\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

      // Extract quality option if provided (hd, nowm, wm, audio)
      let quality = "no_watermark"; // default
      let url = q;
      
      // Check if user specified quality (format: .tiktok hd <url> or .tiktok audio <url>)
      const parts = q.split(' ');
      if (parts.length > 1) {
        const possibleQuality = parts[0].toLowerCase();
        if (possibleQuality === 'hd' || possibleQuality === 'nowm' || 
            possibleQuality === 'wm' || possibleQuality === 'audio') {
          quality = possibleQuality === 'nowm' ? 'no_watermark' : possibleQuality;
          url = parts.slice(1).join(' ');
        }
      }

      // Clean URL - remove any extra spaces
      const tiktokUrl = url.trim();
      
      // Validate URL
      if (!tiktokUrl.includes('tiktok.com')) {
        return await conn.sendMessage(from, { 
          text: "❌ *𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚃𝚒𝚔𝚃𝚘𝚔 𝚄𝚁𝙻*\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚃𝚒𝚔𝚃𝚘𝚔 𝚟𝚒𝚍𝚎𝚘 𝚕𝚒𝚗𝚔.\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // API request
      const apiUrl = `https://api.bk9.dev/download/tiktok3?url=${encodeURIComponent(tiktokUrl)}`;
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.status) {
        return await conn.sendMessage(from, { 
          text: `❌ *𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚟𝚒𝚍𝚎𝚘*\n\n𝚁𝚎𝚊𝚜𝚘𝚗: ${response.data?.message || 'Invalid URL or video not found'}\n\n> © Powered by Sila Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const tiktokData = response.data.BK9;
      
      // Find the requested quality
      let selectedFormat = null;
      let qualityDisplay = "";
      
      switch(quality) {
        case 'hd':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'hd_no_watermark');
          qualityDisplay = "HD (No Watermark)";
          break;
        case 'no_watermark':
        case 'nowm':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'no_watermark');
          qualityDisplay = "No Watermark";
          break;
        case 'wm':
        case 'watermark':
          selectedFormat = tiktokData.formats.find(f => f.quality === 'watermark');
          qualityDisplay = "With Watermark";
          break;
        case 'audio':
          selectedFormat = tiktokData.formats.find(f => f.type === 'audio');
          qualityDisplay = "Audio Only";
          break;
        default:
          selectedFormat = tiktokData.formats[1] || tiktokData.formats[0]; // Default to no watermark
          qualityDisplay = "No Watermark";
      }

      if (!selectedFormat) {
        // Fallback to first available format
        selectedFormat = tiktokData.formats[0];
        qualityDisplay = "Default";
      }

      // Send video info with thumbnail
      const caption = `
🎵 *𝚃𝚒𝚔𝚃𝚘𝚔 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛*

📌 *𝚃𝚒𝚝𝚕𝚎:* ${tiktokData.title || 'N/A'}
👤 *𝙰𝚞𝚝𝚑𝚘𝚛:* ${tiktokData.author || 'N/A'}
⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${tiktokData.duration || 'N/A'}
🎚️ *𝚀𝚞𝚊𝚕𝚒𝚝𝚢:* ${qualityDisplay}

⬇️ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...*

> © Powered by Sila Tech
      `;

      // Send thumbnail
      if (tiktokData.thumbnail) {
        await conn.sendMessage(from, {
          image: { url: tiktokData.thumbnail },
          caption: caption,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      } else {
        await conn.sendMessage(from, { 
          text: caption,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // Send media based on type
      if (selectedFormat.type === 'audio') {
        await conn.sendMessage(from, {
          audio: { url: selectedFormat.url },
          mimetype: "audio/mpeg",
          fileName: `tiktok_audio_${Date.now()}.mp3`,
          caption: `✅ *Audio downloaded successfully*\n\n> © Powered by Sila Tech`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      } else {
        await conn.sendMessage(from, {
          video: { url: selectedFormat.url },
          caption: `✅ *Video downloaded successfully*\n\n🎚️ *Quality:* ${qualityDisplay}\n\n> © Powered by Sila Tech`,
          mimetype: "video/mp4",
          fileName: `tiktok_${Date.now()}.mp4`,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (e) {
      console.error("TikTok Download Error:", e);
      
      let errorMessage = e.message;
      if (e.response?.status === 404) {
        errorMessage = "Video not found. Make sure the URL is correct and the video is public.";
      } else if (e.code === 'ECONNREFUSED') {
        errorMessage = "Connection to API server failed.";
      }

      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${errorMessage}\n\n*Example:* .tiktok https://www.tiktok.com/@user/video/123456789\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);
