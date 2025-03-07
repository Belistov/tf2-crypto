const { getCryptoBalance } = require('./binanceHandler');
const { getKeyInventory } = require('./inventoryHandler');

function handleCommand(client, steamID, command) {
    const args = command.split(" ");

    switch (args[0]) {
        case "buy-at":
            if (args.length >= 2 && !isNaN(args[1])) {
                tradeSettings.buyAt = parseFloat(args[1]);
                fs.writeFileSync('config/tradeSettings.json', JSON.stringify(tradeSettings));
                client.chatMessage(steamID, `✅ Buying keys when price is ≤ $${tradeSettings.buyAt} USDT`);
            } else {
                client.chatMessage(steamID, "⚠️ Invalid format. Usage: !buy-at <USD>");
            }
            break;

        case "sell-at":
            if (args.length >= 2 && !isNaN(args[1])) {
                tradeSettings.sellAt = parseFloat(args[1]);
                fs.writeFileSync('config/tradeSettings.json', JSON.stringify(tradeSettings));
                client.chatMessage(steamID, `✅ Selling keys when price is ≥ $${tradeSettings.sellAt} USDT`);
            } else {
                client.chatMessage(steamID, "⚠️ Invalid format. Usage: !sell-at <USD>");
            }
            break;

        case "balance-tf2":
            getKeyInventory()
                .then(keyCount => {
                    client.chatMessage(steamID, `🎒 TF2 Inventory: You have ${keyCount} keys.`);
                })
                .catch(err => {
                    client.chatMessage(steamID, "❌ Error fetching TF2 inventory.");
                    console.error(err);
                });
            break;

        case "balance-crypto":
            getCryptoBalance()
                .then(cryptoBalance => {
                    client.chatMessage(steamID, `💰 Binance Wallet: ${cryptoBalance} USDT available.`);
                })
                .catch(err => {
                    client.chatMessage(steamID, "❌ Error fetching crypto balance.");
                    console.error(err);
                });
            break;

        default:
            client.chatMessage(steamID, "⚠️ Unknown command.");
    }
}

module.exports = { handleCommand };
