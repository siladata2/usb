const { cmd } = require("../command");
const { getLangText } = require('./language_cmds');

cmd({
    pattern: "testlang",
    alias: ["lughatest"],
    desc: "Test language system",
    category: "test",
    react: "🧪",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        // Get text in user's language
        const loading = getLangText(sender, 'loading');
        const success = getLangText(sender, 'success');
        const welcome = getLangText(sender, 'welcome');
        
        // Send loading message
        await reply(loading);
        
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Send success with user's name
        const userName = mek.pushName || sender.split('@')[0];
        reply(`${success}\n\n${welcome} ${userName}!`);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});
