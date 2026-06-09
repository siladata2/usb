const { cmd } = require("../command");
const axios = require("axios");

// Fake vCard for quoting
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝙵𝚄𝙽"
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

// ==================== 1. FAKTA ACAK ====================
cmd({
    pattern: "fakta",
    alias: ["fact", "randomfact"],
    desc: "Fakta acak unajua?",
    category: "fun",
    react: "🤔",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const facts = [
            "Kuna wanyama wanaoweza kuota usingizi wakiwa wamesimama! 🦒",
            "Ndovu ndio wanyama pekee wasioweza kuruka. (Obviously 😅)",
            "Panya wanaweza kucheka wanapopepeswa! 🐭",
            "Nyuki wana macho matano! 🐝",
            "Jicho la mbuni ni kubwa kuliko ubongo wake! 🦩",
            "Kwenye mwezi unaweza kuruka mara 6 ya juu kuliko hapa duniani! 🌕",
            "Bata ndio wanyama pekee wasio na meno! 🦆",
            "Kifua chako kinapanuka unapopumua, si moyo wako unaopanuka! ❤️",
            "Siku ya Jumatano inaitwa hivyo kwa sababu ni siku ya 3 ya juma? 🤯",
            "Mikono yako ina takriban nyuzi 29 za neva! 🖐️",
            "Simba anaweza kulala kwa saa 20 kwa siku! 🦁",
            "Nyani wanatambua picha zao kwenye kioo! 🐒",
            "Korongo ndio ndege wanaoruka juu zaidi! 🦅",
            "Nyuki wanacheza dansi kuwaambia wenzao wapi maua yalipo! 💃",
            "Mamba hawawezi kutoka ndimi zao! 🐊",
            "Kiboko anazalisha jasho jekundu! 🦛",
            "Chura anaweza kuruka zaidi ya urefu wake mara 50! 🐸",
            "Nyoka wanaweza kupumua kwa ngozi zao! 🐍",
            "Twiga ana ulimi mweusi wa urefu wa futi 2! 🦒",
            "Pweza ana nyoyo tatu! 🐙"
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        reply(`🤔 *FAKTA UNG'AMU*\n\n${randomFact}`);
    } catch (e) {
        reply('❌ Samahani, kuna tatizo.');
    }
});

// ==================== 2. KARMA CHECK ====================
cmd({
    pattern: "karma",
    alias: ["checkkarma"],
    desc: "Angalia karma yako leo",
    category: "fun",
    react: "⚖️",
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const karmas = [
            "⭐ Bora! Leo utapata mema mengi!",
            "🌟 Nzuri sana! Watu watakusaidia leo.",
            "✨ Wastani! Jihadharini na maamuzi yako.",
            "🌙 Chini! Usiwadhulumu wengine leo.",
            "⚡ Inayotetemeka! Weka nia njema.",
            "💫 Safi! Karma yako inakupenda.",
            "🌤️ Ya kawaida! Siku njayo itakuwa bora.",
            "🌈 Nzuri! Utabarikiwa leo.",
            "🌧️ Mbaya! Toa sadaka kupunguza.",
            "🔥 Moto! Karma yako inawaka leo!"
        ];
        const randomKarma = karmas[Math.floor(Math.random() * karmas.length)];
        const username = pushname || sender.split('@')[0];
        reply(`⚖️ *KARMA YA ${username.toUpperCase()}*\n\n${randomKarma}`);
    } catch (e) {
        reply('❌ Karma check failed.');
    }
});

// ==================== 3. JINA LA NDOTO ====================
cmd({
    pattern: "dreamname",
    alias: ["jinalandoto", "dream"],
    desc: "Pata jina lako la ndoto",
    category: "fun",
    react: "💭",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Andika jina lako!*\nExample: .dreamname John");
        
        const prefixes = ["Mfalme", "Malkia", "Daktari", "Profesa", "Shehe", "Bwana", "Bibi", "Kapiteni", "Sheikh", "Sultan"];
        const suffixes = ["wa Usiku", "wa Mwezi", "wa Nyota", "wa Maji", "wa Moto", "wa Hewa", "wa Ardhi", "wa Bahari", "wa Jangwa", "wa Msitu"];
        const powers = ["Mwenye Nguvu", "Mwenye Hekima", "Mwenye Upendo", "Mwenye Ushindi", "Mwenye Furaha", "Mwenye Baraka", "Mwenye Siri", "Mwenye Ngoma", "Mwenye Simba", "Mwenye Chui"];
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomPower = powers[Math.floor(Math.random() * powers.length)];
        
        const dreamName = `${randomPrefix} ${q} ${randomSuffix}, ${randomPower}`;
        
        reply(`💭 *JINA LAKO LA NDOTO*\n\n${dreamName}`);
    } catch (e) {
        reply('❌ Failed to generate dream name.');
    }
});

