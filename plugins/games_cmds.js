const { cmd } = require("../command");

// Fake vCard for quoting
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰 𝙶𝙰𝙼𝙴𝚂"
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

// Game data storage
const activeGames = {
    tictactoe: new Map(),
    guessNumber: new Map(),
    wordChain: new Map(),
    hangman: new Map(),
    quiz: new Map(),
    riddle: new Map(),
    mathQuiz: new Map(),
    emojiQuiz: new Map(),
    memory: new Map(),
    typingRace: new Map(),
    rockPaperScissors: new Map(),
    truthOrDare: new Map(),
    wouldYouRather: new Map(),
    wordScramble: new Map(),
    crossword: new Map(),
    sudoku: new Map(),
    chess: new Map(),
    checkers: new Map(),
    trivia: new Map(),
    hangmanClassic: new Map()
};

// ==================== 1. TIC TAC TOE ====================
cmd({
    pattern: "tictactoe",
    alias: ["ttt", "tic"],
    desc: "Play Tic Tac Toe with friend",
    category: "games",
    react: "⭕",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This game can only be played in groups!*");
        
        const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (mentioned.length === 0) {
            return reply("❌ *Mention someone to play with!*\nExample: .tictactoe @user");
        }
        
        const opponent = mentioned[0];
        if (opponent === sender) return reply("❌ *You cannot play with yourself!*");
        
        const gameId = from + sender;
        if (activeGames.tictactoe.has(gameId)) {
            return reply("❌ *You already have an active game!*");
        }
        
        // Initialize game
        const board = [
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜'],
            ['⬜', '⬜', '⬜']
        ];
        
        activeGames.tictactoe.set(gameId, {
            board,
            players: [sender, opponent],
            turn: sender,
            moves: 0
        });
        
        let boardDisplay = '';
        board.forEach(row => {
            boardDisplay += row.join(' ') + '\n';
        });
        
        await reply(`⭕ *TIC TAC TOE*\n\n${boardDisplay}\n🎮 ${sender.split('@')[0]} (X) vs ${opponent.split('@')[0]} (O)\n\n👉 It's *@${sender.split('@')[0]}'s* turn!\nUse .move <row> <col> (1-3)`, {
            contextInfo: { mentionedJid: [sender, opponent] }
        });
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

cmd({
    pattern: "move",
    alias: ["tttmove"],
    desc: "Make a move in Tic Tac Toe",
    category: "games",
    react: "🎯",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.tictactoe.get(gameId);
        
        if (!game) return reply("❌ *No active game!* Start one with .tictactoe");
        if (game.turn !== sender) return reply("❌ *Not your turn!*");
        
        const [row, col] = q.split(' ').map(Number);
        if (!row || !col || row < 1 || row > 3 || col < 1 || col > 3) {
            return reply("❌ *Invalid move!* Use .move <row> <col> (1-3)");
        }
        
        const board = game.board;
        if (board[row-1][col-1] !== '⬜') {
            return reply("❌ *Cell already taken!*");
        }
        
        // Make move
        const symbol = game.moves % 2 === 0 ? '❌' : '⭕';
        board[row-1][col-1] = symbol;
        game.moves++;
        
        // Check winner
        const winner = checkWinner(board);
        let boardDisplay = '';
        board.forEach(row => row.forEach(cell => boardDisplay += cell + ' '));
        
        if (winner) {
            activeGames.tictactoe.delete(gameId);
            return reply(`🎉 *WINNER!*\n\n${boardDisplay}\n\n👑 @${winner.split('@')[0]} wins!`, {
                contextInfo: { mentionedJid: [winner] }
            });
        }
        
        if (game.moves === 9) {
            activeGames.tictactoe.delete(gameId);
            return reply(`🤝 *DRAW!*\n\n${boardDisplay}\n\nGood game!`);
        }
        
        game.turn = game.players.find(p => p !== sender);
        boardDisplay = '';
        board.forEach(row => {
            boardDisplay += row.join(' ') + '\n';
        });
        
        reply(`⭕ *TIC TAC TOE*\n\n${boardDisplay}\n\n👉 It's *@${game.turn.split('@')[0]}'s* turn!`, {
            contextInfo: { mentionedJid: [game.turn] }
        });
        
    } catch (e) {
        reply('❌ Move error.');
    }
});

function checkWinner(board) {
    const lines = [
        [[0,0], [0,1], [0,2]], [[1,0], [1,1], [1,2]], [[2,0], [2,1], [2,2]], // rows
        [[0,0], [1,0], [2,0]], [[0,1], [1,1], [2,1]], [[0,2], [1,2], [2,2]], // columns
        [[0,0], [1,1], [2,2]], [[0,2], [1,1], [2,0]] // diagonals
    ];
    
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a[0]][a[1]] !== '⬜' &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]] === '❌' ? game.players[0] : game.players[1];
        }
    }
    return null;
}

