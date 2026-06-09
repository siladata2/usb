const { cmd } = require("../command");
const axios = require("axios");
const fs = require('fs');
const path = require('path');

// ==================== LANGUAGE SYSTEM ====================
let userLanguages = {};
const langDbPath = path.join(__dirname, '../data/user_lang.json');
const languages = require('../lib/languages');

try {
    if (fs.existsSync(langDbPath)) {
        userLanguages = JSON.parse(fs.readFileSync(langDbPath));
    }
} catch (e) {
    console.error('Error loading language database:', e);
}

function getUserLanguage(userJid) {
    return userLanguages[userJid]?.code || 'sw';
}

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

// Fake vCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝚃𝚁𝙰𝙳𝙴"
    }
};

// Helper for context info
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

// ==================== 1. TRADE MENU ====================
cmd({
    pattern: "trademenu",
    alias: ["biashara", "market"],
    desc: "Show all trading commands",
    category: "trade",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const menuText = `╔══════════════════════╗
║    📊 TRADE MENU     ║
╚══════════════════════╝

╔══════════════════════╗
║ 1️⃣ *CURRENCY*        ║
╠══════════════════════╣
║ ▸ .exchange 100 usd  ║
║ ▸ .rates             ║
║ ▸ .tzs to usd 10000  ║
║ ▸ .euro              ║
╚══════════════════════╝

╔══════════════════════╗
║ 2️⃣ *CRYPTO*          ║
╠══════════════════════╣
║ ▸ .btc               ║
║ ▸ .eth               ║
║ ▸ .crypto BTC        ║
║ ▸ .convert btc usd 1 ║
╚══════════════════════╝

╔══════════════════════╗
║ 3️⃣ *STOCKS*          ║
╠══════════════════════╣
║ ▸ .stock AAPL        ║
║ ▸ .market            ║
║ ▸ .indices           ║
║ ▸ .safaricom         ║
╚══════════════════════╝

╔══════════════════════╗
║ 4️⃣ *COMMODITIES*     ║
╠══════════════════════╣
║ ▸ .gold              ║
║ ▸ .silver            ║
║ ▸ .oil               ║
║ ▸ .coffee            ║
╚══════════════════════╝

╔══════════════════════╗
║ 5️⃣ *BUSINESS TOOLS*  ║
╠══════════════════════╣
║ ▸ .vat 100000        ║
║ ▸ .profit 50000 30000║
║ ▸ .loan 1000000 12   ║
║ ▸ .interest 100000 5 ║
╚══════════════════════╝

> © Sila MD | *Trade & Business Tools*`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/36vahk.png' },
            caption: menuText,
            contextInfo: getContextInfo(m, sender)
        }, { quoted: fkontak });

    } catch (e) {
        reply(getLangText(sender, 'error') + ' ' + e.message);
    }
});

// ==================== 2. EXCHANGE RATE ====================
cmd({
    pattern: "exchange",
    alias: ["forex", "currency"],
    desc: "Get real-time exchange rates",
    category: "trade",
    react: "💱",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .exchange [amount] [from] [to]\nExample: .exchange 100 usd tzs");
        
        const args = q.split(' ');
        let amount = 1, fromCurrency = 'USD', toCurrency = 'TZS';
        
        if (args.length === 1) {
            fromCurrency = args[0].toUpperCase();
        } else if (args.length === 2) {
            amount = parseFloat(args[0]);
            fromCurrency = args[1].toUpperCase();
        } else if (args.length >= 3) {
            amount = parseFloat(args[0]);
            fromCurrency = args[1].toUpperCase();
            toCurrency = args[2].toUpperCase();
        }
        
        if (isNaN(amount)) amount = 1;
        
        const api = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        
        if (!api.data || !api.data.rates) {
            return reply("❌ Invalid currency code. Use USD, EUR, GBP, TZS, etc.");
        }
        
        const rate = api.data.rates[toCurrency];
        if (!rate) return reply(`❌ Currency ${toCurrency} not found.`);
        
        const converted = (amount * rate).toFixed(2);
        const date = new Date(api.data.date).toLocaleDateString();
        
        const result = `💱 *EXCHANGE RATE*\n\n` +
                      `${amount} ${fromCurrency} = *${converted} ${toCurrency}*\n` +
                      `Rate: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}\n` +
                      `Date: ${date}\n\n` +
                      `> Data from exchangerate-api.com`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching exchange rates. Try again later.');
    }
});