// ==================== 4. FUTA CHAT ====================
cmd({
    pattern: "futa",
    alias: ["deletechat", "futachat"],
    desc: "Futa ujumbe wa mwisho (kwa utani)",
    category: "fun",
    react: "🧹",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const responses = [
            "🧹 *Poof!* Ujumbe umetoweka! (Hata kama hauoni...)",
            "✨ *Magic!* Ujumbe umefutika! (Ndoto tu...)",
            "💨 *Fsssshhh!* Umefutika! (Au la?)",
            "🪄 *Abracadabra!* Imefutwa! (Kichawi hii...)",
            "🗑️ *Dropped in trash!* (Lakini bado unaweza kuona...)",
            "🌪️ *Kimbunga!* Kimechukua ujumbe! (Labda...)",
            "🚮 *Deleted!* (Hivi kweli?)",
            "💥 *Boom!* Imelipuka! (Bado ipo...)",
            "🕳️ *Imeanguka shimoni!* (Haidhuru...)",
            "🌫️ *Imekwenda moshi!* (Hehehe)"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        reply(randomResponse);
    } catch (e) {
        reply('❌ Failed to delete.');
    }
});

// ==================== 5. TIMU YA NDOTO ====================
cmd({
    pattern: "dreamteam",
    alias: ["timu", "team"],
    desc: "Unda timu yako ya ndoto",
    category: "fun",
    react: "⚽",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Andika jina la timu!*\nExample: .dreamteam Simba");
        
        const players = [
            "Messi", "Ronaldo", "Neymar", "Mbappe", "Haaland", 
            "Salah", "Man\u00e9", "Kante", "Van Dijk", "Ramos",
            "Modric", "De Bruyne", "Lewandowski", "Benzema", "Kane",
            "Maguire (kicheko!)", "Mikidadi", "Samatta", "Msuva", "Drogba"
        ];
        
        const coaches = ["Guardiola", "Klopp", "Ancelotti", "Zidane", "Mourinho", "Ten Hag", "Arteta", "Pochettino"];
        
        // Select random players
        const selectedPlayers = [];
        for (let i = 0; i < 11; i++) {
            const randomIndex = Math.floor(Math.random() * players.length);
            selectedPlayers.push(players[randomIndex]);
        }
        
        const randomCoach = coaches[Math.floor(Math.random() * coaches.length)];
        
        let teamMsg = `⚽ *TIMU YA NDOTO: ${q.toUpperCase()}*\n\n`;
        teamMsg += `*Kocha:* ${randomCoach}\n\n`;
        teamMsg += `*Wachezaji:*\n`;
        selectedPlayers.forEach((player, i) => {
            teamMsg += `${i+1}. ${player}\n`;
        });
        
        reply(teamMsg);
    } catch (e) {
        reply('❌ Failed to create dream team.');
    }
});

// ==================== 6. USEME UKWELI ====================
cmd({
    pattern: "truth",
    alias: ["ukweli", "kweli"],
    desc: "Swali la ukweli",
    category: "fun",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const truths = [
            "Umewahi kumwambia mtu 'nakupenda' kisha ukabadilisha mawazo?",
            "Ni kitu gani kibaya zaidi umewahi kufanya shuleni?",
            "Umewahi kumtengenezea mtu chakula kisha ukatema ndani?",
            "Nani anapiga chafya vibaya zaidi unayemjua?",
            "Umewahi kuingia chumba kisha ukasahau kwanini?",
            "Umewahi kuiba kitu dukani?",
            "Ni nani wa mwisho kumuona akilia?",
            "Umewahi kujifanya mgonjwa kukwepa shule/kazi?",
            "Ni wazo gani la ajabu uliowahi kuwa nalo?",
            "Umewahi kumpigia mtu simu kwa bahati mbaya?",
            "Umewahi kumwita mtu jina la mwengine kitandani? 😳",
            "Ni nani anayekufurahisha zaidi?",
            "Umewahi kukaa choo na simu kwa saa nzima?",
            "Umewahi kumwangalia mtu akitembea kisha ukagundua si yule?",
            "Umewahi kuwa na ndoto ya mtu wa kiume/ kike?",
            "Umewahi kusema 'nakupenda' kwa bahati mbaya?",
            "Ni nani anayekasirika kwa urahisi zaidi?",
            "Umewahi kunusa soksi zako kuzijua zina harufu? 🧦",
            "Umewahi kucheka peke yako kisha ukaangalia kama kuna mtu?",
            "Umewahi kujisemea wewe mwenyewe kiooni?"
        ];
        const randomTruth = truths[Math.floor(Math.random() * truths.length)];
        reply(`🔍 *TRUTH DARE*\n\n${randomTruth}`);
    } catch (e) {
        reply('❌ Truth failed.');
    }
});