// ==================== 2. GUESS THE NUMBER ====================
cmd({
    pattern: "guessnumber",
    alias: ["guess", "gn"],
    desc: "Guess the number game",
    category: "games",
    react: "🔢",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const gameId = from + sender;
        if (activeGames.guessNumber.has(gameId)) {
            return reply("❌ *You already have an active game!*");
        }
        
        const number = Math.floor(Math.random() * 100) + 1;
        activeGames.guessNumber.set(gameId, {
            number,
            attempts: 0,
            maxAttempts: 7
        });
        
        reply(`🔢 *GUESS THE NUMBER*\n\nI'm thinking of a number between 1-100.\nYou have 7 attempts.\n\nUse .guess <number>`);
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

cmd({
    pattern: "guess",
    alias: ["g"],
    desc: "Make a guess in number game",
    category: "games",
    react: "🎲",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.guessNumber.get(gameId);
        
        if (!game) return reply("❌ *No active game!* Start with .guessnumber");
        
        const guess = parseInt(q);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            return reply("❌ *Enter a number between 1-100!*");
        }
        
        game.attempts++;
        
        if (guess === game.number) {
            activeGames.guessNumber.delete(gameId);
            return reply(`🎉 *CORRECT!*\n\nYou guessed ${game.number} in ${game.attempts} attempts!`);
        }
        
        if (game.attempts >= game.maxAttempts) {
            activeGames.guessNumber.delete(gameId);
            return reply(`😢 *GAME OVER!*\n\nThe number was ${game.number}`);
        }
        
        const hint = guess < game.number ? 'higher' : 'lower';
        reply(`❌ *Wrong!* Try ${hint}.\nAttempts: ${game.attempts}/${game.maxAttempts}`);
        
    } catch (e) {
        reply('❌ Guess error.');
    }
});

