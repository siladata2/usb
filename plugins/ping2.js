const { cmd } = require('../command');
const { getBotName } = require('./setbotname');

cmd({
    pattern: "ping2",
    alias: ["pong", "speed"],
    react: "🏓",
    desc: "Check bot response time",
    category: "main"
},
async(conn, mek, m, {from, sender}) => {
try{
    const botName = await getBotName();
    const start = Date.now();
    
    await conn.sendMessage(from, {
        text: `🏓 Pinging...`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });
    
    const end = Date.now();
    const responseTime = end - start;
    
    await conn.sendMessage(from, {
        text: `┏━❑ ${botName} PONG ━━━━━━━━━
┃ ⚡ Response: ${responseTime}ms
┃ 🤖 Bot: ${botName}
┗━━━━━━━━━━━━━━━━━━━━`,
        contextInfo: getContextInfo({ sender: sender })
    }, { quoted: fkontak });

} catch (e) {
    console.log(e);
}
});