// ==================== 7. UBATIZI WA SIMU ====================
cmd({
    pattern: "baptism",
    alias: ["batiza", "ubatizo"],
    desc: "Batiza simu yako kwa majina ya ajabu",
    category: "fun",
    react: "💧",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Andika brand ya simu yako!*\nExample: .baptism Samsung");
        
        const baptismNames = [
            "Mfalme wa Ngoma 📱",
            "Kidude cha Kutongoza 💘",
            "Kibubu cha Mtaa 🏠",
            "Kipande cha Ajabu ✨",
            "Mchezeshaji wa Roho 👻",
            "Kifaa cha Kutisha 😱",
            "Kasheshe la Kielektroniki ⚡",
            "Kidude cha Kukamata 📸",
            "Kipumbuzi cha Mawasiliano 📞",
            "Kichawi cha Mkono 🪄",
            "Bombomu ya Mawasiliano 💣",
            "Kipande cha Mungu 🙏",
            "Kiburudisho cha Moyo ❤️",
            "Kifaa cha Kutengeneza Pesas 💰",
            "Kichekesho cha Digital 😂",
            "Kipaji cha Teknolojia 🚀",
            "Kidude cha Kukera 🤪",
            "Kiboko cha Mawasiliano 🦛",
            "Kipande cha Faraja 😌",
            "Kiburudisho cha Akili 🧠"
        ];
        
        const randomName = baptismNames[Math.floor(Math.random() * baptismNames.length)];
        reply(`💧 *UMEBATIZA SIMU YAKO*\n\nSimu yako ya *${q}* sasa inaitwa:\n\n"${randomName}"\n\nAmina! 🙏`);
    } catch (e) {
        reply('❌ Baptism failed.');
    }
});

// ==================== 8. TIMETRAVEL ====================
cmd({
    pattern: "timetravel",
    alias: ["safirizamani", "traveltime"],
    desc: "Tuma ujumbe kwenda zamani au mbeleni",
    category: "fun",
    react: "⏰",
    filename: __filename
}, async (conn, mek, m, { from, q, pushname, reply }) => {
    try {
        if (!q) return reply("❌ *Andika ujumbe wako!*\nExample: .timetravel Nimepata bahati nasibu!");
        
        const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030, 2050];
        const randomYear = years[Math.floor(Math.random() * years.length)];
        const direction = randomYear > 2024 ? "🏃 *MBELENI*" : "⏪ *ZAMANI*";
        
        const responses = [
            `⏰ *TIMETRAVEL ACTIVATED*\n\nUjumbe wako umetumwa kwenda *mwaka ${randomYear}* (${direction})\n\n"${q}"\n\nWatu wa mwaka ${randomYear} wameupokea!`,
            `🚀 *VOYAGE TEMPOREL*\n\nMessage envoyé à l'année ${randomYear}\n\n"${q}"\n\nIls ont bien reçu!`,
            `⏳ *SAFARI YA WAKATI*\n\nUmesafirisha ujumbe hadi *${randomYear}*\n\nWatakupigia simu wakifika... 😅`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        reply(randomResponse);
    } catch (e) {
        reply('❌ Time travel failed.');
    }
});

