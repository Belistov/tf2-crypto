require('dotenv').config({ path: './config/.env' });
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const { handleCommand } = require('./commands');
const logger = require('../utils/logger');
const { buyCrypto, sellCrypto } = require('./binanceHandler'); 
const { tradeKeysForCrypto } = require('./tradeHandler');
const { getCryptoBalance } = require('./binanceHandler'); // ✅ Import missing function
const { getKeyInventory } = require('./inventoryHandler'); // ✅ Import missing function

const client = new SteamUser();
const community = new SteamCommunity();

const ADMIN_IDS = process.env.ADMIN_IDS.split(",");
const COMMAND_PREFIX = process.env.COMMAND_PREFIX || "!";

// ✅ Prevent multiple logins
function attemptLogin() {
    console.log("🔄 Attempting login...");

    if (!client.steamID) { // Prevent re-login
        client.logOn({
            accountName: process.env.STEAM_USERNAME.replace(/"/g, ''),
            password: process.env.STEAM_PASSWORD.replace(/"/g, ''),
            twoFactorCode: SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET.replace(/"/g, ''))
        });
    }
}

// ✅ Auto-Trade Check (Runs Every 30s)
setInterval(async () => {
    console.log("🔄 Checking trade conditions...");

    const tradeSettings = JSON.parse(fs.readFileSync('config/tradeSettings.json', 'utf8'));
    const cryptoBalance = await getCryptoBalance();
    const keyCount = await getKeyInventory();
    const adminID = ADMIN_IDS[0]; // ✅ Use the first admin as trade recipient

    if (cryptoBalance >= tradeSettings.buyAt) {
        await tradeKeysForCrypto(client, adminID, "buy");
    }

    if (keyCount > 0 && tradeSettings.sellAt > 0) {
        await tradeKeysForCrypto(client, adminID, "sell");
    }
}, 30000);

// ✅ Login Event
client.on('loggedOn', () => {
    console.log(`✅ Logged into Steam as ${client.steamID.getSteamID64()}`);
    client.setPersona(SteamUser.EPersonaState.Online);

    // Notify all admins
    ADMIN_IDS.forEach(adminID => {
        client.chatMessage(adminID, "I am online master");
    });
});

// ✅ Message Handling
client.on('friendMessage', async (steamID, message) => {
    console.log(`📩 Message from ${steamID.getSteamID64()}: ${message}`);

    if (ADMIN_IDS.includes(steamID.getSteamID64())) {
        if (message.startsWith(COMMAND_PREFIX)) {
            handleCommand(client, steamID, message.slice(COMMAND_PREFIX.length).trim());
        }
    } else {
        client.chatMessage(steamID, "❌ You are not authorized to use commands.");
    }
});

// ✅ Only Login if `bot.js` is Executed Directly
if (require.main === module) {
    attemptLogin();
}

module.exports = { client, community };
