const { cmd } = require('../command');
const axios = require('axios');

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐒𝐈𝐋𝐀-𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐒𝐈𝐋𝐀 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐒𝐈𝐋𝐀-𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255789661031\nEND:VCARD`
    }
  }
};

const getContextInfo = (sender) => {
    return {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

const AXIOS_DEFAULTS = {
	timeout: 30000,
	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
		'Accept': 'application/json'
	}
};

async function getCopilotResponse(query) {
	const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(query)}`;
	const res = await axios.get(apiUrl, AXIOS_DEFAULTS);
	if (res?.data?.status && res?.data?.result?.response) {
		return res.data.result.response;
	}
	throw new Error('No response from AI');
}

cmd({
	pattern: 'copilot',
	alias: ['ai', 'silaai', 'ask', 'query', 'gpt', 'silacop'],
	react: '🤖',
	desc: 'Ask AI Copilot anything',
	category: 'Ai',
	filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
	try {
		if (!q) {
			return reply(`┏━❑ 𝐒𝙸𝙻𝐀-𝐌𝐃 𝐀𝐈 𝐂𝐎𝐏𝐈𝐋𝐎𝐓 ━━━━━━━━━
┃ 🤖 𝙰𝚜𝚔 𝚖𝚎 𝚊𝚗𝚢𝚝𝚑𝚒𝚗𝚐
┃
┃ 𝚄𝚜𝚎: .𝚊𝚒 𝚢𝚘𝚞𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗
┃
┃ 𝙰𝚕𝚒𝚊𝚜𝚎𝚜:
┃ • .𝚊𝚒
┃ • .𝚊𝚜𝚔
┃ • .𝚌𝚘𝚙𝚒𝚕𝚘𝚝
┃ • .𝚜𝚒𝚕𝚊𝚊𝚒
┃
┃ 𝙴𝚡𝚊𝚖𝚙𝚕𝚎𝚜:
┃ • .𝚊𝚒 𝚠𝚑𝚊𝚝 𝚒𝚜 𝚎𝚌𝚘𝚗𝚘𝚖𝚒𝚌𝚜
┃ • .𝚊𝚎𝚐 𝚑𝚘𝚠 𝚝𝚘 𝚕𝚎𝚊𝚛𝚗 𝚙𝚛𝚘𝚐𝚛𝚊𝚖𝚖𝚒𝚗𝚐
┗━━━━━━━━━━━━━━━━━━━━`);
		}

		// Show thinking message
		const thinkMsg = await conn.sendMessage(from, {
			text: `🤔 𝚃𝚑𝚒𝚗𝚔𝚒𝚗𝚐 𝚊𝚋𝚘𝚞𝚝 𝚢𝚘𝚞𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗...`
		}, { quoted: mek });

		let response;
		try {
			response = await getCopilotResponse(q);
		} catch (apiErr) {
			console.error('API Error:', apiErr);
			await conn.sendMessage(from, { delete: thinkMsg.key });
			return reply(`┏━❑ 𝐀𝐈 𝐄𝐑𝐑𝐎𝐑 ━━━━━━━━━
┃ ❌ 𝚈𝚞𝚙𝚛𝚊 𝙰𝙸 𝙰𝙿𝙸 𝚎𝚛𝚛𝚘𝚛
┃ 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛
┗━━━━━━━━━━━━━━━━━━━━`, { quoted: fakevCard });
		}

		if (!response) {
			await conn.sendMessage(from, { delete: thinkMsg.key });
			return reply(`┏━❑ 𝐀𝐈 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
		}

		// Format response
		let formattedResponse = response;
		if (response.length > 4096) {
			formattedResponse = response.substring(0, 4093) + '...';
		}

		const finalMsg = `┏━❑ 𝐒𝙸𝙻𝐀-𝐌𝐃 𝐂𝐎𝐏𝐈𝐋𝐎𝐓 ━━━━━━━━━
┃ 🤖 𝙷𝚎𝚛𝚎'𝚜 𝚖𝚢 𝚊𝚗𝚜𝚠𝚎𝚛:
┃
${formattedResponse.split('\n').map(line => `┃ ${line}`).join('\n')}

┗━━━━━━━━━━━━━━━━━━━━`;

		// Delete thinking message and send response
		await conn.sendMessage(from, { delete: thinkMsg.key });
		await conn.sendMessage(from, {
			text: finalMsg,
			contextInfo: getContextInfo(sender)
		}, { quoted: fakevCard });

	} catch (err) {
		console.error('Copilot error:', err);
		reply(`┏━❑ 𝐀𝐈 𝐄𝐑𝐑𝐎𝐑 ━━━━━━━━━
┃ ❌ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚖𝚘𝚘𝚖𝚎𝚗𝚝
┃ 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗
┗━━━━━━━━━━━━━━━━━━━━`, { quoted: fakevCard });
	}
});

// Advanced copilot command with more options
cmd({
	pattern: 'aix',
	alias: ['copilotx', 'aiexplain', 'explain'],
	react: '🧠',
	desc: 'Advanced AI explanation',
	category: 'main',
	filename: __filename
},
async (conn, mek, m, { from, sender, reply, q }) => {
	try {
		if (!q) {
			return reply(`┏━❑ 𝐀𝐈 𝐄𝐗𝐏𝐋𝐀𝐈𝐍 ━━━━━━━━━
┃ 🧠 𝙰𝚖𝚋𝚐 𝚘𝚖𝚞 𝚚𝚞𝚖 𝚞𝚞𝚊𝚕𝚞𝚛𝚞
┃
┃ 𝚄𝚜𝚎: .𝚊𝚒𝚡 𝚖𝚎𝚜𝚜𝚊𝚐𝚎
┗━━━━━━━━━━━━━━━━━━━━`);
		}

		const prompt = `Explain this in detail: ${q}`;

		const loadMsg = await conn.sendMessage(from, {
			text: `⏳ 𝙻𝚘𝚊𝚍𝚒𝚗𝚐 𝚎𝚡𝚙𝚕𝚊𝚗𝚊𝚝𝚒𝚘𝚗...`
		}, { quoted: mek });

		let response;
		try {
			response = await getCopilotResponse(prompt);
		} catch (apiErr) {
			console.error('API Error:', apiErr);
			await conn.sendMessage(from, { delete: loadMsg.key });
			return reply(`❌ 𝙰𝙿𝙸 𝚎𝚛𝚛𝚘𝚛`, { quoted: fakevCard });
		}

		if (!response) {
			await conn.sendMessage(from, { delete: loadMsg.key });
			return reply(`❌ 𝙽𝚘 𝚛𝚎𝚜𝚘𝚞𝚕𝚝𝚜`);
		}

		const explainMsg = `┏━❑ 𝐃𝐄𝐓𝐀𝐈𝐋𝐄𝐃 𝐄𝐗𝐏𝐋𝐀𝐍𝐀𝐓𝐈𝐎𝐍 ━━━━━━\n┃\n${response.substring(0, 4000).split('\n').map(line => `┃ ${line}`).join('\n')}\n┃\n┗━━━━━━━━━━━━━━━━━━━━`;

		await conn.sendMessage(from, { delete: loadMsg.key });
		await conn.sendMessage(from, {
			text: explainMsg,
			contextInfo: getContextInfo(sender)
		}, { quoted: fakevCard });

	} catch (err) {
		console.error('AIX error:', err);
		reply(`❌ 𝙴𝚛𝚛𝚘𝚛 𝚙𝚘𝚌𝚎𝚜𝚜𝚒𝚖𝚐`, { quoted: fakevCard });
	}

});