// ==================== 9. KIDUDE CHA LEO ====================
cmd({
    pattern: "kidude",
    alias: ["thing", "object"],
    desc: "Pata kidude chako cha leo",
    category: "fun",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const kidudes = [
            "🧹 *Fagio* - Leo utafagia mambo mabaya maishani mwako!",
            "🪣 *Ndoo* - Leo utabeba baraka nyingi!",
            "🔑 *Ufunguo* - Leo utafungua milango ya fursa!",
            "🧦 *Soksi* - Leo utatembea kwa urahisi!",
            "🕯️ *Mshumaa* - Leo utaangaza kwa wengine!",
            "📱 *Simu* - Leo utapokea habari njema!",
            "💍 *Pete* - Leo utapata ahadi au agano!",
            "🧢 *Kofia* - Leo utalindwa na jua kali!",
            "🥄 *Kijiko* - Leo utakula kwa furaha!",
            "🪑 *Kiti* - Leo utapumzika baada ya kazi!",
            "🧺 *Kapu* - Leo utabeba mizigo ya wengine!",
            "🪓 *Shoka* - Leo utakata matatizo!",
            "🧵 *Uzi* - Leo utaunganisha watu!",
            "🧴 *Mafuta* - Leo utapaka upako wa baraka!",
            "🧲 *Sumaku* - Leo utavutia bahati!",
            "🧪 *Kikombe* - Leo utapima mambo mapya!",
            "🧷 *Kipande* - Leo utaunganisha familia!",
            "🧮 *Abacus* - Leo utahesabu baraka zako!",
            "🧰 *Sanduku* - Leo utarekebisha mahusiano!",
            "🧳 *Msafara* - Leo utasafiri kwa mafanikio!"
        ];
        
        const randomKidude = kidudes[Math.floor(Math.random() * kidudes.length)];
        reply(`📦 *KIDUDE CHAKO CHA LEO, ${pushname.toUpperCase()}*\n\n${randomKidude}`);
    } catch (e) {
        reply('❌ Kidude failed.');
    }
});

// ==================== 10. PUNGUZA UZITO ====================
cmd({
    pattern: "diet",
    alias: ["punguza", "weightloss"],
    desc: "Pata mpango wa kupunguza uzito (utani)",
    category: "fun",
    react: "🥗",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Andika uzito wako!*\nExample: .diet 80kg");
        
        const diets = [
            "Kula wali mara moja kwa wiki tu! 🍚",
            "Kunywa maji lita 10 kwa siku! 💧",
            "Kukimbia kilomita 5 kabla ya chai ya asubuhi! 🏃",
            "Kula matunda pekee kwa siku 7! 🍎",
            "Kucheza ngoma kwa saa 2 kila siku! 💃",
            "Kupanda ngazi badala ya lifti! 🪜",
            "Kula viazi na mayai tu! 🥔",
            "Kutembea kwa miguu kila mahali! 🚶",
            "Kuepuka sukari kabisa! 🚫",
            "Kula ndizi 5 asubuhi! 🍌",
            "Kunywa chai ya maboga! 🫖",
            "Kula karanga badala ya chips! 🥜",
            "Kufanya press-ups 100 kila asubuhi! 💪",
            "Kula samaki na mboga tu! 🐟",
            "Kunywa maji ya nanasi! 🍍",
            "Kula matunda ya msitu! 🫐",
            "Kuepuka vinywaji baridi! ❄️",
            "Kula viazi vitamin! 🥕",
            "Kucheza mpira kwa saa 3! ⚽",
            "Kulala mapema na kuamka mapema! 🌅"
        ];
        
        const randomDiet = diets[Math.floor(Math.random() * diets.length)];
        reply(`🥗 *MPANGO WA KUPUNGUZA UZITO WAKO WA ${q}*\n\n${randomDiet}\n\n*Matokeo:* Uzito wako utakuwa ${Math.floor(parseInt(q) * 0.8)}kg baada ya wiki 4!`);
    } catch (e) {
        reply('❌ Diet plan failed.');
    }
});

// ==================== 11. NJAA AU NJE ====================
cmd({
    pattern: "inout",
    alias: ["ndani", "nje"],
    desc: "Angalia kama wewe ni ndani au nje ya mambo",
    category: "fun",
    react: "🚪",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const inout = Math.random() > 0.5 ? "NDANI ✅" : "NJE ❌";
        const reasons = {
            "NDANI ✅": [
                "Una mambo mengi ya kujadili!",
                "Watu wanakuhitaji leo!",
                "Una bahati nzuri leo!",
                "Wewe ndiye kiini cha mambo!",
                "Huwezi kukosa leo!"
            ],
            "NJE ❌": [
                "Leo ni siku yako ya kupumzika!",
                "Watu wanakupumzisha leo!",
                "Kaa pembeni utazame tu!",
                "Usijali, kesho utakuwa ndani!",
                "Nje ndipo ulipo salama!"
            ]
        };
        
        const status = inout;
        const reason = reasons[status][Math.floor(Math.random() * reasons[status].length)];
        
        reply(`🚪 *${pushname} YUKO ${status}*\n\n${reason}`);
    } catch (e) {
        reply('❌ Inout failed.');
    }
});