// ==================== 3. ALL RATES ====================
cmd({
    pattern: "rates",
    alias: ["allrates", "currencies"],
    desc: "Show major currency rates",
    category: "trade",
    react: "💹",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const api = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        
        const rates = api.data.rates;
        const date = new Date(api.data.date).toLocaleDateString();
        
        const majorRates = {
            'TZS': rates.TZS?.toFixed(2) || 'N/A',
            'KES': rates.KES?.toFixed(2) || 'N/A',
            'UGX': rates.UGX?.toFixed(2) || 'N/A',
            'EUR': rates.EUR?.toFixed(4) || 'N/A',
            'GBP': rates.GBP?.toFixed(4) || 'N/A',
            'JPY': rates.JPY?.toFixed(2) || 'N/A',
            'CNY': rates.CNY?.toFixed(4) || 'N/A',
            'ZAR': rates.ZAR?.toFixed(4) || 'N/A',
            'INR': rates.INR?.toFixed(2) || 'N/A',
            'AED': rates.AED?.toFixed(4) || 'N/A'
        };
        
        let result = `💹 *MAJOR CURRENCY RATES*\n\n`;
        result += `Base: USD (1 USD = X)\n`;
        result += `Date: ${date}\n\n`;
        
        for (const [code, rate] of Object.entries(majorRates)) {
            result += `${code}: ${rate}\n`;
        }
        
        result += `\n> Use .exchange [amount] [from] [to] for conversion`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching rates.');
    }
});

// ==================== 4. TZS TO USD ====================
cmd({
    pattern: "tzs",
    alias: ["shilingi"],
    desc: "Convert Tanzanian Shilling to other currencies",
    category: "trade",
    react: "🇹🇿",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .tzs [amount] [to]\nExample: .tzs 10000 usd");
        
        const args = q.split(' ');
        let amount = parseFloat(args[0]);
        let toCurrency = args[1] ? args[1].toUpperCase() : 'USD';
        
        if (isNaN(amount)) return reply("❌ Invalid amount.");
        
        const api = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        
        // First get USD to TZS rate
        const usdToTzs = api.data.rates.TZS;
        if (!usdToTzs) return reply("❌ TZS rate not available.");
        
        // Convert TZS to USD first
        const amountInUsd = amount / usdToTzs;
        
        // Then to target currency
        const targetRate = api.data.rates[toCurrency];
        if (!targetRate) return reply(`❌ Currency ${toCurrency} not found.`);
        
        const converted = (amountInUsd * targetRate).toFixed(2);
        
        const result = `🇹🇿 *TANZANIAN SHILLING CONVERTER*\n\n` +
                      `TZS ${amount.toLocaleString()} = *${converted} ${toCurrency}*\n\n` +
                      `Rate: 1 USD = ${usdToTzs.toFixed(2)} TZS`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error converting TZS.');
    }
});

// ==================== 5. BITCOIN PRICE ====================
cmd({
    pattern: "btc",
    alias: ["bitcoin"],
    desc: "Get Bitcoin price in various currencies",
    category: "trade",
    react: "₿",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        let currency = (q || 'USD').toUpperCase();
        
        const api = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
        const bpi = api.data.bpi;
        
        if (!bpi[currency] && currency !== 'ALL') {
            currency = 'USD';
        }
        
        if (currency === 'ALL') {
            let result = `₿ *BITCOIN PRICES*\n\n`;
            result += `*USD:* $${bpi.USD.rate}\n`;
            result += `*GBP:* £${bpi.GBP.rate}\n`;
            result += `*EUR:* €${bpi.EUR.rate}\n`;
            result += `\nUpdated: ${api.data.time.updated}`;
            reply(result);
        } else {
            const price = bpi[currency];
            const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
            
            const result = `₿ *BITCOIN (BTC)*\n\n` +
                          `Price: ${symbol}${price.rate}\n` +
                          `Currency: ${currency}\n` +
                          `Updated: ${api.data.time.updated}\n\n` +
                          `> Use .btc all for all currencies`;
            
            reply(result);
        }
        
    } catch (e) {
        reply('❌ Error fetching Bitcoin price.');
    }
});