// ==================== 3. WORD CHAIN ====================
cmd({
    pattern: "wordchain",
    alias: ["chain", "wordgame"],
    desc: "Play word chain game",
    category: "games",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, sender, reply }) => {
    try {
        if (!isGroup) return reply("❌ *This game can only be played in groups!*");
        
        const gameId = from;
        if (activeGames.wordChain.has(gameId)) {
            return reply("❌ *Game already running in this group!*");
        }
        
        const startWord = "start";
        activeGames.wordChain.set(gameId, {
            lastWord: startWord,
            lastLetter: 't',
            players: [sender],
            turn: sender,
            usedWords: [startWord]
        });
        
        reply(`🔗 *WORD CHAIN*\n\nGame started by @${sender.split('@')[0]}!\nFirst word: *${startWord}*\nNext word must start with letter: *T*\n\nUse .chain <word>`, {
            contextInfo: { mentionedJid: [sender] }
        });
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

cmd({
    pattern: "chain",
    alias: ["wc"],
    desc: "Add word to chain",
    category: "games",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from;
        const game = activeGames.wordChain.get(gameId);
        
        if (!game) return reply("❌ *No active game!* Start with .wordchain");
        if (game.turn !== sender) return reply("❌ *Not your turn!*");
        
        const word = q.toLowerCase().trim();
        if (!word) return reply("❌ *Enter a word!*");
        
        if (word.length < 3) return reply("❌ *Word must be at least 3 letters!*");
        if (game.usedWords.includes(word)) return reply("❌ *Word already used!*");
        
        const firstLetter = word[0];
        if (firstLetter !== game.lastLetter) {
            return reply(`❌ *Word must start with "${game.lastLetter.toUpperCase()}"!*`);
        }
        
        game.usedWords.push(word);
        game.lastWord = word;
        game.lastLetter = word[word.length - 1];
        
        // Switch turn to next player
        const players = game.players;
        const currentIndex = players.indexOf(sender);
        game.turn = players[(currentIndex + 1) % players.length];
        
        reply(`✅ *Valid!*\n\nWord: ${word}\nNext letter: *${game.lastLetter.toUpperCase()}*\n\n👉 @${game.turn.split('@')[0]}'s turn!`, {
            contextInfo: { mentionedJid: [game.turn] }
        });
        
    } catch (e) {
        reply('❌ Chain error.');
    }
});

// ==================== 4. HANGMAN ====================
const hangmanWords = [
    "javascript", "python", "whatsapp", "bot", "programming",
    "computer", "internet", "developer", "coding", "software"
];

cmd({
    pattern: "hangman",
    alias: ["hm"],
    desc: "Play Hangman game",
    category: "games",
    react: "🪢",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const gameId = from + sender;
        if (activeGames.hangman.has(gameId)) {
            return reply("❌ *You already have an active game!*");
        }
        
        const word = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
        const display = '_'.repeat(word.length).split('').join(' ');
        
        activeGames.hangman.set(gameId, {
            word,
            guessed: [],
            attempts: 0,
            maxAttempts: 6,
            display: display
        });
        
        reply(`🪢 *HANGMAN*\n\nWord: ${display}\nAttempts: 0/6\n\nUse .hang <letter>`);
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

cmd({
    pattern: "hang",
    alias: ["hguess"],
    desc: "Guess a letter in Hangman",
    category: "games",
    react: "🔤",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.hangman.get(gameId);
        
        if (!game) return reply("❌ *No active game!* Start with .hangman");
        
        const letter = q.toLowerCase().trim();
        if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
            return reply("❌ *Enter a single letter!*");
        }
        
        if (game.guessed.includes(letter)) {
            return reply("❌ *Letter already guessed!*");
        }
        
        game.guessed.push(letter);
        
        if (game.word.includes(letter)) {
            // Correct guess
            let display = '';
            for (let char of game.word) {
                display += game.guessed.includes(char) ? char : '_';
            }
            game.display = display.split('').join(' ');
            
            if (!display.includes('_')) {
                activeGames.hangman.delete(gameId);
                return reply(`🎉 *YOU WIN!*\n\nWord: ${game.word}`);
            }
            
            reply(`✅ *Correct!*\n\nWord: ${game.display}\nAttempts: ${game.attempts}/6`);
            
        } else {
            // Wrong guess
            game.attempts++;
            
            if (game.attempts >= game.maxAttempts) {
                activeGames.hangman.delete(gameId);
                return reply(`😢 *GAME OVER!*\n\nWord was: ${game.word}`);
            }
            
            reply(`❌ *Wrong!*\n\nWord: ${game.display}\nAttempts: ${game.attempts}/6`);
        }
        
    } catch (e) {
        reply('❌ Guess error.');
    }
});

// ==================== 5. QUIZ ====================
const quizQuestions = [
    {
        question: "What is the capital of Tanzania?",
        options: ["Dar es Salaam", "Dodoma", "Arusha", "Mwanza"],
        answer: 1
    },
    {
        question: "Which programming language is this bot written in?",
        options: ["Python", "Java", "JavaScript", "C++"],
        answer: 2
    },
    {
        question: "What is 5 + 7?",
        options: ["10", "11", "12", "13"],
        answer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        answer: 3
    }
];

cmd({
    pattern: "quiz",
    alias: ["trivia"],
    desc: "Play a quiz game",
    category: "games",
    react: "❓",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const gameId = from + sender;
        if (activeGames.quiz.has(gameId)) {
            return reply("❌ *You already have an active quiz!*");
        }
        
        const q = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        
        activeGames.quiz.set(gameId, {
            question: q,
            answered: false
        });
        
        let options = '';
        q.options.forEach((opt, i) => {
            options += `${i+1}. ${opt}\n`;
        });
        
        reply(`❓ *QUIZ*\n\n${q.question}\n\n${options}\nReply with the number (1-4)`);
        
    } catch (e) {
        reply('❌ Quiz error.');
    }
});

cmd({
    pattern: "answer",
    alias: ["ans"],
    desc: "Answer the quiz question",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.quiz.get(gameId);
        
        if (!game) return reply("❌ *No active quiz!* Start with .quiz");
        if (game.answered) return reply("❌ *Question already answered!*");
        
        const answer = parseInt(q) - 1;
        if (isNaN(answer) || answer < 0 || answer > 3) {
            return reply("❌ *Enter a number between 1-4!*");
        }
        
        game.answered = true;
        activeGames.quiz.delete(gameId);
        
        if (answer === game.question.answer) {
            reply(`✅ *CORRECT!*\n\n+10 points!`);
        } else {
            reply(`❌ *WRONG!*\n\nCorrect answer: ${game.question.options[game.question.answer]}`);
        }
        
    } catch (e) {
        reply('❌ Answer error.');
    }
});

// ==================== 6. RIDDLE ====================
const riddles = [
    {
        riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: "echo"
    },
    {
        riddle: "You measure my life in hours and I serve you by expiring. I'm quick when I'm thin and slow when I'm fat. Wind is my enemy. What am I?",
        answer: "candle"
    },
    {
        riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
        answer: "map"
    },
    {
        riddle: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?",
        answer: "r"
    },
    {
        riddle: "What word becomes shorter when you add two letters to it?",
        answer: "short"
    }
];

