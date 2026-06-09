const { cmd } = require('../command');
const { getBotName } = require('./setbotname');

cmd({
    pattern: "about",
    alias: ["info", "botinfo"],
    react: "ℹ️",
    desc: "Bot information",
    category: "main"
},
async(conn, mek, m, {from, sender}) => {
try{
    const botName = await getBotName();
    
    const info = `┏━❑ ABOUT ${botName} ━━━━━━━━━
┃ 
┃ 🤖 *Name:* ${botName}
┃ ⚡ *Version:* 1.0.0
┃ 📦 *Platform:* WhatsApp
┃ 👑 *Owner:* Sila Tech
┃ 
┗━━━━━━━━━━━━━━━━━━━━`;

    await conn.sendMessage(from, {
        text: info,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});