// ==================== 6. ETHEREUM PRICE ====================
cmd({
    pattern: "eth",
    alias: ["ethereum"],
    desc: "Get Ethereum price",
    category: "trade",
    react: "♦️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const api = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,gbp,kes,tzs&include_24hr_change=true');
        
        const eth = api.data.ethereum;
        
        const result = `♦️ *ETHEREUM (ETH)*\n\n` +
                      `🇺🇸 USD: $${eth.usd}\n` +
                      `🇪🇺 EUR: €${eth.eur}\n` +
                      `🇬🇧 GBP: £${eth.gbp}\n` +
                      `🇰🇪 KES: KSh ${eth.kes?.toLocaleString() || 'N/A'}\n` +
                      `🇹🇿 TZS: TSh ${eth.tzs?.toLocaleString() || 'N/A'}\n\n` +
                      `24h Change: ${eth.usd_24h_change?.toFixed(2)}%\n\n` +
                      `> Data from CoinGecko`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching Ethereum price.');
    }
});

// ==================== 7. CRYPTO SEARCH ====================
cmd({
    pattern: "crypto",
    alias: ["cryptocurrency"],
    desc: "Search any cryptocurrency",
    category: "trade",
    react: "🪙",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .crypto [coin]\nExample: .crypto bitcoin, .crypto solana");
        
        const coin = q.toLowerCase().trim();
        
        const api = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd,eur,gbp,kes,tzs&include_24hr_change=true&include_market_cap=true`);
        
        if (!api.data[coin]) {
            return reply(`❌ Cryptocurrency "${q}" not found. Try: bitcoin, ethereum, solana, dogecoin, etc.`);
        }
        
        const data = api.data[coin];
        
        const result = `🪙 *${q.toUpperCase()} PRICE*\n\n` +
                      `🇺🇸 USD: $${data.usd}\n` +
                      `🇪🇺 EUR: €${data.eur}\n` +
                      `🇬🇧 GBP: £${data.gbp}\n` +
                      `🇰🇪 KES: KSh ${data.kes?.toLocaleString() || 'N/A'}\n` +
                      `🇹🇿 TZS: TSh ${data.tzs?.toLocaleString() || 'N/A'}\n\n` +
                      `24h Change: ${data.usd_24h_change?.toFixed(2)}%\n` +
                      `Market Cap: $${(data.usd_market_cap / 1e9).toFixed(2)}B\n\n` +
                      `> Data from CoinGecko`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching crypto data.');
    }
});

// ==================== 8. CONVERT CRYPTO ====================
cmd({
    pattern: "convert",
    alias: ["cryptoconvert"],
    desc: "Convert cryptocurrency to fiat",
    category: "trade",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .convert [coin] [currency] [amount]\nExample: .convert btc usd 1");
        
        const args = q.split(' ');
        if (args.length < 3) return reply("❌ Usage: .convert [coin] [currency] [amount]");
        
        const coin = args[0].toLowerCase();
        const currency = args[1].toUpperCase();
        const amount = parseFloat(args[2]);
        
        if (isNaN(amount)) return reply("❌ Invalid amount.");
        
        const api = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency.toLowerCase()}`);
        
        if (!api.data[coin] || !api.data[coin][currency.toLowerCase()]) {
            return reply(`❌ Cannot convert ${coin} to ${currency}`);
        }
        
        const rate = api.data[coin][currency.toLowerCase()];
        const converted = (amount * rate).toFixed(2);
        
        const result = `🔄 *CRYPTO CONVERTER*\n\n` +
                      `${amount} ${coin.toUpperCase()} = *${converted} ${currency}*\n` +
                      `Rate: 1 ${coin.toUpperCase()} = ${rate} ${currency}`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error converting crypto.');
    }
});