cmd({
    pattern: "riddle",
    alias: ["brainteaser"],
    desc: "Get a riddle to solve",
    category: "games",
    react: "🧩",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const riddle = riddles[Math.floor(Math.random() * riddles.length)];
        const gameId = from + sender;
        
        activeGames.riddle.set(gameId, {
            answer: riddle.answer,
            attempts: 0
        });
        
        reply(`🧩 *RIDDLE*\n\n${riddle.riddle}\n\nUse .solve <answer>`);
        
    } catch (e) {
        reply('❌ Riddle error.');
    }
});

cmd({
    pattern: "solve",
    alias: ["riddleanswer"],
    desc: "Solve the riddle",
    category: "games",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.riddle.get(gameId);
        
        if (!game) return reply("❌ *No active riddle!* Get one with .riddle");
        
        const answer = q.toLowerCase().trim();
        game.attempts++;
        
        if (answer === game.answer) {
            activeGames.riddle.delete(gameId);
            reply(`✅ *CORRECT!*\n\nYou solved it in ${game.attempts} attempt(s)!`);
        } else {
            if (game.attempts >= 3) {
                activeGames.riddle.delete(gameId);
                reply(`😢 *GAME OVER!*\n\nAnswer was: ${game.answer}`);
            } else {
                reply(`❌ *Wrong!* Try again (${game.attempts}/3)`);
            }
        }
        
    } catch (e) {
        reply('❌ Solve error.');
    }
});

// ==================== 7. MATH QUIZ ====================
cmd({
    pattern: "math",
    alias: ["mathquiz"],
    desc: "Solve math problems",
    category: "games",
    react: "🧮",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        
        let answer;
        if (op === '+') answer = num1 + num2;
        else if (op === '-') answer = num1 - num2;
        else answer = num1 * num2;
        
        const gameId = from + sender;
        activeGames.mathQuiz.set(gameId, { answer });
        
        reply(`🧮 *MATH QUIZ*\n\n${num1} ${op} ${num2} = ?\n\nUse .mathanswer <number>`);
        
    } catch (e) {
        reply('❌ Math error.');
    }
});

cmd({
    pattern: "mathanswer",
    alias: ["mans"],
    desc: "Answer math question",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.mathQuiz.get(gameId);
        
        if (!game) return reply("❌ *No active math quiz!* Start with .math");
        
        const answer = parseInt(q);
        if (isNaN(answer)) return reply("❌ *Enter a number!*");
        
        activeGames.mathQuiz.delete(gameId);
        
        if (answer === game.answer) {
            reply(`✅ *CORRECT!*\n\nAnswer: ${game.answer}`);
        } else {
            reply(`❌ *WRONG!*\n\nCorrect answer: ${game.answer}`);
        }
        
    } catch (e) {
        reply('❌ Answer error.');
    }
});

// ==================== 8. EMOJI QUIZ ====================
const emojiQuizzes = [
    {
        emoji: "🐱🐶🐭🐹",
        answer: "pets"
    },
    {
        emoji: "🍎🍌🍇🍊",
        answer: "fruits"
    },
    {
        emoji: "🚗✈️🚲🚢",
        answer: "vehicles"
    },
    {
        emoji: "🇹🇿🇰🇪🇺🇬🇷🇼",
        answer: "countries"
    },
    {
        emoji: "🎮🎲🎯🎰",
        answer: "games"
    }
];

cmd({
    pattern: "emoji",
    alias: ["emojiq"],
    desc: "Guess the category from emojis",
    category: "games",
    react: "😊",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const quiz = emojiQuizzes[Math.floor(Math.random() * emojiQuizzes.length)];
        const gameId = from + sender;
        
        activeGames.emojiQuiz.set(gameId, { answer: quiz.answer });
        
        reply(`😊 *EMOJI QUIZ*\n\n${quiz.emoji}\n\nWhat category is this?\nUse .emojianswer <answer>`);
        
    } catch (e) {
        reply('❌ Emoji quiz error.');
    }
});

cmd({
    pattern: "emojianswer",
    alias: ["eans"],
    desc: "Answer emoji quiz",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.emojiQuiz.get(gameId);
        
        if (!game) return reply("❌ *No active emoji quiz!* Start with .emoji");
        
        const answer = q.toLowerCase().trim();
        activeGames.emojiQuiz.delete(gameId);
        
        if (answer === game.answer) {
            reply(`✅ *CORRECT!*`);
        } else {
            reply(`❌ *WRONG!*\n\nAnswer: ${game.answer}`);
        }
        
    } catch (e) {
        reply('❌ Answer error.');
    }
});

