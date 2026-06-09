console.clear()
console.log("📳 Starting SILA-MD...")

// ============ GLOBAL ANTI-CRASH ============
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err)
})
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason)
})

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys')

const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const config = require('./config')
const GroupEvents = require('./lib/groupevents')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type')
const axios = require('axios')
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const { handleAntiCall } = require('./plugins/settis2')
const prefix = config.PREFIX

// ============ OWNER CONFIGURATION ============
const configOwnerNumbers = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',') : []
const ownerNumber = ['255768978061', '255789661031', ...configOwnerNumbers].map(num => num.trim())

const ownerJids = ownerNumber.map(num => {
  if (num.includes('@s.whatsapp.net')) return num
  if (num.includes('-')) return num 
  return num + '@s.whatsapp.net'
})

// ============ SECURITY FEATURES DATABASE ============
const securityDB = {
  antiMedia: { enabled: false, deleteSilently: true, mediaTypes: { image: true, video: true, audio: true, document: true, sticker: true, gif: true }, allowedGroups: [] },
  antiTag: { enabled: false, maxMentions: 5, action: 'warn', warnCount: 3 },
  antiBug: { enabled: false, blockBugMessages: true, logBugs: true },
  antiSpam: { enabled: false, maxMessages: 5, timeWindow: 5000, action: 'warn', warnCount: 3, userMessages: new Map() },
  antiBan: { enabled: false, protectOwner: true, protectAdmins: true, protectBot: true, blockDeleteGroup: true, blockPromoteDemote: true }
}

const securityFile = './security.json'
if (fs.existsSync(securityFile)) {
  try {
    const loaded = JSON.parse(fs.readFileSync(securityFile))
    Object.assign(securityDB, loaded)
  } catch (e) {
    console.error('Error loading security settings:', e)
  }
}

function saveSecurity() {
  fs.writeFileSync(securityFile, JSON.stringify(securityDB, null, 2))
}

const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => { if (err) throw err })
    }
  })
}
setInterval(clearTempDir, 5 * 60 * 1000)

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID || config.SESSION_ID.trim() === '') {
    console.log('❌ Please add your session to SESSION_ID in config.env or config.js')
    process.exit(1)
  }
  const sessdata = config.SESSION_ID.replace("sila~", '').trim()
  try {
    const compressedBuffer = Buffer.from(sessdata, 'base64')
    const zlib = require('zlib')
    const sessionBuffer = zlib.gunzipSync(compressedBuffer)
    fs.writeFileSync(__dirname + '/sessions/creds.json', sessionBuffer)
    console.log("✅ Session extracted and saved successfully")
  } catch (err) {
    console.log('❌ Failed to extract session:', err.message)
    process.exit(1)
  }
}

const express = require("express")
const app = express()
const port = process.env.PORT || 9090
let conn

// ============ SECURITY FUNCTIONS ============
async function handleAntiMedia(conn, mek, from, sender, isOwner, isAdmins) {
  if (!securityDB.antiMedia.enabled || isOwner || isAdmins) return false
  const type = getContentType(mek.message)
  if (!type) return false
  let mediaType = type.replace('Message', '')
  if (securityDB.antiMedia.mediaTypes[mediaType]) {
    await conn.sendMessage(from, { delete: mek.key })
    return true
  }
  return false
}

async function handleAntiBug(conn, mek, from, sender) {
  if (!securityDB.antiBug.enabled) return false
  const type = getContentType(mek.message)
  const text = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
  if (text.length > 4000 || /[\u0000-\u001F\u007F-\u009F]/.test(text)) {
    await conn.sendMessage(from, { delete: mek.key })
    return true
  }
  return false
}

// ============ MAIN CONNECTION ============
async function connectToWA() {
  try {
    console.log("[ ♻ ] Connecting to WhatsApp ⏳️...")
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/')
    const { version } = await fetchLatestBaileysVersion()

    conn = makeWASocket({
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: Browsers.macOS("Firefox"),
      syncFullHistory: true,
      auth: state,
      version
    })

    conn.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        if (shouldReconnect) setTimeout(() => connectToWA(), 5000)
      } else if (connection === 'open') {
        console.log('[ ✔ ] Plugins installed successfully ✅')
        console.log('[ 🪀 ] Bot connected to WhatsApp 📲')
        let up = `┏━❑ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐒𝐈𝐋𝐀-𝐌𝐃 ━━━━━━━━━━━\n┃ 🔹 Your bot is now active & ready!\n┃ 🔹 Current prefix: ${prefix}\n┗━━━━━━━━━━━━━━━━━\n> © 𝐒𝐈𝐋𝐀 𝐌𝐃`;
        conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/36vahk.png` }, caption: up })
      }
    })

    conn.ev.on('creds.update', saveCreds)

    //=============MESSAGE HANDLER===============
    conn.ev.on('messages.upsert', async(mek) => {
      mek = mek.messages[0]
      if (!mek.message) return

      const from = mek.key.remoteJid
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid)

      // ============ AUTO VIEW & LIKE STATUS ============
      if (from === "status@broadcast") {
          // 1. Auto View Status
          if (config.AUTO_STATUS_SEEN === "true") {
              await conn.readMessages([mek.key])
              console.log(`👁️  Status Viewed: ${sender.split('@')[0]}`)
          }
          
          // 2. Auto Like/React Status
          if (config.AUTO_STATUS_REACT === "true") {
              const statusEmoji = config.STATUS_READ_EMOJI || "💚"
              await conn.sendMessage(from, { 
                  react: { key: mek.key, text: statusEmoji } 
              }, { statusJidList: [sender, conn.user.id.split(':')[0] + '@s.whatsapp.net'] })
              console.log(`💖 Status Reacted: ${statusEmoji} to ${sender.split('@')[0]}`)
          }
          return // Stop processing status as normal commands
      }

      // Logic ya kawaida ya commands inaendelea hapa...
      const m = sms(conn, mek)
      const type = getContentType(mek.message)
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
      const isCmd = body.startsWith(prefix)
      const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
      const args = body.trim().split(/ +/).slice(1)
      const q = args.join(' ')
      const isGroup = from.endsWith('@g.us')
      const isMe = mek.key.fromMe
      const isOwner = ownerJids.includes(sender) || isMe

      if (config.READ_MESSAGE === 'true' && !isMe) await conn.readMessages([mek.key])

      // Security Checks
      if (isGroup && !isOwner) {
        if (await handleAntiMedia(conn, mek, from, sender, isOwner, false)) return
      }
      if (await handleAntiBug(conn, mek, from, sender)) return

      // Command Execution
      const events = require('./command')
      const cmdName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : false;
      if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName))
        if (cmd) {
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }})
          try {
            cmd.function(conn, mek, m, {
              from, body, isCmd, command, args, q, isGroup, sender, isOwner, reply: (t) => conn.sendMessage(from, { text: t }, { quoted: mek })
            });
          } catch (e) { console.error(e) }
        }
      }
    })

  } catch (err) {
    console.error("Connection failed:", err)
  }
}

// Start Server
app.get("/", (req, res) => res.send("SILA-MD IS ONLINE ✅"));
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    connectToWA();
});