// ==================== 9. STOCK PRICE ====================
cmd({
    pattern: "stock",
    alias: ["share", "equity"],
    desc: "Get stock price (US stocks)",
    category: "trade",
    react: "📈",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .stock [symbol]\nExample: .stock AAPL, .stock TSLA");
        
        const symbol = q.toUpperCase();
        
        // Using Alpha Vantage API (free tier)
        const api = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`);
        
        const data = api.data['Global Quote'];
        
        if (!data || Object.keys(data).length === 0) {
            return reply(`❌ Stock "${symbol}" not found. Try: AAPL, TSLA, MSFT, GOOGL`);
        }
        
        const change = parseFloat(data['09. change']);
        const changePercent = data['10. change percent'].replace('%', '');
        const changeEmoji = change >= 0 ? '🟢' : '🔴';
        
        const result = `📈 *STOCK: ${symbol}*\n\n` +
                      `Price: $${parseFloat(data['05. price']).toFixed(2)}\n` +
                      `Change: ${changeEmoji} $${change.toFixed(2)} (${changePercent}%)\n` +
                      `Open: $${parseFloat(data['02. open']).toFixed(2)}\n` +
                      `High: $${parseFloat(data['03. high']).toFixed(2)}\n` +
                      `Low: $${parseFloat(data['04. low']).toFixed(2)}\n` +
                      `Volume: ${parseInt(data['06. volume']).toLocaleString()}\n` +
                      `Latest: ${data['07. latest trading day']}\n\n` +
                      `> Data from Alpha Vantage`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching stock data. Try again later.');
    }
});

// ==================== 10. MARKET SUMMARY ====================
cmd({
    pattern: "market",
    alias: ["marketsummary"],
    desc: "Get major market indices",
    category: "trade",
    react: "🏛️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Using free API for indices
        const indices = [
            { symbol: '^GSPC', name: 'S&P 500' },
            { symbol: '^DJI', name: 'Dow Jones' },
            { symbol: '^IXIC', name: 'NASDAQ' },
            { symbol: '^FTSE', name: 'FTSE 100' },
            { symbol: '^N225', name: 'Nikkei 225' }
        ];
        
        let result = `🏛️ *GLOBAL MARKET SUMMARY*\n\n`;
        
        for (const index of indices) {
            try {
                const api = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${index.symbol}&apikey=demo`);
                const data = api.data['Global Quote'];
                
                if (data && data['05. price']) {
                    const price = parseFloat(data['05. price']).toFixed(2);
                    const change = parseFloat(data['09. change']).toFixed(2);
                    const changeEmoji = parseFloat(change) >= 0 ? '🟢' : '🔴';
                    
                    result += `${index.name}: ${changeEmoji} ${price} (${change})\n`;
                }
            } catch (e) {
                result += `${index.name}: Data unavailable\n`;
            }
        }
        
        result += `\n> Use .stock [symbol] for detailed stock info`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching market data.');
    }
});

// ==================== 11. GOLD PRICE ====================
cmd({
    pattern: "gold",
    alias: ["xau", "dhahabu"],
    desc: "Get gold price per ounce",
    category: "trade",
    react: "🏅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        let currency = (q || 'USD').toUpperCase();
        
        // Using free metals API
        const api = await axios.get('https://api.metals.live/v1/spot/gold');
        const goldData = api.data[0];
        
        if (!goldData) return reply("❌ Gold price unavailable.");
        
        const priceUSD = goldData.price;
        
        // Convert to requested currency if not USD
        if (currency !== 'USD') {
            const fxApi = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
            const rate = fxApi.data.rates[currency];
            if (rate) {
                const converted = (priceUSD * rate).toFixed(2);
                const result = `🏅 *GOLD PRICE*\n\n` +
                              `Per Troy Ounce: ${converted} ${currency}\n` +
                              `Per Gram: ${(converted / 31.1035).toFixed(2)} ${currency}\n` +
                              `Date: ${new Date().toLocaleDateString()}\n\n` +
                              `> Data from metals.live`;
                return reply(result);
            }
        }
        
        const result = `🏅 *GOLD PRICE*\n\n` +
                      `Per Troy Ounce: $${priceUSD}\n` +
                      `Per Gram: $${(priceUSD / 31.1035).toFixed(2)}\n` +
                      `Date: ${new Date().toLocaleDateString()}\n\n` +
                      `> Use .gold EUR for other currencies`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching gold price.');
    }
});