// ==================== 9. MEMORY GAME ====================
cmd({
    pattern: "memory",
    alias: ["mem"],
    desc: "Test your memory",
    category: "games",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const numbers = [];
        for (let i = 0; i < 5; i++) {
            numbers.push(Math.floor(Math.random() * 100));
        }
        
        const gameId = from + sender;
        activeGames.memory.set(gameId, {
            numbers,
            revealed: false
        });
        
        reply(`🧠 *MEMORY GAME*\n\nMemorize these numbers:\n${numbers.join(' - ')}\n\nYou have 10 seconds!\nUse .recall when ready`);
        
        setTimeout(() => {
            const game = activeGames.memory.get(gameId);
            if (game && !game.revealed) {
                game.revealed = true;
                reply(`⏰ *Time's up!*\n\nUse .recall to enter the numbers`);
            }
        }, 10000);
        
    } catch (e) {
        reply('❌ Memory game error.');
    }
});

cmd({
    pattern: "recall",
    alias: ["rem"],
    desc: "Recall numbers in memory game",
    category: "games",
    react: "🔢",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.memory.get(gameId);
        
        if (!game) return reply("❌ *No active memory game!* Start with .memory");
        
        const numbers = q.split(' ').map(Number);
        if (numbers.length !== 5 || numbers.some(isNaN)) {
            return reply("❌ *Enter 5 numbers separated by spaces!*");
        }
        
        activeGames.memory.delete(gameId);
        
        let correct = 0;
        for (let i = 0; i < 5; i++) {
            if (numbers[i] === game.numbers[i]) correct++;
        }
        
        if (correct === 5) {
            reply(`🎉 *PERFECT!*\n\nYou remembered all numbers!`);
        } else {
            reply(`📊 *RESULTS*\n\nCorrect: ${correct}/5\nNumbers: ${game.numbers.join(' - ')}`);
        }
        
    } catch (e) {
        reply('❌ Recall error.');
    }
});

// ==================== 10. TYPING RACE ====================
const typingTexts = [
    "The quick brown fox jumps over the lazy dog",
    "Hello world this is a typing race game",
    "WhatsApp bot with many cool features",
    "Programming is fun and exciting",
    "JavaScript is the best language"
];

cmd({
    pattern: "type",
    alias: ["typing"],
    desc: "Test your typing speed",
    category: "games",
    react: "⌨️",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const text = typingTexts[Math.floor(Math.random() * typingTexts.length)];
        const gameId = from + sender;
        
        activeGames.typingRace.set(gameId, {
            text,
            startTime: Date.now()
        });
        
        reply(`⌨️ *TYPING RACE*\n\nType this exactly:\n\n"${text}"\n\nUse .typeit <text>`);
        
    } catch (e) {
        reply('❌ Typing game error.');
    }
});

cmd({
    pattern: "typeit",
    alias: ["ttype"],
    desc: "Submit your typing",
    category: "games",
    react: "✍️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.typingRace.get(gameId);
        
        if (!game) return reply("❌ *No active typing game!* Start with .type");
        
        const typed = q.trim();
        const time = (Date.now() - game.startTime) / 1000;
        
        activeGames.typingRace.delete(gameId);
        
        if (typed === game.text) {
            const wpm = Math.round((game.text.split(' ').length / time) * 60);
            reply(`✅ *PERFECT!*\n\nTime: ${time.toFixed(2)}s\nSpeed: ${wpm} WPM`);
        } else {
            reply(`❌ *MISTAKES!*\n\nTime: ${time.toFixed(2)}s\n\nCorrect text: ${game.text}`);
        }
        
    } catch (e) {
        reply('❌ Type error.');
    }
});