// ==================== 12. UBAYA WA LEO ====================
cmd({
    pattern: "ubaya",
    alias: ["evil", "uovu"],
    desc: "Pata ubaya wako wa leo",
    category: "fun",
    react: "😈",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const ubayas = [
            "Kuwacheka wenzao wanapojikwaa! 😈",
            "Kula chakula cha wengine kimya kimya! 🤫",
            "Kusema uongo mdogo tu! 🤥",
            "Kukatiza mtu anapoongea! 🗣️",
            "Kutazama simu ya mtu bila ruhusa! 👀",
            "Kujifanya hujui ulichofanya! 😇 (Lakini si kweli)",
            "Kutoa kitu kisha kukitaka tena! 🔄",
            "Kusema 'nakuja' wakati huna mpango! 🚶",
            "Kupiga miayo mtu anaongea! 🥱",
            "Kutumia simu mezani wakati wa chakula! 📱",
            "Kuchelewa kwa miadi kwa makusudi! ⏰",
            "Kusema 'nitakupigia' huna nia! 📞",
            "Kukopa pesa kisha kusahau! 💰",
            "Kula kitoweo cha wengine! 🍗",
            "Kujifanya usingizi wakati wa kazi! 😴",
            "Kutumia Wi-Fi ya jirani! 📶",
            "Kunusa chakula cha mtu! 👃",
            "Kuangalia saa mara nyingi mtu anaongea! ⌚",
            "Kutoa comment mbaya kwenye picha! 📸",
            "Kusema 'nimekupata' kisha ukose namba! 📞"
        ];
        
        const randomUbaya = ubayas[Math.floor(Math.random() * ubayas.length)];
        reply(`😈 *UBAYA WAKO WA LEO*\n\n${randomUbaya}`);
    } catch (e) {
        reply('❌ Ubaya failed.');
    }
});

// ==================== 13. JINA LA MTANI ====================
cmd({
    pattern: "mtani",
    alias: ["nickname", "jinalautani"],
    desc: "Pata jina lako la utani",
    category: "fun",
    react: "😜",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ *Andika jina lako!*\nExample: .mtani Juma");
        
        const prefixes = ["Mkali", "Mcheshi", "Mtanashati", "Mvivu", "Mchapa kazi", "Mlafi", "Mlevi", "Mshenzi", "Mzungu", "Mwarabu"];
        const suffixes = ["wa Nyumba", "wa Mtaa", "wa Shule", "wa Kanisa", "wa Msikitini", "wa Kazini", "wa Uwanjani", "wa Mgahawani", "wa Bomani", "wa Bondeni"];
        const animals = ["Fisi", "Nyani", "Panya", "Kiboko", "Twiga", "Simba", "Chui", "Duma", "Kobe", "Nguruwe"];
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        
        const nickname = `${randomPrefix} ${q} ${randomSuffix} (${randomAnimal})`;
        
        reply(`😜 *JINA LAKO LA UTANI*\n\n"${nickname}"`);
    } catch (e) {
        reply('❌ Mtani failed.');
    }
});

// ==================== 14. SAHIHISHA MAISHA ====================
cmd({
    pattern: "fixlife",
    alias: ["sahihisha", "reform"],
    desc: "Pata ushauri wa kusahihisha maisha yako",
    category: "fun",
    react: "🛠️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const advices = [
            "Acha kufikiria sana, anza kufanya! 🚀",
            "Usiwape watu nafasi nyingi, wanaweza kukuumiza! 🛡️",
            "Kula vizuri, usingizi ni wa mwisho! 🍽️",
            "Pumzika, dunia haitaisha kesho! 😴",
            "Weka pesa kando, siku ya mvua haijui! 💰",
            "Wasamehe waliokukosea, usijichukie! 🕊️",
            "Tembea, hewa safi inatakiwa! 🚶",
            "Acha kujilinganisha na wengine, wewe ni wewe! 🌟",
            "Semakweli hata kama inauma! 🗣️",
            "Usiwadharau wadogo, wanaweza kukushinda! 🐜",
            "Jifunze kusema HAPANA! 🚫",
            "Penda kazi yako, usiichukie! 💼",
            "Waheshimu wazazi wako, wana thamani! 👴👵",
            "Usiwe na wivu, ni sumu! ☠️",
            "Tabasamu, inapunguza stress! 😊",
            "Saidia maskini, Mungu atakusaidia! 🤲",
            "Usichelewe, muda hausubiri! ⏰",
            "Acha uvivu, anza sasa! 🔥",
            "Usilaumu wengine, jitazame kwanza! 👀",
            "Omba, Mungu yu hai! 🙏"
        ];
        
        const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
        reply(`🛠️ *USAHAURI WA KUSAHLIHISHA MAISHA*\n\n${randomAdvice}`);
    } catch (e) {
        reply('❌ Fixlife failed.');
    }
});

