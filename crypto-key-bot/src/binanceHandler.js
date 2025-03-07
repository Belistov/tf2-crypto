const Binance = require('binance-api-node').default;
require('dotenv').config({ path: './config/.env' });

const binanceClient = Binance({
    apiKey: process.env.BINANCE_API_KEY,
    apiSecret: process.env.BINANCE_API_SECRET
});

async function getCryptoBalance() {
    try {
        const accountInfo = await binanceClient.accountInfo();
        let balance = 0;

        accountInfo.balances.forEach(asset => {
            if (asset.asset === "USDT") {
                balance = parseFloat(asset.free);
            }
        });

        return balance;
    } catch (error) {
        console.error("❌ Binance API Error:", error);
        return 0;
    }
}

module.exports = { getCryptoBalance };