// ==================== 11. ROCK PAPER SCISSORS ====================
cmd({
    pattern: "rps",
    alias: ["rockpaperscissors"],
    desc: "Play Rock Paper Scissors with bot",
    category: "games",
    react: "✂️",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const choices = ['rock', 'paper', 'scissors'];
        const playerChoice = q.toLowerCase();
        
        if (!choices.includes(playerChoice)) {
            return reply("❌ *Choose:* rock, paper, or scissors");
        }
        
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        
        let result;
        if (playerChoice === botChoice) {
            result = "🤝 *DRAW!*";
        } else if (
            (playerChoice === 'rock' && botChoice === 'scissors') ||
            (playerChoice === 'paper' && botChoice === 'rock') ||
            (playerChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = "🎉 *YOU WIN!*";
        } else {
            result = "😢 *BOT WINS!*";
        }
        
        reply(`✂️ *ROCK PAPER SCISSORS*\n\nYou: ${playerChoice}\nBot: ${botChoice}\n\n${result}`);
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

// ==================== 12. TRUTH OR DARE ====================
const truths = [
    "What's your biggest fear?",
    "Have you ever lied to your best friend?",
    "What's the most embarrassing thing you've done?",
    "Who was your first crush?",
    "Have you ever cheated on a test?",
    "What's your biggest secret?",
    "Have you ever stolen anything?",
    "What's the worst thing you've said to someone?",
    "Who do you secretly dislike?",
    "What's your guilty pleasure?"
];

const dares = [
    "Send a random emoji to your last chat",
    "Do 10 pushups",
    "Sing a song and record it",
    "Call someone and say I love you",
    "Post an embarrassing photo of yourself",
    "Talk in a funny voice for 1 minute",
    "Do a funny dance",
    "Text your ex 'I miss you'",
    "Eat something without using your hands",
    "Act like a chicken for 30 seconds"
];

cmd({
    pattern: "truth",
    alias: ["t"],
    desc: "Get a truth question",
    category: "games",
    react: "🤔",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const truth = truths[Math.floor(Math.random() * truths.length)];
    reply(`🤔 *TRUTH*\n\n${truth}`);
});

cmd({
    pattern: "dare",
    alias: ["d"],
    desc: "Get a dare challenge",
    category: "games",
    react: "😈",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const dare = dares[Math.floor(Math.random() * dares.length)];
    reply(`😈 *DARE*\n\n${dare}`);
});

// ==================== 13. WOULD YOU RATHER ====================
const wyrQuestions = [
    "Would you rather be able to fly or be invisible?",
    "Would you rather be rich but unhappy or poor but happy?",
    "Would you rather live in the past or future?",
    "Would you rather have no internet or no phone?",
    "Would you rather be famous or rich?",
    "Would you rather be able to read minds or see the future?",
    "Would you rather never sleep or never eat?",
    "Would you rather be too hot or too cold?",
    "Would you rather lose your sight or hearing?",
    "Would you rather be 10 years younger or 10 years older?"
];

cmd({
    pattern: "wyr",
    alias: ["wouldyourather"],
    desc: "Would you rather questions",
    category: "games",
    react: "🤷",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const question = wyrQuestions[Math.floor(Math.random() * wyrQuestions.length)];
    reply(`🤷 *WOULD YOU RATHER*\n\n${question}`);
});

// ==================== 14. WORD SCRAMBLE ====================
const words = [
    "programming", "whatsapp", "javascript", "computer", "internet",
    "developer", "software", "algorithm", "database", "network"
];

cmd({
    pattern: "scramble",
    alias: ["wordscramble"],
    desc: "Unscramble the word",
    category: "games",
    react: "🔄",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const word = words[Math.floor(Math.random() * words.length)];
        const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
        
        const gameId = from + sender;
        activeGames.wordScramble.set(gameId, { word });
        
        reply(`🔄 *WORD SCRAMBLE*\n\nScrambled: *${scrambled}*\n\nUse .unscramble <word>`);
        
    } catch (e) {
        reply('❌ Scramble error.');
    }
});

cmd({
    pattern: "unscramble",
    alias: ["us"],
    desc: "Submit unscrambled word",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.wordScramble.get(gameId);
        
        if (!game) return reply("❌ *No active scramble!* Start with .scramble");
        
        const guess = q.toLowerCase().trim();
        activeGames.wordScramble.delete(gameId);
        
        if (guess === game.word) {
            reply(`✅ *CORRECT!*\n\nWord: ${game.word}`);
        } else {
            reply(`❌ *WRONG!*\n\nCorrect word: ${game.word}`);
        }
        
    } catch (e) {
        reply('❌ Unscramble error.');
    }
});

// ==================== 15. CROSSWORD ====================
cmd({
    pattern: "crossword",
    alias: ["cw"],
    desc: "Simple crossword puzzle",
    category: "games",
    react: "🔲",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const puzzle = `
🔲 *CROSSWORD*

Across:
1. WhatsApp command prefix (4)
3. Bot creator (4)

Down:
2. Programming language (10)

Hint: Answer format: .cw <number> <answer>
    `;
    
    reply(puzzle);
});

cmd({
    pattern: "cw",
    alias: ["crossans"],
    desc: "Answer crossword",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const [num, ans] = q.split(' ');
    const answers = {
        '1': 'dot',
        '2': 'javascript',
        '3': 'sila'
    };
    
    if (answers[num] && answers[num] === ans.toLowerCase()) {
        reply(`✅ *Correct!*`);
    } else {
        reply(`❌ *Wrong!*`);
    }
});

// ==================== 16. SUDOKU ====================
cmd({
    pattern: "sudoku",
    alias: ["sd"],
    desc: "Simple sudoku puzzle",
    category: "games",
    react: "🔢",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const puzzle = `
🔢 *SUDOKU*

5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .
------+-------+------
8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6
------+-------+------
. 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9

Use .solvesudoku <row> <col> <num>
    `;
    
    reply(puzzle);
});

// ==================== 17. CHESS ====================
cmd({
    pattern: "chess",
    alias: ["ch"],
    desc: "Play chess (text-based)",
    category: "games",
    react: "♟️",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const board = `
♟️ *CHESS*

8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
6 . . . . . . . .
5 . . . . . . . .
4 . . . . . . . .
3 . . . . . . . .
2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
  a b c d e f g h

Use .move <from> <to> (e.g., .move e2 e4)
    `;
    
    reply(board);
});

// ==================== 18. CHECKERS ====================
cmd({
    pattern: "checkers",
    alias: ["ck"],
    desc: "Play checkers (text-based)",
    category: "games",
    react: "⭕",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const board = `
⭕ *CHECKERS*

8 ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
7 ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛
6 ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
5 ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛
4 ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
3 ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛
2 ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜
1 ⬜ ⬛ ⬜ ⬛ ⬜ ⬛ ⬜ ⬛
  a b c d e f g h

Use .checkermove <from> <to>
    `;
    
    reply(board);
});

// ==================== 19. TRIVIA ====================
const triviaQuestions = [
    {
        q: "What is the largest continent?",
        a: "Asia"
    },
    {
        q: "How many colors are in a rainbow?",
        a: "7"
    },
    {
        q: "What is the hardest natural substance?",
        a: "Diamond"
    },
    {
        q: "What is the fastest land animal?",
        a: "Cheetah"
    },
    {
        q: "How many hearts does an octopus have?",
        a: "3"
    }
];

cmd({
    pattern: "trivia",
    alias: ["triv"],
    desc: "Random trivia question",
    category: "games",
    react: "❓",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const q = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        const gameId = from + sender;
        
        activeGames.trivia.set(gameId, { answer: q.a });
        
        reply(`❓ *TRIVIA*\n\n${q.q}\n\nUse .triviaanswer <answer>`);
        
    } catch (e) {
        reply('❌ Trivia error.');
    }
});