// ==================== 15. CHEMSHA BONGO ====================
cmd({
    pattern: "chemsha",
    alias: ["brainteaser", "riddle"],
    desc: "Chemsha bongo (kitendawili)",
    category: "fun",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const riddles = [
            {
                q: "Nina macho lakini sioni. Nina maji lakini siwezi kunywa. Mimi ni nani?",
                a: "Picha! 🖼️"
            },
            {
                q: "Ninaweza kujazwa lakini siwezi kumwagika. Mimi ni nani?",
                a: "Moyo! ❤️"
            },
            {
                q: "Ninafunika dunia nzima lakini nina ukubwa wa kiganja cha mkono. Mimi ni nani?",
                a: "Ramani! 🗺️"
            },
            {
                q: "Nina meno mengi lakini siwezi kula. Mimi ni nani?",
                a: "Kijiko! 🥄"
            },
            {
                q: "Nina mgongo lakini siwezi kubeba mzigo. Mimi ni nani?",
                a: "Kiti! 🪑"
            },
            {
                q: "Nina nywele nyingi lakini siwezi kujisuka. Mimi ni nani?",
                a: "Mswaki! 🪥"
            },
            {
                q: "Ninaweza kuruka bila mabawa. Mimi ni nani?",
                a: "Mpira! 🏀"
            },
            {
                q: "Nina shingo lakini siwezi kugeuza kichwa. Mimi ni nani?",
                a: "Chupa! 🍾"
            },
            {
                q: "Ninaweza kuingia ndani ya nyumba bila mlango. Mimi ni nani?",
                a: "Jua! ☀️"
            },
            {
                q: "Nina miguu minne lakini siwezi kutembea. Mimi ni nani?",
                a: "Meza! 🪑"
            }
        ];
        
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        reply(`🧠 *KITENDAWILI*\n\n*Swali:* ${randomRiddle.q}\n\n*Jibu:* ||${randomRiddle.a}||`);
    } catch (e) {
        reply('❌ Chemsha failed.');
    }
});

// ==================== 16. TABASAMA YA LEO ====================
cmd({
    pattern: "smile",
    alias: ["tabasamu", "cheka"],
    desc: "Pata kitu cha kukufanya utabasamu",
    category: "fun",
    react: "😊",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const smiles = [
            "Picha ya mtoto akicheka! 👶😄",
            "Video ya paka anayejikwaa! 🐱",
            "Mbwa anayekimbia mkia wake! 🐕",
            "Mtoto anayeiga sauti za wazazi! 🗣️",
            "Babuzi anayecheza ngoma! 👴💃",
            "Kuku anayetaga yai kisha kushtuka! 🐔🥚",
            "Bata anayeogelea kwenye ndoo! 🦆",
            "Nguruwe anayelala tumboni! 🐷",
            "Panya anayekula jibini kwa haraka! 🐭🧀",
            "Twiga anayejikuna sikio! 🦒",
            "Kiboko anayezimia jua! 🦛☀️",
            "Nyani anayepiga mayowe! 🐒",
            "Simba anayepiga miayo! 🦁",
            "Chui anayeficha uso! 🐆",
            "Kobe anayeshindana na sungura! 🐢🐇",
            "Nyoka anayejifunga! 🐍",
            "Chura anayeruka juu ya maji! 🐸",
            "Samaki anayeruka angani! 🐟",
            "Ndege anayeimba vibaya! 🐦",
            "Jua linapochomoka na mawingu! ☁️☀️"
        ];
        
        const randomSmile = smiles[Math.floor(Math.random() * smiles.length)];
        reply(`😊 *TABASAMU YA LEO*\n\n${randomSmile}`);
    } catch (e) {
        reply('❌ Smile failed.');
    }
});

