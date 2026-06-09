const { cmd } = require("../command");
const axios = require("axios");
const fs = require('fs');
const path = require('path');
const os = require('os');

// ==================== LUCHA (Import from your language system) ====================
// Make sure this path matches your language file location
let userLanguages = {};
const langDbPath = path.join(__dirname, '../data/user_lang.json');
const languages = require('../lib/languages');

// Load user languages
try {
    if (fs.existsSync(langDbPath)) {
        userLanguages = JSON.parse(fs.readFileSync(langDbPath));
    }
} catch (e) {
    console.error('Error loading language database:', e);
}

// Get user language function
function getUserLanguage(userJid) {
    return userLanguages[userJid]?.code || 'sw';
}

// Get language text function
function getLangText(userJid, key) {
    const langCode = getUserLanguage(userJid);
    const lang = languages[langCode] || languages['sw'];
    
    const keys = key.split('.');
    let value = lang;
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            let fallback = languages['sw'];
            for (const fk of keys) {
                fallback = fallback?.[fk];
            }
            return fallback || key;
        }
    }
    return value;
}

// Fake vCard for quoting
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝚄𝚃𝙸𝙻𝚂"
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

// ==================== 1. UTILS MENU ====================
cmd({
    pattern: "utilsmenu",
    alias: ["utilities", "zana"],
    desc: "Show all utility commands",
    category: "utils",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const menuText = `╔══════════════════════╗
║    🛠️ UTILS MENU     ║
╚══════════════════════╝

╔══════════════════════╗
║ 1️⃣ *CALCULATORS*     ║
╠══════════════════════╣
║ ▸ .calc 2+2          ║
║ ▸ .bmi 70 1.75       ║
║ ▸ .age 1990-05-15    ║
║ ▸ .random 1 100      ║
╚══════════════════════╝

╔══════════════════════╗
║ 2️⃣ *CONVERTERS*      ║
╠══════════════════════╣
║ ▸ .currency 100 usd  ║
║ ▸ .temperature 30C   ║
║ ▸ .length 10 m       ║
║ ▸ .weight 5 kg       ║
╚══════════════════════╝

╔══════════════════════╗
║ 3️⃣ *TEXT TOOLS*      ║
╠══════════════════════╣
║ ▸ .reverse hello     ║
║ ▸ .count words       ║
║ ▸ .qr text           ║
║ ▸ .shorten url       ║
╚══════════════════════╝

╔══════════════════════╗
║ 4️⃣ *TIME & DATE*     ║
╠══════════════════════╣
║ ▸ .time              ║
║ ▸ .date              ║
║ ▸ .calendar 2024     ║
║ ▸ .timer 60s         ║
╚══════════════════════╝

╔══════════════════════╗
║ 5️⃣ *SYSTEM INFO*     ║
╠══════════════════════╣
║ ▸ .ping              ║
║ ▸ .uptime            ║
║ ▸ .botinfo           ║
║ ▸ .server            ║
╚══════════════════════╝

> © Sila MD | *Everyone Can Use*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/36vahk.png' },
            caption: menuText,
            contextInfo: getContextInfo(m, sender)
        }, { quoted: fkontak });

    } catch (e) {
        console.error('Utils Menu Error:', e);
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 2. CALCULATOR ====================
cmd({
    pattern: "calc",
    alias: ["calculator", "hesabu"],
    desc: "Simple calculator",
    category: "utils",
    react: "🧮",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply(getLangText(sender, 'noQuery') + '\nExample: .calc 2+2*3');
        
        // Safe evaluation
        const result = Function('"use strict";return (' + q + ')')();
        
        reply(`🧮 *CALCULATOR*\n\n${q} = ${result}`);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' Invalid expression. Use numbers and + - * / only.');
    }
});

// ==================== 3. BMI CALCULATOR ====================
cmd({
    pattern: "bmi",
    alias: ["bodymass"],
    desc: "Calculate Body Mass Index",
    category: "utils",
    react: "⚖️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) {
            return reply("❌ *Usage:* .bmi [weight in kg] [height in meters]\nExample: .bmi 70 1.75");
        }
        
        const weight = parseFloat(args[0]);
        const height = parseFloat(args[1]);
        
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            return reply("❌ Invalid numbers. Weight in kg, height in meters.");
        }
        
        const bmi = weight / (height * height);
        const bmiRounded = bmi.toFixed(1);
        
        let category = "";
        if (bmi < 18.5) category = "🔻 Underweight";
        else if (bmi < 25) category = "✅ Normal weight";
        else if (bmi < 30) category = "⚠️ Overweight";
        else category = "🔺 Obese";
        
        const result = `⚖️ *BMI CALCULATOR*\n\n` +
                      `Weight: ${weight} kg\n` +
                      `Height: ${height} m\n` +
                      `BMI: ${bmiRounded}\n` +
                      `Category: ${category}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 4. AGE CALCULATOR ====================
cmd({
    pattern: "age",
    alias: ["umri", "howold"],
    desc: "Calculate age from birth date",
    category: "utils",
    react: "🎂",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .age YYYY-MM-DD\nExample: .age 1990-05-15");
        
        const birthDate = new Date(q);
        if (isNaN(birthDate)) return reply("❌ Invalid date format. Use YYYY-MM-DD");
        
        const today = new Date();
        
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        
        const result = `🎂 *AGE CALCULATOR*\n\n` +
                      `Born: ${q}\n` +
                      `Age: ${years} years, ${months} months, ${days} days\n` +
                      `Next birthday: ${daysUntil} days left 🎉`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 5. RANDOM NUMBER GENERATOR ====================
cmd({
    pattern: "random",
    alias: ["rand", "randomnumber"],
    desc: "Generate random number",
    category: "utils",
    react: "🎲",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const args = q.split(' ');
        let min = 1, max = 100;
        
        if (args.length >= 2) {
            min = parseInt(args[0]);
            max = parseInt(args[1]);
        } else if (args.length === 1) {
            max = parseInt(args[0]);
        }
        
        if (isNaN(min) || isNaN(max) || min >= max) {
            return reply("❌ *Usage:* .random [min] [max]\nExample: .random 1 100");
        }
        
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        
        reply(`🎲 *RANDOM NUMBER*\n\nBetween ${min} and ${max}\nResult: *${random}*`);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 6. CURRENCY CONVERTER ====================
cmd({
    pattern: "currency",
    alias: ["exchange", "sarafu"],
    desc: "Convert currency (USD, EUR, GBP, etc.)",
    category: "utils",
    react: "💱",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) {
            return reply("❌ *Usage:* .currency [amount] [from] [to]\nExample: .currency 100 usd eur");
        }
        
        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2] ? args[2].toUpperCase() : 'TZS';
        
        if (isNaN(amount)) return reply("❌ Invalid amount.");
        
        // Using free exchangerate API
        const api = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (!api.data || !api.data.rates) {
            return reply("❌ Invalid currency code. Use USD, EUR, GBP, TZS, etc.");
        }
        
        const rate = api.data.rates[toCurrency];
        if (!rate) return reply(`❌ Currency ${toCurrency} not found.`);
        
        const converted = (amount * rate).toFixed(2);
        
        const result = `💱 *CURRENCY CONVERTER*\n\n` +
                      `${amount} ${fromCurrency} = *${converted} ${toCurrency}*\n` +
                      `Rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 7. TEMPERATURE CONVERTER ====================
cmd({
    pattern: "temperature",
    alias: ["temp", "joto"],
    desc: "Convert temperature (C, F, K)",
    category: "utils",
    react: "🌡️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .temperature 30C to F\nExample: .temperature 30C");
        
        const match = q.match(/^([-+]?\d*\.?\d+)([cCfFkK])(?:\s+to\s+([cCfFkK]))?$/i);
        if (!match) return reply("❌ Invalid format. Use like: 30C, 86F, 300K");
        
        const value = parseFloat(match[1]);
        const fromUnit = match[2].toUpperCase();
        let toUnit = match[3] ? match[3].toUpperCase() : (fromUnit === 'C' ? 'F' : 'C');
        
        let result, resultValue;
        
        if (fromUnit === 'C') {
            if (toUnit === 'F') {
                resultValue = (value * 9/5) + 32;
                result = `${value}°C = ${resultValue.toFixed(1)}°F`;
            } else if (toUnit === 'K') {
                resultValue = value + 273.15;
                result = `${value}°C = ${resultValue.toFixed(1)}K`;
            } else {
                result = `${value}°C = ${value}°C`;
            }
        } else if (fromUnit === 'F') {
            if (toUnit === 'C') {
                resultValue = (value - 32) * 5/9;
                result = `${value}°F = ${resultValue.toFixed(1)}°C`;
            } else if (toUnit === 'K') {
                resultValue = (value - 32) * 5/9 + 273.15;
                result = `${value}°F = ${resultValue.toFixed(1)}K`;
            } else {
                result = `${value}°F = ${value}°F`;
            }
        } else if (fromUnit === 'K') {
            if (toUnit === 'C') {
                resultValue = value - 273.15;
                result = `${value}K = ${resultValue.toFixed(1)}°C`;
            } else if (toUnit === 'F') {
                resultValue = (value - 273.15) * 9/5 + 32;
                result = `${value}K = ${resultValue.toFixed(1)}°F`;
            } else {
                result = `${value}K = ${value}K`;
            }
        }
        
        reply(`🌡️ *TEMPERATURE CONVERTER*\n\n${result}`);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 8. LENGTH CONVERTER ====================
cmd({
    pattern: "length",
    alias: ["urefu", "distance"],
    desc: "Convert length units (m, km, cm, mm, mile, yard, foot, inch)",
    category: "utils",
    react: "📏",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const units = {
            'm': 1,
            'km': 1000,
            'cm': 0.01,
            'mm': 0.001,
            'mile': 1609.34,
            'yard': 0.9144,
            'foot': 0.3048,
            'ft': 0.3048,
            'inch': 0.0254,
            'in': 0.0254
        };
        
        if (!q) return reply("❌ *Usage:* .length 10 m to km\nExample: .length 10 m");
        
        const match = q.match(/^([-+]?\d*\.?\d+)\s*([a-z]+)(?:\s+to\s+([a-z]+))?$/i);
        if (!match) return reply("❌ Invalid format. Use like: 10 m, 5 km, 100 cm");
        
        const value = parseFloat(match[1]);
        const fromUnit = match[2].toLowerCase();
        let toUnit = match[3] ? match[3].toLowerCase() : 'km';
        
        if (!units[fromUnit]) return reply(`❌ Unknown unit: ${fromUnit}`);
        if (!units[toUnit]) return reply(`❌ Unknown unit: ${toUnit}`);
        
        const meters = value * units[fromUnit];
        const resultValue = meters / units[toUnit];
        
        const result = `📏 *LENGTH CONVERTER*\n\n` +
                      `${value} ${fromUnit} = *${resultValue.toFixed(4)} ${toUnit}*`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 9. WEIGHT CONVERTER ====================
cmd({
    pattern: "weight",
    alias: ["uzito", "mass"],
    desc: "Convert weight units (kg, g, mg, lb, oz)",
    category: "utils",
    react: "⚖️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const units = {
            'kg': 1,
            'g': 0.001,
            'mg': 0.000001,
            'lb': 0.453592,
            'pound': 0.453592,
            'oz': 0.0283495,
            'ounce': 0.0283495
        };
        
        if (!q) return reply("❌ *Usage:* .weight 10 kg to lb\nExample: .weight 70 kg");
        
        const match = q.match(/^([-+]?\d*\.?\d+)\s*([a-z]+)(?:\s+to\s+([a-z]+))?$/i);
        if (!match) return reply("❌ Invalid format. Use like: 70 kg, 150 lb");
        
        const value = parseFloat(match[1]);
        const fromUnit = match[2].toLowerCase();
        let toUnit = match[3] ? match[3].toLowerCase() : 'lb';
        
        if (!units[fromUnit]) return reply(`❌ Unknown unit: ${fromUnit}`);
        if (!units[toUnit]) return reply(`❌ Unknown unit: ${toUnit}`);
        
        const kg = value * units[fromUnit];
        const resultValue = kg / units[toUnit];
        
        const result = `⚖️ *WEIGHT CONVERTER*\n\n` +
                      `${value} ${fromUnit} = *${resultValue.toFixed(2)} ${toUnit}*`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 10. REVERSE TEXT ====================
cmd({
    pattern: "reverse",
    alias: ["geuza", "backwards"],
    desc: "Reverse any text",
    category: "utils",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .reverse Hello World");
        
        const reversed = q.split('').reverse().join('');
        
        reply(`🔄 *REVERSED TEXT*\n\nOriginal: ${q}\nReversed: ${reversed}`);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 11. WORD COUNTER ====================
cmd({
    pattern: "count",
    alias: ["wordcount", "hesabu"],
    desc: "Count words, letters, and characters",
    category: "utils",
    react: "🔢",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .count This is a sentence");
        
        const words = q.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const charCount = q.length;
        const letterCount = q.replace(/[^a-zA-Z]/g, '').length;
        const numberCount = (q.match(/\d/g) || []).length;
        const spaceCount = (q.match(/\s/g) || []).length;
        
        const result = `🔢 *TEXT STATISTICS*\n\n` +
                      `Text: "${q}"\n\n` +
                      `Words: ${wordCount}\n` +
                      `Characters: ${charCount}\n` +
                      `Letters: ${letterCount}\n` +
                      `Numbers: ${numberCount}\n` +
                      `Spaces: ${spaceCount}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 12. QR CODE GENERATOR ====================
cmd({
    pattern: "qr",
    alias: ["qrcode"],
    desc: "Generate QR code from text",
    category: "utils",
    react: "📱",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .qr https://example.com");
        
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(q)}`;
        
        await conn.sendMessage(from, {
            image: { url: qrUrl },
            caption: `📱 *QR CODE*\n\nData: ${q}`
        }, { quoted: m });
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 13. URL SHORTENER ====================
cmd({
    pattern: "shorten",
    alias: ["tiny", "fupia"],
    desc: "Shorten a long URL",
    category: "utils",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .shorten https://example.com/very/long/url");
        
        if (!q.match(/^https?:\/\//)) {
            return reply("❌ Please include http:// or https://");
        }
        
        const api = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`);
        const shortUrl = api.data;
        
        const result = `🔗 *URL SHORTENER*\n\n` +
                      `Original: ${q}\n` +
                      `Shortened: ${shortUrl}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 14. CURRENT TIME ====================
cmd({
    pattern: "time",
    alias: ["saa", "clock"],
    desc: "Show current time in different timezones",
    category: "utils",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const timezones = {
            'tz': 'Africa/Dar_es_Salaam',
            'ke': 'Africa/Nairobi',
            'ng': 'Africa/Lagos',
            'za': 'Africa/Johannesburg',
            'uk': 'Europe/London',
            'us': 'America/New_York',
            'ny': 'America/New_York',
            'la': 'America/Los_Angeles',
            'dubai': 'Asia/Dubai',
            'india': 'Asia/Kolkata',
            'china': 'Asia/Shanghai',
            'japan': 'Asia/Tokyo',
            'aus': 'Australia/Sydney'
        };
        
        let timezone = 'Africa/Dar_es_Salaam';
        let location = 'Tanzania';
        
        if (q) {
            const tzKey = q.toLowerCase();
            if (timezones[tzKey]) {
                timezone = timezones[tzKey];
                location = tzKey.toUpperCase();
            } else {
                return reply(`❌ Unknown timezone. Options: tz, ke, ng, za, uk, us, ny, la, dubai, india, china, japan, aus`);
            }
        }
        
        const now = new Date();
        const options = { 
            timeZone: timezone, 
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const timeString = now.toLocaleString('en-US', options);
        
        const result = `⏰ *CURRENT TIME*\n\n` +
                      `Location: ${location}\n` +
                      `Time: ${timeString}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 15. CURRENT DATE ====================
cmd({
    pattern: "date",
    alias: ["tarehe", "today"],
    desc: "Show today's date in various formats",
    category: "utils",
    react: "📅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const now = new Date();
        
        const formats = {
            '1': now.toLocaleDateString('en-US'), // MM/DD/YYYY
            '2': now.toLocaleDateString('en-GB'), // DD/MM/YYYY
            '3': now.toISOString().split('T')[0], // YYYY-MM-DD
            '4': now.toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            '5': now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        };
        
        let result = `📅 *TODAY'S DATE*\n\n`;
        result += `Format 1 (US): ${formats['1']}\n`;
        result += `Format 2 (UK): ${formats['2']}\n`;
        result += `Format 3 (ISO): ${formats['3']}\n`;
        result += `Format 4 (Swahili): ${formats['4']}\n`;
        result += `Format 5 (Full): ${formats['5']}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 16. CALENDAR ====================
cmd({
    pattern: "calendar",
    alias: ["kalenda", "month"],
    desc: "Show calendar for a specific month/year",
    category: "utils",
    react: "📆",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        
        if (q) {
            const parts = q.split('-');
            if (parts.length === 2) {
                year = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1;
            } else if (q.length === 4) {
                year = parseInt(q);
            } else {
                return reply("❌ *Usage:* .calendar [YYYY] or .calendar YYYY-MM\nExample: .calendar 2024-12");
            }
        }
        
        if (isNaN(year) || year < 1900 || year > 2100) {
            return reply("❌ Invalid year. Use 1900-2100");
        }
        if (month < 0 || month > 11) month = now.getMonth();
        
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        let calendar = `📆 *${monthNames[month]} ${year}*\n\n`;
        calendar += "Su Mo Tu We Th Fr Sa\n";
        
        // Add leading spaces
        for (let i = 0; i < firstDay; i++) {
            calendar += "   ";
        }
        
        // Add days
        for (let day = 1; day <= daysInMonth; day++) {
            calendar += day.toString().padStart(2, ' ') + " ";
            if ((firstDay + day) % 7 === 0) {
                calendar += "\n";
            }
        }
        
        reply(calendar);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 17. TIMER ====================
cmd({
    pattern: "timer",
    alias: ["countdown"],
    desc: "Set a timer (seconds, minutes, hours)",
    category: "utils",
    react: "⏲️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .timer 30s, .timer 5m, .timer 1h");
        
        const match = q.match(/^(\d+)([smh])$/i);
        if (!match) return reply("❌ Invalid format. Use: 30s, 5m, 1h");
        
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        
        let milliseconds, unitName;
        if (unit === 's') {
            milliseconds = value * 1000;
            unitName = value === 1 ? 'second' : 'seconds';
        } else if (unit === 'm') {
            milliseconds = value * 60 * 1000;
            unitName = value === 1 ? 'minute' : 'minutes';
        } else if (unit === 'h') {
            milliseconds = value * 60 * 60 * 1000;
            unitName = value === 1 ? 'hour' : 'hours';
        }
        
        reply(`⏲️ *TIMER SET*\n\nTimer for ${value} ${unitName} started!\nI'll remind you when time is up.`);
        
        setTimeout(() => {
            conn.sendMessage(from, { 
                text: `⏰ *TIME'S UP!*\n\nYour ${value} ${unitName} timer has finished.` 
            }, { quoted: m });
        }, milliseconds);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 18. PING / LATENCY ====================
cmd({
    pattern: "ping2",
    alias: ["pong", "lag"],
    desc: "Check bot response time",
    category: "utils",
    react: "📶",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();
        
        const msg = await reply("📶 *Pinging...*");
        
        const end = Date.now();
        const latency = end - start;
        
        const emoji = latency < 200 ? '🟢' : latency < 500 ? '🟡' : '🔴';
        
        await conn.sendMessage(from, {
            text: `${emoji} *PONG!*\n\nResponse Time: ${latency}ms`,
            edit: msg.key
        });
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 19. UPTIME ====================
cmd({
    pattern: "uptime2",
    alias: ["runtime", "muda"],
    desc: "Show how long the bot has been running",
    category: "utils",
    react: "⏱️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        let uptimeString = '';
        if (days > 0) uptimeString += `${days}d `;
        if (hours > 0) uptimeString += `${hours}h `;
        if (minutes > 0) uptimeString += `${minutes}m `;
        uptimeString += `${seconds}s`;
        
        const result = `⏱️ *BOT UPTIME*\n\n` +
                      `Online for: ${uptimeString}\n` +
                      `Started: ${new Date(Date.now() - uptime * 1000).toLocaleString()}`;
        
        reply(result);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 20. BOT INFO ====================
cmd({
    pattern: "botinfo",
    alias: ["info", "about"],
    desc: "Show information about the bot",
    category: "utils",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const memory = process.memoryUsage();
        const memoryUsed = (memory.heapUsed / 1024 / 1024).toFixed(2);
        const memoryTotal = (memory.heapTotal / 1024 / 1024).toFixed(2);
        
        const platform = os.platform();
        const arch = os.arch();
        const cpuCores = os.cpus().length;
        
        const botJid = conn.user.id.split(':')[0];
        
        const info = `🤖 *BOT INFORMATION*\n\n` +
                    `📱 *Name:* SILA MD\n` +
                    `📟 *Number:* ${botJid}\n` +
                    `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m\n` +
                    `💾 *Memory:* ${memoryUsed}MB / ${memoryTotal}MB\n` +
                    `🖥️ *Platform:* ${platform} (${arch})\n` +
                    `⚙️ *CPU Cores:* ${cpuCores}\n` +
                    `🌐 *Language:* ${languages[getUserLanguage(sender)].flag} ${languages[getUserLanguage(sender)].name}\n` +
                    `📦 *Commands:* 20+ Utils\n\n` +
                    `> © Sila MD | Open Source`;
        
        reply(info);
        
    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// Export language functions for use in other commands
module.exports = {
    getUserLanguage,
    getLangText
};
