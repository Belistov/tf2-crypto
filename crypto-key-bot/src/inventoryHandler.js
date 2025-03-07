require('dotenv').config({ path: './config/.env' });
const { client, community } = require('./bot'); 
const TradeOfferManager = require('steam-tradeoffer-manager');

const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: "en"
});

async function getKeyInventory() {
    return new Promise((resolve, reject) => {
        if (!client.steamID) {
            console.error("❌ Bot is not logged in yet.");
            return reject("Bot not logged in.");
        }

        manager.getInventoryContents(440, 2, true, (err, inventory) => {
            if (err) {
                console.error("❌ Error fetching inventory:", err);
                return reject(err);
            }

            let keyCount = inventory.filter(item => item.market_hash_name === process.env.TF2_KEY_ITEM_NAME).length;
            resolve(keyCount);
        });
    });
}

module.exports = { getKeyInventory };
