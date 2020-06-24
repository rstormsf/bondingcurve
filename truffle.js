require('ts-node/register');

const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();
const infuraKey = fs.readFileSync('.infura').toString().trim();
const GWEI = 1000000000;

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    //  development: {
    //    host: "127.0.0.1",
    //    port: 7545,
    //    network_id: "*"
    //  },
    //  test: {
    //    host: "127.0.0.1",
    //    port: 7545,
    //    network_id: "*"
    //  }
    live: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://mainnet.infura.io/v3/${infuraKey}`,
        ),
      network_id: 1, // Mainnet's id
      gas: 1, // gas block limit
      gasPrice: 10 * GWEI,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: false, // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://kovan.infura.io/v3/${infuraKey}`,
        ),
      network_id: 42, // Kovan's id
      gas: 5500000, // Kovan has a lower block limit than mainnet
      gasPrice: 10 * GWEI,
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8554, // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01, // <-- Use this low gas price
    },
  },
  compilers: {
    solc: {
      version: '0.6.0',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
  plugins: ['truffle-plugin-verify', 'solidity-coverage'],
};