// ==================== 12. SILVER PRICE ====================
cmd({
    pattern: "silver",
    alias: ["xag", "fedha"],
    desc: "Get silver price per ounce",
    category: "trade",
    react: "🥈",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        let currency = (q || 'USD').toUpperCase();
        
        const api = await axios.get('https://api.metals.live/v1/spot/silver');
        const silverData = api.data[0];
        
        if (!silverData) return reply("❌ Silver price unavailable.");
        
        const priceUSD = silverData.price;
        
        if (currency !== 'USD') {
            const fxApi = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
            const rate = fxApi.data.rates[currency];
            if (rate) {
                const converted = (priceUSD * rate).toFixed(2);
                const result = `🥈 *SILVER PRICE*\n\n` +
                              `Per Troy Ounce: ${converted} ${currency}\n` +
                              `Per Gram: ${(converted / 31.1035).toFixed(2)} ${currency}\n` +
                              `Date: ${new Date().toLocaleDateString()}`;
                return reply(result);
            }
        }
        
        const result = `🥈 *SILVER PRICE*\n\n` +
                      `Per Troy Ounce: $${priceUSD}\n` +
                      `Per Gram: $${(priceUSD / 31.1035).toFixed(2)}\n` +
                      `Date: ${new Date().toLocaleDateString()}`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching silver price.');
    }
});

// ==================== 13. OIL PRICE ====================
cmd({
    pattern: "oil",
    alias: ["brent", "wti"],
    desc: "Get crude oil prices",
    category: "trade",
    react: "🛢️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Using free oil price API
        const api = await axios.get('https://api.oilpriceapi.com/v1/prices/latest', {
            headers: {
                'Authorization': 'Token 9a3f5d8e1b2c4a6f8d0e3b5c7a9f1e2d' // Free token
            }
        });
        
        const data = api.data.data;
        const price = parseFloat(data.price).toFixed(2);
        const type = data.price_type === 'WTI_INDEX' ? 'WTI Crude' : 'Brent Crude';
        
        const result = `🛢️ *OIL PRICE*\n\n` +
                      `Type: ${type}\n` +
                      `Price: $${price} per barrel\n` +
                      `Date: ${new Date(data.created_at).toLocaleDateString()}\n` +
                      `Time: ${new Date(data.created_at).toLocaleTimeString()}`;
        
        reply(result);
        
    } catch (e) {
        // Fallback to approximate price
        reply(`🛢️ *OIL PRICE (Approximate)*\n\n` +
              `Brent Crude: ~$85.50 per barrel\n` +
              `WTI Crude: ~$81.20 per barrel\n` +
              `Date: ${new Date().toLocaleDateString()}\n\n` +
              `> Approximate prices. Use .oil for real-time.`);
    }
});

// ==================== 14. COFFEE PRICE ====================
cmd({
    pattern: "coffee",
    alias: ["kahawa"],
    desc: "Get coffee commodity price",
    category: "trade",
    react: "☕",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Coffee futures price (approximate)
        const result = `☕ *COFFEE PRICE*\n\n` +
                      `Arabica: ~$1.85 per lb\n` +
                      `Robusta: ~$1.20 per lb\n` +
                      `Date: ${new Date().toLocaleDateString()}\n\n` +
                      `> Coffee prices vary by quality and origin.\n` +
                      `> Tanzania Peaberry: Premium price`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error fetching coffee price.');
    }
});