// ==================== 17. MWILI WAKO ====================
cmd({
    pattern: "body",
    alias: ["mwili", "anatomy"],
    desc: "Pata sehemu ya mwili wako ya leo",
    category: "fun",
    react: "🦵",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const bodyParts = [
            "🦵 *Mguu wako wa kushoto* - Leo utatembea baraka!",
            "🦶 *Kidole chako cha mguu* - Leo utagusa bahati!",
            "👁️ *Jicho lako la kulia* - Leo utaona maajabu!",
            "👂 *Sikio lako la kushoto* - Leo utasikia habari njema!",
            "👃 *Pua yako* - Leo utanusia harufu nzuri!",
            "👄 *Mdomo wako* - Leo utasema maneno ya hekima!",
            "🦷 *Jino lako la mbele* - Leo utauma chakula kizuri!",
            "🫀 *Moyo wako* - Leo utapenda na kupendwa!",
            "🫁 *Mapafu yako* - Leo utapumua hewa safi!",
            "🧠 *Ubongo wako* - Leo utafikiri kwa busara!",
            "🖐️ *Kiganja chako cha kulia* - Leo utatoa na kupokea!",
            "🤚 *Kiganja chako cha kushoto* - Leo utashika fursa!",
            "💪 *Mkono wako wa kulia* - Leo utafanya kazi kwa nguvu!",
            "🦾 *Mkono wako wa kushoto* - Leo utasaidia wengine!",
            "🦵 *Paja lako la kulia* - Leo utakaa kwenye heshima!",
            "🦵 *Paja lako la kushoto* - Leo utasimama imara!",
            "🦶 *Kisigino chako* - Leo utaegemea kwenye imani!",
            "👁️ *Kope lako* - Leo utapepesa bahati!",
            "👄 *Ulimi wako* - Leo utaonja utamu wa maisha!",
            "🧠 *Fuvu lako* - Leo utalindwa na mawazo mabaya!"
        ];
        
        const randomPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
        reply(`🦵 *SEHEMU YA MWILI WAKO YA LEO, ${pushname}*\n\n${randomPart}`);
    } catch (e) {
        reply('❌ Body part failed.');
    }
});

// ==================== 18. SIKU YAKO YA LEO ====================
cmd({
    pattern: "myday",
    alias: ["sikuyangu", "hacks"],
    desc: "Pata hacks za siku yako",
    category: "fun",
    react: "📅",
    filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const days = [
            "Jumatatu 🙁",
            "Jumanne 😐",
            "Jumatano 🙂",
            "Alhamisi 😊",
            "Ijumaa 🎉",
            "Jumamosi 🎊",
            "Jumapili 😇"
        ];
        
        const randomDay = days[Math.floor(Math.random() * days.length)];
        
        const hacks = [
            `Kunywa maji mengi! 💧`,
            `Tabasamu kwa kila mtu! 😊`,
            `Usilaumu mtu yeyote! 🚫`,
            `Toa sadaka kwa furaha! 🤲`,
            `Piga simu kwa mzazi wako! 📞`,
            `Tembea kwa miguu! 🚶`,
            `Kula chakula cha afya! 🥗`,
            `Usikae sana kwenye simu! 📱`,
            `Saidia mtu maskini! 🤝`,
            `Omba kwa Mungu wako! 🙏`,
            `Cheka kwa nguvu leo! 😂`,
            `Usiwachane na marafiki! 👥`,
            `Jifunze kitu kipya! 📚`,
            `Andika mawazo yako! ✍️`,
            `Pumzika usingizi wa kutosha! 😴`,
            `Usile chakula cha jioni sana! 🌙`,
            `Vaa nguo safi na nzuri! 👔`,
            `Nyimba wimbo wa kiroho! 🎵`,
            `Tafuta fursa mpya! 🔍`,
            `Washukuru waliokusaidia! ❤️`
        ];
        
        const randomHack = hacks[Math.floor(Math.random() * hacks.length)];
        
        reply(`📅 *SIKU YAKO YA LEO, ${pushname}*\n\nLeo ni *${randomDay}*\n\n*Life Hack:* ${randomHack}`);
    } catch (e) {
        reply('❌ Myday failed.');
    }
});