cmd({
    pattern: "triviaanswer",
    alias: ["tans"],
    desc: "Answer trivia question",
    category: "games",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.trivia.get(gameId);
        
        if (!game) return reply("❌ *No active trivia!* Start with .trivia");
        
        const answer = q.trim();
        activeGames.trivia.delete(gameId);
        
        if (answer.toLowerCase() === game.answer.toLowerCase()) {
            reply(`✅ *CORRECT!*`);
        } else {
            reply(`❌ *WRONG!*\n\nAnswer: ${game.answer}`);
        }
        
    } catch (e) {
        reply('❌ Answer error.');
    }
});

// ==================== 20. HANGMAN CLASSIC ====================
const classicWords = [
    "elephant", "giraffe", "kangaroo", "dolphin", "penguin",
    "butterfly", "dragonfly", "grasshopper", "ladybug", "spider"
];

cmd({
    pattern: "hangclassic",
    alias: ["hc"],
    desc: "Classic Hangman game",
    category: "games",
    react: "🎭",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const gameId = from + sender;
        if (activeGames.hangmanClassic.has(gameId)) {
            return reply("❌ *You already have an active game!*");
        }
        
        const word = classicWords[Math.floor(Math.random() * classicWords.length)];
        const display = '_'.repeat(word.length).split('').join(' ');
        
        activeGames.hangmanClassic.set(gameId, {
            word,
            guessed: [],
            attempts: 0,
            maxAttempts: 6,
            display
        });
        
        const hangmanStages = [
            '  +---+\n      |\n      |\n      |\n     ===',
            '  +---+\n  O   |\n      |\n      |\n     ===',
            '  +---+\n  O   |\n  |   |\n      |\n     ===',
            '  +---+\n  O   |\n /|   |\n      |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n      |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n /    |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n / \\  |\n     ==='
        ];
        
        reply(`🎭 *HANGMAN CLASSIC*\n\n${hangmanStages[0]}\n\nWord: ${display}\nAttempts: 0/6\n\nUse .hcguess <letter>`);
        
    } catch (e) {
        reply('❌ Game error.');
    }
});