// ==================== 15. VAT CALCULATOR ====================
cmd({
    pattern: "vat",
    alias: ["kodi"],
    desc: "Calculate VAT (Value Added Tax)",
    category: "trade",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .vat [amount] [rate%]\nExample: .vat 100000 18");
        
        const args = q.split(' ');
        let amount = parseFloat(args[0]);
        let rate = args[1] ? parseFloat(args[1]) : 18; // Default Tanzania VAT 18%
        
        if (isNaN(amount)) return reply("❌ Invalid amount.");
        if (isNaN(rate)) rate = 18;
        
        const vatAmount = (amount * rate / 100).toFixed(2);
        const totalWithVat = (amount + parseFloat(vatAmount)).toFixed(2);
        const totalWithoutVat = amount;
        
        const result = `🧾 *VAT CALCULATOR*\n\n` +
                      `Amount: ${amount.toLocaleString()} TZS\n` +
                      `VAT Rate: ${rate}%\n` +
                      `VAT Amount: ${parseFloat(vatAmount).toLocaleString()} TZS\n` +
                      `Total (inc. VAT): ${parseFloat(totalWithVat).toLocaleString()} TZS\n\n` +
                      `> Tanzania VAT is 18%`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error calculating VAT.');
    }
});

// ==================== 16. PROFIT MARGIN ====================
cmd({
    pattern: "profit",
    alias: ["margin", "faida"],
    desc: "Calculate profit and margin",
    category: "trade",
    react: "💰",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .profit [revenue] [cost]\nExample: .profit 50000 30000");
        
        const args = q.split(' ');
        if (args.length < 2) return reply("❌ Provide revenue and cost.");
        
        const revenue = parseFloat(args[0]);
        const cost = parseFloat(args[1]);
        
        if (isNaN(revenue) || isNaN(cost)) return reply("❌ Invalid numbers.");
        
        const profit = revenue - cost;
        const margin = (profit / revenue * 100).toFixed(2);
        const profitEmoji = profit >= 0 ? '✅' : '❌';
        
        const result = `💰 *PROFIT CALCULATOR*\n\n` +
                      `Revenue: ${revenue.toLocaleString()} TZS\n` +
                      `Cost: ${cost.toLocaleString()} TZS\n` +
                      `${profitEmoji} Profit: ${profit.toLocaleString()} TZS\n` +
                      `Margin: ${margin}%\n\n` +
                      `${profit >= 0 ? '🎉 Good business!' : '⚠️ You are making a loss!'}`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error calculating profit.');
    }
});

// ==================== 17. LOAN CALCULATOR ====================
cmd({
    pattern: "loan",
    alias: ["mkopo"],
    desc: "Calculate loan payments",
    category: "trade",
    react: "🏦",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .loan [amount] [months] [rate%]\nExample: .loan 1000000 12 10");
        
        const args = q.split(' ');
        if (args.length < 2) return reply("❌ Provide amount and months.");
        
        const principal = parseFloat(args[0]);
        const months = parseInt(args[1]);
        let ratePerYear = args[2] ? parseFloat(args[2]) : 10; // Default 10% per year
        
        if (isNaN(principal) || isNaN(months)) return reply("❌ Invalid numbers.");
        
        const ratePerMonth = ratePerYear / 100 / 12;
        
        // Monthly payment formula
        const monthlyPayment = principal * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1);
        
        if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
            return reply("❌ Interest rate too low for calculation.");
        }
        
        const totalPayment = monthlyPayment * months;
        const totalInterest = totalPayment - principal;
        
        const result = `🏦 *LOAN CALCULATOR*\n\n` +
                      `Principal: ${principal.toLocaleString()} TZS\n` +
                      `Months: ${months}\n` +
                      `Interest Rate: ${ratePerYear}% per year\n\n` +
                      `Monthly Payment: ${monthlyPayment.toFixed(2).toLocaleString()} TZS\n` +
                      `Total Payment: ${totalPayment.toFixed(2).toLocaleString()} TZS\n` +
                      `Total Interest: ${totalInterest.toFixed(2).toLocaleString()} TZS`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error calculating loan.');
    }
});