// ==================== 19. CHUKUA HATUA ====================
cmd({
    pattern: "takeaction",
    alias: ["chukua", "act"],
    desc: "Pata hatua ya kuchukua leo",
    category: "fun",
    react: "🎯",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const actions = [
            "Panda mboga shambani! 🌱",
            "Oga mapema asubuhi! 🚿",
            "Pika chakula kwa upendo! 🍲",
            "Soma kurasa 10 za kitabu! 📖",
            "Tembea kilomita 1! 🏃",
            "Piga picha ya kukumbusha! 📸",
            "Andika shukrani 5! ✍️",
            "Panga chumba chako! 🧹",
            "Osha nguo zako! 👕",
            "Pika chai kwa wageni! 🫖",
            "Panda maua yatakayokua! 🌻",
            "Jifunze neno jipya la Kiingereza! 🇬🇧",
            "Piga simu kwa rafiki wa zamani! 📞",
            "Tembelea mgonjwa! 🏥",
            "Nunua kitu kwa ajili ya familia! 🛒",
            "Tengeneza kitu kilichoharibika! 🔧",
            "Tupa takataka zisizohitajika! 🗑️",
            "Paka mafuta mwilini! 🧴",
            "Kaa kimya kwa dakika 5! 🧘",
            "Cheza na watoto! 🧒"
        ];
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        reply(`🎯 *CHUKUA HATUA HII LEO*\n\n${randomAction}`);
    } catch (e) {
        reply('❌ Takeaction failed.');
    }
});

// ==================== 20. NAMBARI YA BAHATI ====================
cmd({
    pattern: "lucky",
    alias: ["bahati", "luckynumber"],
    desc: "Pata nambari yako ya bahati leo",
    category: "fun",
    react: "🍀",
    filename: __filename
}, async (conn, mek, m, { from, pushname, q, reply }) => {
    try {
        const name = q || pushname || "Rafiki";
        
        // Generate random numbers based on name
        let seed = 0;
        for (let i = 0; i < name.length; i++) {
            seed += name.charCodeAt(i);
        }
        
        const random = (min, max) => {
            const rand = Math.sin(seed++) * 10000;
            return Math.floor((rand - Math.floor(rand)) * (max - min + 1)) + min;
        };
        
        const luckyNumber = random(1, 99);
        const luckyColor = ["Nyekundu", "Bluu", "Kijani", "Njano", "Zambarau", "Machungwa", "Nyeusi", "Nyeupe", "Pink", "Dhahabu"][random(0, 9)];
        const luckyTime = `${random(1, 12)}:${random(0, 59).toString().padStart(2, '0')} ${random(0, 1) ? 'AM' : 'PM'}`;
        const luckyDirection = ["Kaskazini", "Kusini", "Mashariki", "Magharibi", "Kaskazini-Mashariki", "Kaskazini-Magharibi", "Kusini-Mashariki", "Kusini-Magharibi"][random(0, 7)];
        const luckyElement = ["Maji 💧", "Moto 🔥", "Udongo 🌍", "Hewa 💨", "Mti 🌳", "Chuma ⚙️"][random(0, 5)];
        const luckyMessage = [
            "Leo utapata bahati nasibu! 🎰",
            "Mtu atakupa zawadi leo! 🎁",
            "Usikate tamaa, ushindi uko karibu! 🏆",
            "Piga hatua leo, mafanikio yanakungoja! 🚀",
            "Tabasamu, leo ni siku yako! 😊",
            "Usikimbilie, subira yako italipa! ⏳",
            "Fanya kazi kwa bidii, matunda yatakuja! 🍎",
            "Waweza kufanikiwa leo! 💪",
            "Sikiliza sauti ya ndani yako! 🧠",
            "Usiwategemee watu sana, Mungu yupo! 🙏"
        ][random(0, 9)];
        
        const result = `🍀 *NAMBARI YA BAHATI KWA ${name.toUpperCase()}*\n\n` +
                      `🔢 *Nambari:* ${luckyNumber}\n` +
                      `🎨 *Rangi:* ${luckyColor}\n` +
                      `⏰ *Muda:* ${luckyTime}\n` +
                      `🧭 *Mwelekeo:* ${luckyDirection}\n` +
                      `✨ *Kipengele:* ${luckyElement}\n\n` +
                      `💌 *Ujumbe:* ${luckyMessage}`;
        
        reply(result);
    } catch (e) {
        reply('❌ Lucky number failed.');
    }
});