cmd({
    pattern: "hcguess",
    alias: ["hcg"],
    desc: "Guess in Hangman Classic",
    category: "games",
    react: "🔤",
    filename: __filename
}, async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const gameId = from + sender;
        const game = activeGames.hangmanClassic.get(gameId);
        
        if (!game) return reply("❌ *No active game!* Start with .hangclassic");
        
        const letter = q.toLowerCase().trim();
        if (!letter || letter.length !== 1 || !/[a-z]/.test(letter)) {
            return reply("❌ *Enter a single letter!*");
        }
        
        if (game.guessed.includes(letter)) {
            return reply("❌ *Letter already guessed!*");
        }
        
        game.guessed.push(letter);
        
        const hangmanStages = [
            '  +---+\n      |\n      |\n      |\n     ===',
            '  +---+\n  O   |\n      |\n      |\n     ===',
            '  +---+\n  O   |\n  |   |\n      |\n     ===',
            '  +---+\n  O   |\n /|   |\n      |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n      |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n /    |\n     ===',
            '  +---+\n  O   |\n /|\\  |\n / \\  |\n     ==='
        ];
        
        if (game.word.includes(letter)) {
            // Correct guess
            let display = '';
            for (let char of game.word) {
                display += game.guessed.includes(char) ? char : '_';
            }
            game.display = display.split('').join(' ');
            
            if (!display.includes('_')) {
                activeGames.hangmanClassic.delete(gameId);
                return reply(`🎉 *YOU WIN!*\n\nWord: ${game.word}`);
            }
            
            reply(`✅ *Correct!*\n\n${hangmanStages[game.attempts]}\n\nWord: ${game.display}\nAttempts: ${game.attempts}/6`);
            
        } else {
            // Wrong guess
            game.attempts++;
            
            if (game.attempts >= game.maxAttempts) {
                activeGames.hangmanClassic.delete(gameId);
                return reply(`😢 *GAME OVER!*\n\n${hangmanStages[game.attempts]}\n\nWord was: ${game.word}`);
            }
            
            reply(`❌ *Wrong!*\n\n${hangmanStages[game.attempts]}\n\nWord: ${game.display}\nAttempts: ${game.attempts}/6`);
        }
        
    } catch (e) {
        reply('❌ Guess error.');
    }
});

// Game menu
cmd({
    pattern: "games",
    alias: ["gamelist", "game menu"],
    desc: "Show all available games",
    category: "games",
    react: "🎮",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    const menu = `🎮 *GAMES MENU*

╔══════════════════════╗
║ 1. *Tic Tac Toe*      ║
║    .tictactoe @user   ║
║    .move <row> <col>  ║
╠══════════════════════╣
║ 2. *Guess Number*     ║
║    .guessnumber       ║
║    .guess <number>    ║
╠══════════════════════╣
║ 3. *Word Chain*       ║
║    .wordchain         ║
║    .chain <word>      ║
╠══════════════════════╣
║ 4. *Hangman*          ║
║    .hangman           ║
║    .hang <letter>     ║
╠══════════════════════╣
║ 5. *Quiz*             ║
║    .quiz              ║
║    .answer <number>   ║
╠══════════════════════╣
║ 6. *Riddle*           ║
║    .riddle            ║
║    .solve <answer>    ║
╠══════════════════════╣
║ 7. *Math Quiz*        ║
║    .math              ║
║    .mathanswer <num>  ║
╠══════════════════════╣
║ 8. *Emoji Quiz*       ║
║    .emoji             ║
║    .emojianswer <ans> ║
╠══════════════════════╣
║ 9. *Memory Game*      ║
║    .memory            ║
║    .recall <numbers>  ║
╠══════════════════════╣
║10. *Typing Race*      ║
║    .type              ║
║    .typeit <text>     ║
╠══════════════════════╣
║11. *Rock Paper Sciss* ║
║    .rps <rock/paper/scissors>
╠══════════════════════╣
║12. *Truth or Dare*    ║
║    .truth / .dare     ║
╠══════════════════════╣
║13. *Would You Rather* ║
║    .wyr               ║
╠══════════════════════╣
║14. *Word Scramble*    ║
║    .scramble          ║
║    .unscramble <word> ║
╠══════════════════════╣
║15. *Crossword*        ║
║    .crossword         ║
║    .cw <num> <ans>    ║
╠══════════════════════╣
║16. *Sudoku*           ║
║    .sudoku            ║
╠══════════════════════╣
║17. *Chess*            ║
║    .chess             ║
╠══════════════════════╣
║18. *Checkers*         ║
║    .checkers          ║
╠══════════════════════╣
║19. *Trivia*           ║
║    .trivia            ║
║    .triviaanswer <ans>║
╠══════════════════════╣
║20. *Hangman Classic*  ║
║    .hangclassic       ║
║    .hcguess <letter>  ║
╚══════════════════════╝

> © 𝐒𝐈𝐋𝐀 𝐆𝐀𝐌𝐄𝐒`;

    reply(menu);
});
