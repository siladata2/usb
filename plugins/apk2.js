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
    pattern: "apk",
    alias: ["app", "downloadapk", "androidapp", "gtechapk"],
    desc: "Search and download APK files",
    category: "download",
    react: "📱",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, sender }) => {
    try {
      if (processedMessages.has(m.key.id)) return;
      processedMessages.add(m.key.id);
      setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

      if (!q) {
        return await conn.sendMessage(from, { 
          text: "👉 *𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊𝚗 𝚊𝚙𝚙 𝚗𝚊𝚖𝚎 𝚝𝚘 𝚜𝚎𝚊𝚛𝚌𝚑*\n\n*Example:* .apk whatsapp\n*Example:* .apk instagram\n*Example:* .apk capcut\n\n> © Powered by Sila Tech", 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      await conn.sendMessage(from, { react: { text: "🔍", key: m.key } });

      // Search for apps using G-Tech API
      const searchQuery = q.trim();
      const apiUrl = `https://gtech-api-xtp1.onrender.com/api/androidapk?query=${encodeURIComponent(searchQuery)}&apikey=APIKEY`;
      
      const response = await axios.get(apiUrl);
      
      if (!response.data || !response.data.status) {
        return await conn.sendMessage(from, { 
          text: `❌ *𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚜𝚎𝚊𝚛𝚌𝚑 𝚊𝚙𝚙𝚜*\n\n𝚁𝚎𝚊𝚜𝚘𝚗: ${response.data?.message || 'No results found'}\n\n> © Powered by Sila Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      const searchResults = response.data.result.data;
      
      if (!searchResults || searchResults.length === 0) {
        return await conn.sendMessage(from, { 
          text: `❌ *𝙽𝚘 𝚊𝚙𝚙𝚜 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛* "${searchQuery}"\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚜𝚎𝚊𝚛𝚌𝚑 𝚝𝚎𝚛𝚖.\n\n> © Powered by Sila Tech`, 
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // If multiple results found, show selection menu
      if (searchResults.length > 1) {
        let menuText = `🔍 *𝚂𝚎𝚊𝚛𝚌𝚑 𝚁𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚛* "${searchQuery}"\n\n`;
        
        searchResults.slice(0, 5).forEach((app, index) => {
          menuText += `*${index + 1}.* ${app.judul}\n`;
          menuText += `   👤 ${app.dev || 'Unknown'}\n`;
          menuText += `   ⭐ ${app.rating || 'N/A'}\n`;
          menuText += `   🔗 Reply with *${index + 1}* to select\n\n`;
        });
        
        menuText += `> © Powered by Sila Tech`;

        // Store results temporarily for selection
        global.apkSearchResults = global.apkSearchResults || {};
        global.apkSearchResults[sender] = {
          results: searchResults,
          timestamp: Date.now()
        };

        return await conn.sendMessage(from, {
          image: { url: searchResults[0].thumb || 'https://i.imgur.com/placeholder.png' },
          caption: menuText,
          contextInfo: getContextInfo({ sender: sender })
        }, { quoted: fkontak });
      }

      // If only one result, download directly
      await downloadAndSendApp(conn, from, sender, m, searchResults[0]);

    } catch (e) {
      console.error("APK Search Error:", e);
      
      await conn.sendMessage(from, { 
        text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${e.message}\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.\n\n> © Powered by Sila Tech`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }
  }
);

// Helper function to download and send app
async function downloadAndSendApp(conn, from, sender, m, appData) {
  try {
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // Get download URL from the app page
    const downloadApiUrl = `https://gtech-api-xtp1.onrender.com/api/apkdata?url=${encodeURIComponent(appData.link)}&apikey=APIKEY`;
    
    const downloadResponse = await axios.get(downloadApiUrl);
    
    if (!downloadResponse.data || !downloadResponse.data.status) {
      throw new Error('Could not fetch download link');
    }

    const downloadData = downloadResponse.data.result;
    const downloadUrl = downloadData.download || downloadData.url || appData.link;

    // Prepare app info
    const appInfo = `
📱 *𝙰𝙿𝙺 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛*

*𝙰𝚙𝚙:* ${appData.judul}
*𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛:* ${appData.dev || 'Unknown'}
*𝚁𝚊𝚝𝚒𝚗𝚐:* ⭐ ${appData.rating || 'N/A'}
*𝚂𝚒𝚣𝚎:* ${downloadData.size || 'Unknown'}

⬇️ *𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...*

> © Powered by Sila Tech
    `;

    // Send app info with thumbnail
    await conn.sendMessage(from, {
      image: { url: appData.thumb || 'https://i.imgur.com/placeholder.png' },
      caption: appInfo,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

    // Send the APK file
    await conn.sendMessage(from, {
      document: { url: downloadUrl },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${appData.judul.replace(/[^a-zA-Z0-9]/g, '_')}.apk`,
      caption: `✅ *${appData.judul} downloaded successfully*\n\n> © Powered by Sila Tech`,
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error("Download Error:", e);
    throw e;
  }
}

// Handle app selection via number
cmd({
  pattern: "select",
  alias: ["sel"],
  desc: "Select app from search results",
  category: "download",
  react: "🔢",
  filename: __filename,
  dontAddCommand: true
}, async (conn, mek, m, { from, q, sender }) => {
  try {
    if (!global.apkSearchResults || !global.apkSearchResults[sender]) {
      return await conn.sendMessage(from, { 
        text: "❌ *𝙽𝚘 𝚊𝚌𝚝𝚒𝚟𝚎 𝚜𝚎𝚊𝚛𝚌𝚑 𝚏𝚘𝚞𝚗𝚍*\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚎𝚊𝚛𝚌𝚑 𝚏𝚘𝚛 𝚊𝚗 𝚊𝚙𝚙 𝚏𝚒𝚛𝚜𝚝 𝚞𝚜𝚒𝚗𝚐 .apk", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const searchData = global.apkSearchResults[sender];
    
    // Check if search expired (5 minutes)
    if (Date.now() - searchData.timestamp > 5 * 60 * 1000) {
      delete global.apkSearchResults[sender];
      return await conn.sendMessage(from, { 
        text: "❌ *𝚂𝚎𝚊𝚛𝚌𝚑 𝚎𝚡𝚙𝚒𝚛𝚎𝚍*\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚜𝚎𝚊𝚛𝚌𝚑 𝚊𝚐𝚊𝚒𝚗 𝚞𝚜𝚒𝚗𝚐 .apk", 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    // Handle direct number reply
    const selection = q ? parseInt(q) : parseInt(m.message.conversation || m.message.extendedTextMessage?.text);
    
    if (isNaN(selection) || selection < 1 || selection > searchData.results.length) {
      return await conn.sendMessage(from, { 
        text: `❌ *𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚜𝚎𝚕𝚎𝚌𝚝𝚒𝚘𝚗*\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 1-${searchData.results.length}`, 
        contextInfo: getContextInfo({ sender: sender })
      }, { quoted: fkontak });
    }

    const selectedApp = searchData.results[selection - 1];
    
    // Clear stored search
    delete global.apkSearchResults[sender];
    
    // Download selected app
    await downloadAndSendApp(conn, from, sender, m, selectedApp);

  } catch (e) {
    console.error("Selection Error:", e);
    await conn.sendMessage(from, { 
      text: `⚠️ *𝙴𝚛𝚛𝚘𝚛:* ${e.message}`, 
      contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
  }
});
