async function tradeKeysForCrypto(client, steamID, action) {
    const cryptoBalance = await getCryptoBalance();
    const keyCount = await getKeyInventory();
    const tradeSettings = JSON.parse(fs.readFileSync('config/tradeSettings.json', 'utf8'));

    const buyPrice = tradeSettings.buyAt;
    const sellPrice = tradeSettings.sellAt;

    if (action === "buy" && cryptoBalance >= buyPrice) {
        console.log(`💰 Buying TF2 Key for ${buyPrice} USDT...`);

        let trade = manager.createOffer(steamID);
        trade.addTheirItem({ market_hash_name: process.env.TF2_KEY_ITEM_NAME });
        trade.addMyItems([{ assetid: "crypto-payment-placeholder" }]); // Fake ID to represent crypto

        trade.send((err, status) => {
            if (err) {
                console.error("❌ Trade failed:", err);
            } else {
                console.log(`✅ Trade sent! Status: ${status}`);
            }
        });
    }

    if (action === "sell" && keyCount > 0) {
        console.log(`🔄 Selling TF2 Key for ${sellPrice} USDT...`);

        let trade = manager.createOffer(steamID);
        trade.addMyItem({ market_hash_name: process.env.TF2_KEY_ITEM_NAME });
        trade.addTheirItems([{ assetid: "crypto-payment-placeholder" }]); // Fake ID for crypto

        trade.send((err, status) => {
            if (err) {
                console.error("❌ Trade failed:", err);
            } else {
                console.log(`✅ Trade sent! Status: ${status}`);
            }
        });
    }
}

module.exports = { tradeKeysForCrypto };
