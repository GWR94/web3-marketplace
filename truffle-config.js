const HDWalletProvider = require("@truffle/hdwallet-provider");

const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.NEXT_INFURA_MNEMONIC,
          },
          providerOrUrl: `wss://sepolia.infura.io/ws/v3/${process.env.NEXT_INFURA_PROJECT_ID}`,
          addressIndex: 0,
        }),
      network_id: "11155111",
      gasPrice: 200000000000,
      networkCheckoutTimeout: 10000,
      timeoutBlocks: 200,
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};

//  transaction hash:    0x46b7cf43bab0c860609d2ef1266d5e57ef268de8e131f6fdb9095c97b78b20f4
//  contract address:    0x1Fc11B4Da7F2049fDf7b0357fA46dB4D462B81aF