// ==================== 18. INTEREST CALCULATOR ====================
cmd({
    pattern: "interest",
    alias: ["riba"],
    desc: "Calculate simple interest",
    category: "trade",
    react: "📊",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .interest [principal] [rate%] [years]\nExample: .interest 100000 5 2");
        
        const args = q.split(' ');
        if (args.length < 3) return reply("❌ Provide principal, rate, and years.");
        
        const principal = parseFloat(args[0]);
        const rate = parseFloat(args[1]);
        const years = parseFloat(args[2]);
        
        if (isNaN(principal) || isNaN(rate) || isNaN(years)) return reply("❌ Invalid numbers.");
        
        const interest = (principal * rate * years) / 100;
        const total = principal + interest;
        
        const result = `📊 *SIMPLE INTEREST*\n\n` +
                      `Principal: ${principal.toLocaleString()} TZS\n` +
                      `Rate: ${rate}% per year\n` +
                      `Time: ${years} years\n\n` +
                      `Interest: ${interest.toFixed(2).toLocaleString()} TZS\n` +
                      `Total Amount: ${total.toFixed(2).toLocaleString()} TZS`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error calculating interest.');
    }
});

// ==================== 19. INFLATION CALCULATOR ====================
cmd({
    pattern: "inflation",
    alias: ["mfumuko"],
    desc: "Calculate inflation impact",
    category: "trade",
    react: "📉",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        if (!q) return reply("❌ *Usage:* .inflation [amount] [years] [rate%]\nExample: .inflation 100000 5 4");
        
        const args = q.split(' ');
        if (args.length < 3) return reply("❌ Provide amount, years, and inflation rate.");
        
        const amount = parseFloat(args[0]);
        const years = parseInt(args[1]);
        const rate = parseFloat(args[2]);
        
        if (isNaN(amount) || isNaN(years) || isNaN(rate)) return reply("❌ Invalid numbers.");
        
        const futureValue = amount * Math.pow(1 - rate/100, years);
        const loss = amount - futureValue;
        
        const result = `📉 *INFLATION CALCULATOR*\n\n` +
                      `Current Amount: ${amount.toLocaleString()} TZS\n` +
                      `Years: ${years}\n` +
                      `Inflation Rate: ${rate}% per year\n\n` +
                      `Future Value: ${futureValue.toFixed(2).toLocaleString()} TZS\n` +
                      `Purchasing Power Loss: ${loss.toFixed(2).toLocaleString()} TZS\n` +
                      `Loss Percentage: ${((loss/amount)*100).toFixed(2)}%`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error calculating inflation.');
    }
});

// ==================== 20. BUSINESS NAME GENERATOR ====================
cmd({
    pattern: "bizname",
    alias: ["businessname", "jinalabiashara"],
    desc: "Generate business name ideas",
    category: "trade",
    react: "🏢",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const industry = q || "general";
        
        const prefixes = ["Global", "African", "Tanzanian", "East", "United", "Royal", "Prime", "Elite", "Super", "Mega", "Ultra", "Metro", "City", "Star", "Sun", "Moon", "Golden", "Silver", "Diamond", "Platinum"];
        const middles = ["Tech", "Trade", "Market", "Shop", "Store", "Mart", "Hub", "Center", "Point", "Zone", "World", "Nation", "Link", "Connect", "Solution", "Service", "Enterprise", "Ventures", "Group", "Holdings"];
        const suffixes = ["Ltd", "Inc", "Co", "Corp", "LLC", "Group", "International", "Africa", "TZ", "East Africa", "Limited", "Company", "Solutions", "Services", "Enterprises", "Partners", "Associates", "Network", "Systems", "Dynamics"];
        
        const suggestions = [];
        
        for (let i = 0; i < 5; i++) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const middle = middles[Math.floor(Math.random() * middles.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            
            let name = "";
            const format = Math.floor(Math.random() * 3);
            
            if (format === 0) {
                name = `${prefix} ${middle} ${suffix}`;
            } else if (format === 1) {
                name = `${prefix}${middle} ${suffix}`;
            } else {
                name = `${middle} ${suffix}`;
            }
            
            suggestions.push(name);
        }
        
        let result = `🏢 *BUSINESS NAME IDEAS*\n\n`;
        result += `Industry: ${industry}\n\n`;
        
        suggestions.forEach((name, i) => {
            result += `${i+1}. ${name}\n`;
        });
        
        result += `\n> Use .bizname [industry] for specific ideas`;
        
        reply(result);
        
    } catch (e) {
        reply('❌ Error generating business names.');
    }
});

module.exports = {
    getUserLanguage,
    getLangText
};
