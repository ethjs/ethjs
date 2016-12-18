# User Guide

All information for developers using `ethjs` should consult this document.

## Install

```
npm install --save ethjs
```

## Usage

```js
const Eth = require('ethjs');
const eth = new Eth(Eth.HttpProvider('https://ropsten.infura.io'));

eth.getBlockByNumber(45300, (err, block) => {
  console.log(err, block);
});

const abi = [{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}];

const token = eth.contract(abi).at('0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78');

token.totalSupply().then((totalSupply) => {
  console.log(totalSupply.toString(10));
});

const etherValue = Eth.toWei(72, 'ether');
```

## Welcome

Thank you for trying out `ethjs`! A highly optimized light-weight JS utiltity for [Ethereum](https://www.ethereum.org/) based on [`web3.js`](https://github.com/ethereum/web3.js), but lighter and using `BN.js`.

## Notice/Warning

`ethjs` is still in development and is highly experimental. Use at your own risk. While we test everything as against standards, specifications and existing test cases (layed out by both the community and the Ethereum Foundation), this module is not ready for production use. More user testing is needed, so please, help out!

## Modules

`ethjs` is made from a series of smaller modules:

  - [`ethjs-query`](http://github.com/ethjs/ethjs-query) for querying the RPC layer
  - [`ethjs-format`](http://github.com/ethjs/ethjs-format) for formatting RPC payloads to and from the nodes
  - [`ethjs-contract`](http://github.com/ethjs/ethjs-contract) for handling contracts
  - [`ethjs-abi`](http://github.com/ethjs/ethjs-abi) for handling contract data encoding and decoding
  - [`ethjs-filter`](http://github.com/ethjs/ethjs-filter) for handling filters and events
  - [`ethjs-unit`](http://github.com/ethjs/ethjs-unit) for handling Ethereum currency unit conversion
  - [`ethjs-util`](http://github.com/ethjs/ethjs-util) general utiltity methods
  - [`ethjs-provider-http`](http://github.com/ethjs/ethjs-provider-http) a simple XHR http provider

## Concepts

### dApps or Decentralized Apps

`ethjs` is primarily designed for building light-weight dApps or "Decentralized Applications" on Ethereum. dApps are usually just some HTML/Javascript/CSS file(s) that interface with an Ethereum node or client. They usually have little to no server architecture and are often just faces or light interfaces for one or many Ethereum smart-contracts.

### Nodes

`ethjs` is meant to be a simple javascript interface for Ethereum nodes and clients. If you are not running a node, we recommend using [TestRPC](https://github.com/ethereumjs/testrpc) (`npm install --save-dev ethereumjs-testrpc`), [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en), [Mist](https://github.com/ethereum/mist/releases), or [Infura](https://www.infura.io/). A node or client is generally required to both access and use Ethereum accounts, smart-contracts and the Ethereum blockchain.

### Accounts

Ethereum uses [secp256k1]() (public/private) key pairs for its account system. An Ethereum account address (e.g. `0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2`) is derived from the public key in the key pair. Both `accounts` and Ethereum `smart-contracts` have addresses, but only accounts use key pairs. Ether is sent to and from contracts or accounts via addresses.

For example, this `secp256k1` **private key**:
```
0xb82f69b82496716c8d63a41b1ae88017e720595477b0a5eeb835a8e46c3a13e6
```

Derives to this `secp256k1` **public key**:
```
0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3daa12198d9284fe7c0d9cbb2cf970d5997e642edb1373a9fbe48784c8
```

Which derives to this Ethereum **address**:
```
0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2
```

See: [`ethjs-account`](https://github.com/ethjs/ethjs-account), [`eth-lightwallet`](https://github.com/ConsenSys/eth-lightwallet), or the [`Ethereum Whitepaper`](https://github.com/ethereum/wiki/wiki/White-Paper#ethereum) for more details.

Note, there is a [**difference**](https://www.reddit.com/r/ethereum/comments/470s3q/vitalik_made_a_very_clever_backwards_compatible/) between Ethereum `checksum` addresses (i.e. `0xBd151ceB123dcba8C27Ad0769B8B9C11aFc69CC2`), and non-checksum addresses (i.e. `0xbd151ceb123dcba8c27ad0769b8b9c11afc69cc2`).

### Ether/Gas

Ether is the magical internet money that powers the Ethereum ecosystem. Each base unit of ether (a wei) is worth some amount of computational processes on the Ethereum world computer. Every transaction requires some amount of Ether to send, because of this, we sometimes refer to ether as "gas" or the "gas amount". You generally have to specify a gas amount when making any transaction with Ethereum.

See: [`Ethereum Whitepaper`](https://github.com/ethereum/wiki/wiki/White-Paper#messages-and-transactions)

### Smart-Contracts

Ethereum contracts or `smart-contracts` are computational code stored on the Ethereum blockchain. Contracts can be written in a higher level language like [Solidity](https://solidity.readthedocs.io/en/develop/) which then compiles down into EVM (Ethereum Virtual Machine) bytecode that can be stored on the chain. To use or deploy these contracts with `ethjs` you need the **ABI** and (if your deploying) the **bytecode** or (if your just using it) the **address**. Contracts can be designed to send and receive, process and store data and `ether` from other `accounts` or `contracts`. `ethjs` provides a `eth.contract` object to help you interact with and deploy Ethereum contracts (its design is very similar to its `web3.js` counterpart).

See: [`Browser-Solidity`](https://ethereum.github.io/browser-solidity/) an in browser Solidity IDE for building contracts, [`Solidity Read The Docs`](https://solidity.readthedocs.io/en/develop/), [`ethjs-contract`](https://github.com/ethjs/ethjs-contract), [`Ethereum Whitepaper`](https://github.com/ethereum/wiki/wiki/White-Paper#applications). Note, this will actually provide you with the necessary contract `bytecode` and `ABI` required to deploy and use the contracts.

### Transactions/vs Calls

`ethjs` can both transact (attempt to change) and call (attempt to get information from) the blockchain. In order to send transactions, the raw transaction data must be signed by the secp256k1 private key of the account used, and some Ether must be put up as "gas" in order for it to be processed and added to the blockchain. Calls do not require any account or ether, and is simply just getting known information from the blockchain. Certain contract methods will require you to transact with them, while others are simply getters that you can call (usually refered to as "constant" methods).

See: [`Ethereum Whitepaper`](https://github.com/ethereum/wiki/wiki/White-Paper#messages-and-transactions), [`Ethereum RPC Specification`](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction).

### Testnet/Mainnet/Local

The Ethereum (ETH) community runs two primary blockchains: a test network (testnet) called `ropsten` used to test contracts and transactions in a live (but not costly) setting and a main network (mainnet) called the Ethereum "Mainnet" or "Livenet" used to make actual transactions and contracts. Usually, most developers like to design their contracts and apps locally, and will run a local private network. Local networks can also be run with tools like ["TestRPC"](https://github.com/ethereumjs/testrpc), ["go-ethereum"](https://github.com/ethereum/go-ethereum) on a private network or ["parity"](https://github.com/ethcore/parity) on a private network.

See: [`Etherscan Testnet Blockchain Explorer`](http://testnet.etherscan.io/)

### Chain Services

There are many services available to help connect you or your app to the Ethereum testnet or mainnet. [infura](https://www.infura.io/) is one constantly referenced by `ethjs` examples. Currently, it allows anyone to access its scalable node cluster for free over an HTTPS connection. You can connect to the infura testnet by using the [`HTTP provider`](https://github.com/ethjs/ethjs-provider-http) with the host set to either: `https://ropsten.infura.io` or mainnet by using `https://mainnet.infura.io`. Note, if you use infura, you need to do your own account handling and signing of transactions.

See: [`Infura.io`](https://www.infura.io/)

### Account Handling/Signing

Account handling and signing must be done carfully and with extreme caution. Note, if someone gains access to your private key, they can and most likely will steal all of your Ether. Handling private keys is very dangerous and should be treated with extreme caution. Many nodes, clients and services (such as: [MetaMask], [uPort], [Geth], [Partiy], [Lightwallet] and others) help manage your keys and transaction signing for you.

See: [`Ethereum Whitepaper`](https://github.com/ethereum/wiki/wiki/White-Paper#ethereum-accounts).

### RPC

`ethjs` communicates with the Ethereum nodes and clients via RPC (Remote Procedure Call) data payloads send to and from your dApp and the node. `ethjs` has complete Ethereum RPC specification coverage, and tries to abstract very little past the specification. `ethjs` helps you format and build the data payloads that will be send and format payloads that are recieved by Ethereum nodes. Usually, a provider is specified and then payloads can be transmitted between your dApp and the Ethereum nodes.

See: [`Ethereum RPC Specification`](https://github.com/ethereum/wiki/wiki/JSON-RPC) for more details.

### Events/Filters

`ethjs` provides facility to manage events and filters. Filters are simple mechanisms to listen for changes on the blockchain. Contracts can also dispatch custom events.

See: [`ethjs-filter`](https://github.com/ethjs/ethjs-filter), [`Ethereum RPC Specification`](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter)

## Asynchronous Only

`ethjs` is completely async when handling data from any Ethereum provider, node or client. All data methods require the use of either a callback or standard promise.

## Big Numbers/Number Handling

Ethereum uses very large numbers for handling currency amounts and number storage on the blockchain. Javascript and the JVM (Javascript Virtual Machine) can only handle up to integer `9007199254740991` safely without loosing precision. Because of this, we have to use a module called `bn.js` to handle the very large numbers and amounts often used in Ethereum. Note, [`bn.js`](https://github.com/indutny/bn.js) "BN" is not the same as [`bignumber.js`](https://github.com/MikeMcl/bignumber.js) "BigNumber" used by web3. They are two different libraries. We use [`bn.js`](https://github.com/indutny/bn.js) because it does not support any decimal numbers, and can manage absolute precision of large integers (this lib is also used by `ethereumjs`).

There are **no decimal numbers on the blockchain**. All numbers must be converted to integers and then to hex format for chain storage and use. You must be very careful when handling large numbers. When working with Ethereum number values, try to avoid or never use actual Number type values (i.e. `value: 45038000000,`) or decimal numbers (`value: 1000.003`). This may lead to incorrect values conversion, number precision loss or worse, all your or your users ether!

Try to **always use `BN` Big Numbers** or if you have to strings. `ethjs` will attempt to convert your type `String` number into a BN properly, however, the best way is to always provide a type Object `BN` instance (e.g. `value: new Eth.BN('4000001'),` instead of `value: 4000001,`).

If you have to handle decimal amounts of value like `ether` (e.g. `4500.302 ether`), simply convert the value down to `wei` using the toWei method (e.g. `Eth.toWei('4500.302', 'ether')`) and then do your handling with BN.

The BN object comes equip with numerous mathamatical operators and methods.

### BN.js API

![alt-text](https://raw.githubusercontent.com/MikeMcl/bignumber.js/gh-pages/API.png "BN.js API")

## API Design

* [Eth.BN](#Eth.BN)
* [Eth.isAddress](#Eth.isAddress)
* [Eth.keccak256](#Eth.keccak256)
* [Eth.isHexString](#Eth.isHexString)
* [Eth.fromWei](#Eth.fromWei)
* [Eth.toWei](#Eth.toWei)
* [Eth.toBN](#Eth.toBN)
* [Eth.fromAscii](#Eth.fromAscii)
* [Eth.toAscii](#Eth.toAscii)
* [Eth.fromUtf8](#Eth.fromUtf8)
* [Eth.toUtf8](#Eth.toUtf8)
* [Eth.HttpProvider](#Eth.HttpProvider)

* [eth.contract](#eth.contract)
* [eth.filter](#eth.filter)

* [eth.web3_clientVersion](#eth.web3_clientversion)
* [eth.web3_sha3](#eth.web3_sha3)
* [eth.net_version](#eth.net_version)
* [eth.net_peerCount](#eth.net_peercount)
* [eth.net_listening](#eth.net_listening)
* [eth.protocolVersion](#eth.protocolversion)
* [eth.syncing](#eth.syncing)
* [eth.coinbase](#eth.coinbase)
* [eth.mining](#eth.mining)
* [eth.hashrate](#eth.hashrate)
* [eth.gasPrice](#eth.gasprice)
* [eth.accounts](#eth.accounts)
* [eth.blockNumber](#eth.blocknumber)
* [eth.getBalance](#eth.getbalance)
* [eth.getStorageAt](#eth.getstorageat)
* [eth.getTransactionCount](#eth.gettransactioncount)
* [eth.getBlockTransactionCountByHash](#eth.getblocktransactioncountbyhash)
* [eth.getBlockTransactionCountByNumber](#eth.getblocktransactioncountbynumber)
* [eth.getUncleCountByBlockHash](#eth.getunclecountbyblockhash)
* [eth.getUncleCountByBlockNumber](#eth.getunclecountbyblocknumber)
* [eth.getCode](#eth.getcode)
* [eth.sign](#eth.sign)
* [eth.sendTransaction](#eth.sendtransaction)
* [eth.sendRawTransaction](#eth.sendrawtransaction)
* [eth.call](#eth.call)
* [eth.estimateGas](#eth.estimategas)
* [eth.getBlockByHash](#eth.getblockbyhash)
* [eth.getBlockByNumber](#eth.getblockbynumber)
* [eth.getTransactionByHash](#eth.gettransactionbyhash)
* [eth.getTransactionByBlockHashAndIndex](#eth.gettransactionbyblockhashandindex)
* [eth.getTransactionByBlockNumberAndIndex](#eth.gettransactionbyblocknumberandindex)
* [eth.getTransactionReceipt](#eth.gettransactionreceipt)
* [eth.getUncleByBlockHashAndIndex](#eth.getunclebyblockhashandindex)
* [eth.getUncleByBlockNumberAndIndex](#eth.getunclebyblocknumberandindex)
* [eth.getCompilers](#eth.getcompilers)
* [eth.compileLLL](#eth.compilelll)
* [eth.compileSolidity](#eth.compilesolidity)
* [eth.compileSerpent](#eth.compileserpent)
* [eth.newFilter](#eth.newfilter)
* [eth.newBlockFilter](#eth.newblockfilter)
* [eth.newPendingTransactionFilter](#eth.newpendingtransactionfilter)
* [eth.uninstallFilter](#eth.uninstallfilter)
* [eth.getFilterChanges](#eth.getfilterchanges)
* [eth.getFilterLogs](#eth.getfilterlogs)
* [eth.getLogs](#eth.getlogs)
* [eth.getWork](#eth.getwork)
* [eth.submitWork](#eth.submitwork)
* [eth.submitHashrate](#eth.submithashrate)
* [eth.db_putString](#eth.db_putstring)
* [eth.db_getString](#eth.db_getstring)
* [eth.db_putHex](#eth.db_puthex)
* [eth.db_getHex](#eth.db_gethex)
* [eth.shh_post](#eth.shh_post)
* [eth.shh_version](#eth.shh_version)
* [eth.shh_newIdentity](#eth.shh_newidentity)
* [eth.shh_hasIdentity](#eth.shh_hasidentity)
* [eth.shh_newGroup](#eth.shh_newgroup)
* [eth.shh_addToGroup](#eth.shh_addtogroup)
* [eth.shh_newFilter](#eth.shh_newfilter)
* [eth.shh_uninstallFilter](#eth.shh_uninstallfilter)
* [eth.shh_getFilterChanges](#eth.shh_getfilterchanges)
* [eth.shh_getMessages](#eth.shh_getmessages)

### eth.contract

[index.js:ethjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

Intakes the contract Ethereum standard ABI schema, optionally the contract bytecode and default transaction object. Outputs a `ContractFactory` instance for the contract.

**Parameters**

-   `abi` **Array** a single Ethereum standard contract ABI array
-   `bytecode` **String** [optional] the contract bytecode as a single alphanumeric hex string
-   `defaultTxObject` **Object** [optional] a single default transaction object

Result `ContractFactory` **Object**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

eth.accounts().then((accounts) => {
  const SimpleStore = eth.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // create a new contract
  const simpleStore = SimpleStore.new((error, result) => {
    // result null '0x928sdfk...' (i.e. the transaction hash)
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');
});
```

### ContractFactory.new

[index.js:ethjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract factory has two methods, 'at' and 'new' which can be used to create the contract instane. the `at` method is used to create a `Contract` instance for a contract that has already been deployed to the Ethereum blockchain (testnet, livenet, local or otherwise). The `new` method is used to deploy the contract to the current chain.

**Parameters**

-   [`params`] **Various** the contract constructor input paramaters, if any have been specified, these can be of various types, lengths and requirements depending on the contract constructor.
-   `txObject` **Object** [optional] a web3 standard transaciton JSON object
-   `callback` **Function** [optional] a standard async callback which is fired when the contract has either been created or the transaction has failed.

Result a single Promise **Object** instance.


```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

eth.accounts().then((accounts) => {
  const SimpleStore = eth.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // create a new contract
  SimpleStore.new((error, result) => {
    // result null '0x928sdfk...' (i.e. the transaction hash)
  });
});
```

### ContractFactory.at

[index.js:ethjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract factory has two methods, 'at' and 'new' which can be used to create the `Contract` instane.

**Parameters**

-   `address` **String** a single 20 byte alphanumeric hex string contract address

Result a single `Contract` **Object** instance.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

eth.accounts().then((accounts) => {
  const SimpleStore = eth.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');

  // use a method that comes with the contract
  simpleStore.set(45).then((txHash) => {
    console.log(txHash);
  });
});
```

### Contract (Instance)

[index.js:ethjs-contract](../../../blob/master/src/index.js "Source code on GitHub")

The contract instance is meant to simulate a deployed Ethereum contract interface as a javascript object. All specified call methods are attached to this object (as specified by the contract ABI schema array).

In the example below, the SimpleStore contract has methods `set`, `get`, `constructor` and `SetComplete`.

The `get` method is flagged as `constant`, which means it will not make changes to the blockchain. It is purely for getting information from the chain.

However, the `set` method is not constant, which means it can be transacted with and change the blockchain.

The `constructor` method is only used when deploying the contract, i.e. when `.new` is used.

In this contract, the `SetComplete` event is fired when the `set` method has set a new value successfully.

You will notice the `simpleStore` instance makes all these methods available to it.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

// the abi
const SimpleStoreABI = JSON
.parse('[{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"set","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"storeValue","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_newValue","type":"uint256"},{"indexed":false,"name":"_sender","type":"address"}],"name":"SetComplete","type":"event"}]');

// bytecode
const SimpleStoreBytecode = '606060405234610000575b5b5b61010e8061001a6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146100435780636d4ce63c14610076575b610000565b346100005761005e6004808035906020019091905050610099565b60405180821515815260200191505060405180910390f35b3461000057610083610103565b6040518082815260200191505060405180910390f35b6000816000819055507f10e8e9bc5a1bde3dd6bb7245b52503fcb9d9b1d7c7b26743f82c51cc7cce917d60005433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a1600190505b919050565b600060005490505b9056';

eth.accounts().then((accounts) => {
  const SimpleStore = eth.contract(SimpleStoreABI, SimpleStoreBytecode, {
    from: accounts[0],
    gas: 300000,
  });

  // setup an instance of that contract
  const simpleStore = SimpleStore.at('0x000...');

  simpleStore.set(45000, (error, result) => {
    // result null '0x2dfj24...'
  });

  simpleStore.get().catch((error) => {
    // error null
  }).then(result) => {
    // result <BigNumber ...>
  });

  const filter = simpleStore.SetComplete().new((error, result) => {
    // result null <BigNumber ...> filterId
  });
  filter.watch().then((result) => {
    // result null FilterResult {...} (will only fire once)
  });
  filter.uninstall((error, result) => {
    // result null Boolean filterUninstalled
  });
});
```

### Eth.toWei

[index.js:ethjs-unit](../../../blob/master/src/index.js "Source code on GitHub")

Convert a single Ethereum denominated value at a specified unit, and convert it to its `wei` value. Intakes a `value` and `unit` specifier, outputs a single wei value `BN` object.

**Parameters**

-   `value` **Object|Number|String** a single number `wei` value as a integer, BN.js object instance, string hex integer, BN.js object instance (no decimals)
-   `unit` **String** the unit to covert to (i.e. `finney`, `ether` etc..)

Result output single BN **Object**.

```js
const Eth = require('ethjs');

var val1 = Eth.toWei(249824778, 'ether');

// result <BN ...> [.toString(10) : 249824778000000000000000000]
```

### Eth.fromWei

[index.js:ethjs-unit](../../../blob/master/src/index.js "Source code on GitHub")

Convert a wei denominated value into another Ethereum denomination. Intakes a single wei `value` and outputs a BN object.

**Parameters**

-   `value` **Object|Number|String** a single number Ethereum denominated value
-   `unit` **String** the unit to covert to (i.e. `finney`, `ether` etc..)

Result output single **String** number.

```js
const Eth = require('ethjs');

var val1 = Eth.fromWei(249824778000000000000000000, 'ether');

// result '249824778'
```

### Eth.HttpProvider

[index.js:ethjs-provider-http](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a `provider` URL specified as a string, and optionally the `timeout` specified as a Number, outputs a web3 standard `HttpProvider` object.

**Parameters**

-   `provider` **String** the URL path to your local Http RPC enabled Ethereum node (e.g. `http://localhost:8545`) or a service node system like [Infura.io](http://infura.io) (e.g. `http://ropsten.infura.io`).
-   `timeout` **Number** [optional] the time in seconds that an XHR2 request will wait until it times out.

Result `HttpProvider` **Object**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.accounts((err, result) => {
  // result null ['0xd89b8a74c153f0626497bc4a531f702...', ...]
});
```

### Eth.keccak256

[index.js:keccak256](../../../blob/master/src/index.js "Source code on GitHub")

Intakes a single string and outputs a 32 byte (66 utf-8 byte) sha3 Keccak hex string or optionally a Buffer object.

**Parameters**

-   `input` **String** a single input string

Result output hex **String**.

```js
const Eth = require('ethjs');

console.log(Eth.keccak256('skfjksdfjksdjksd'));

// result 0x2b30820856594159b8ed9a26609193526e944a1a748eb7d493beac83911dd848
```

### eth.filter

[index.js:filter](../../../blob/master/src/index.js "Source code on GitHub")

Used to manage Ethereum event listening and filtering.

```js
const Eth = require('ethjs');
const eth = new Eth(new HttpProvider('http://localhost:8545'));

const filter = new eth.filters.Filter({ delay: 300 })
.new({ toBlock: 500 })
.then((result) => {
  // result <BigNumber ...> filterId
})
.catch((error) => {
  // result null
});
filter.watch((result) => {
  // result [{...}, ...] (fires multiple times)
});
filter.uninstall(cb);


const filter = new eth.filters.BlockFilter()
.at(7)
filter.watch((result) => {
  // result [{...}, ...] (fires multiple times)
});
filter.uninstall(cb);


const filter = new eth.filters.PendingTransactionFilter()
.new()
.then((result) => {
  // result <BigNumber ...> filterId
})
.catch((error) => {
  // result null
});

const watcher = filter.watch((error, result) => {
  // result null ['0xfd234829...', '0xsf2030d1...']
});
watcher.stopWatching(cb);

filter.uninstall()
.then((result) => {
  // result true
})
.catch((error) => {
  // result null
});
```

### eth.web3_clientVersion

[index.js:web3_clientVersion](../../../blob/master/src/index.js Source code on GitHub")

The web3 client version.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.web3_clientVersion()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### eth.web3_sha3

[index.js:web3_sha3](../../../blob/master/src/index.js Source code on GitHub")

The keccak 256 sha3 hash of the data.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.web3_sha3("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.net_version

[index.js:net_version](../../../blob/master/src/index.js Source code on GitHub")

The net version from the node.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.net_version()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### eth.net_peerCount

[index.js:net_peerCount](../../../blob/master/src/index.js Source code on GitHub")

The total network peer count of the node.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.net_peerCount()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.net_listening

[index.js:net_listening](../../../blob/master/src/index.js Source code on GitHub")

Is the node listening to the network.

**Parameters**

none.

Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.net_listening()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.protocolVersion

[index.js:eth_protocolVersion](../../../blob/master/src/index.js Source code on GitHub")

Returns the current ethereum protocol version.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.protocolVersion()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### eth.syncing

[index.js:eth_syncing](../../../blob/master/src/index.js Source code on GitHub")

Returns an object with data about the sync status or 'false'.

**Parameters**

none.

Result **"Boolean|EthSyncing"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.syncing()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.coinbase

[index.js:eth_coinbase](../../../blob/master/src/index.js Source code on GitHub")

Returns the client coinbase address.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.coinbase()
.then((result) => {
  /*
  // result

  "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78"
  */
})
.catch((error) => {
  // null
});
```


### eth.mining

[index.js:eth_mining](../../../blob/master/src/index.js Source code on GitHub")

Returns 'true' if client is actively mining new blocks.

**Parameters**

none.

Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.mining()
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.hashrate

[index.js:eth_hashrate](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of hashes per second that the node is mining with.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.hashrate()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.gasPrice

[index.js:eth_gasPrice](../../../blob/master/src/index.js Source code on GitHub")

Returns the current price per gas in wei.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.gasPrice()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.accounts

[index.js:eth_accounts](../../../blob/master/src/index.js Source code on GitHub")

Returns a list of addresses owned by client.

**Parameters**

none.

Result **[String]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.accounts()
.then((result) => {
  /*
  // result

  ["0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78"]
  */
})
.catch((error) => {
  // null
});
```


### eth.blockNumber

[index.js:eth_blockNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of most recent block.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.blockNumber()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getBalance

[index.js:eth_getBalance](../../../blob/master/src/index.js Source code on GitHub")

Returns the balance of the account of given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getBalance("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getStorageAt

[index.js:eth_getStorageAt](../../../blob/master/src/index.js Source code on GitHub")

Returns the value from a storage position at a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.
-   `number_2` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getStorageAt("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.getTransactionCount

[index.js:eth_getTransactionCount](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions *sent* from an address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getTransactionCount("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getBlockTransactionCountByHash

[index.js:eth_getBlockTransactionCountByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions in a block from a block matching the given block hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getBlockTransactionCountByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getBlockTransactionCountByNumber

[index.js:eth_getBlockTransactionCountByNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of transactions in a block from a block matching the given block number.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getBlockTransactionCountByNumber(<BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getUncleCountByBlockHash

[index.js:eth_getUncleCountByBlockHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of uncles in a block from a block matching the given block hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getUncleCountByBlockHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getUncleCountByBlockNumber

[index.js:eth_getUncleCountByBlockNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns the number of uncles in a block from a block matching the given block number.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getUncleCountByBlockNumber(<BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getCode

[index.js:eth_getCode](../../../blob/master/src/index.js Source code on GitHub")

Returns code at a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getCode("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.sign

[index.js:eth_sign](../../../blob/master/src/index.js Source code on GitHub")

Signs data with a given address.

**Parameters**

-   `address_0` **String** -- A 20 byte prefixed alphanumeric hex string.
-   `hash_1` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.sign("0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.sendTransaction

[index.js:eth_sendTransaction](../../../blob/master/src/index.js Source code on GitHub")

Creates new message call transaction or a contract creation, if the data field contains code.

**Parameters**

-   `object_0` **Object** -- A raw transaction object.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.sendTransaction({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  to: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '45000000',
  gas: '3000000',
  data: '0x',
})
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.sendRawTransaction

[index.js:eth_sendRawTransaction](../../../blob/master/src/index.js Source code on GitHub")

Creates new message call transaction or a contract creation for signed transactions.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.sendRawTransaction("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45"
  */
})
.catch((error) => {
  // null
});
```


### eth.call

[index.js:eth_call](../../../blob/master/src/index.js Source code on GitHub")

Executes a new message call immediately without creating a transaction on the block chain.

**Parameters**

-   `object_0` **Object** -- A call transaction object.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.call({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  to: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '45000000',
  gas: '3000000',
  data: '0x',
}, <BN ...>)
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.estimateGas

[index.js:eth_estimateGas](../../../blob/master/src/index.js Source code on GitHub")

Makes a call or transaction, which won't be added to the blockchain and returns the used gas, which can be used for estimating the used gas.

**Parameters**

-   `object_0` **Object** -- An estimate transaction object.
-   `number_1` **BN** -- A number quantity or tag (i.e. "earliest", "latest").


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.estimateGas({
  from: '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78',
  value: '0',
  gas: '30000',
  data: '0x',
}, <BN ...>)
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.getBlockByHash

[index.js:eth_getBlockByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a block by hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `bool_1` **Boolean** -- A boolean value "true" or "false".


Result **"Block"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getBlockByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", true)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getBlockByNumber

[index.js:eth_getBlockByNumber](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a block by block number.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `bool_1` **Boolean** -- A boolean value "true" or "false".


Result **"Block"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getBlockByNumber(<BN ...>, true)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getTransactionByHash

[index.js:eth_getTransactionByHash](../../../blob/master/src/index.js Source code on GitHub")

Returns the information about a transaction requested by transaction hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **"Transaction"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getTransactionByHash("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getTransactionByBlockHashAndIndex

[index.js:eth_getTransactionByBlockHashAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a transaction by block hash and transaction index position.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.


Result **"Transaction"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getTransactionByBlockHashAndIndex("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", <BN ...>)
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getTransactionByBlockNumberAndIndex

[index.js:eth_getTransactionByBlockNumberAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a transaction by block number and transaction index position.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `number_1` **BN** -- A number quantity.


Result **"Transaction"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getTransactionByBlockNumberAndIndex(<BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  {
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "transactionIndex": <BN ...>,
    "from": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "to": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "value": <BN ...>,
    "gasPrice": <BN ...>,
    "gas": <BN ...>,
    "input": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getTransactionReceipt

[index.js:eth_getTransactionReceipt](../../../blob/master/src/index.js Source code on GitHub")

Returns the receipt of a transaction by transaction hash.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **"Receipt"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getTransactionReceipt("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  {
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "transactionIndex": <BN ...>,
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "cumulativeGasUsed": <BN ...>,
    "gasUsed": <BN ...>,
    "contractAddress": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "logs": {
    logIndex: <BN ...1>,
      blockNumber: <BN ...43533>,
      blockHash: "0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d",
      transactionHash:  "0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf",
      transactionIndex: <BN ...0>,
      address: "0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d",
      data:"0x0000000000000000000000000000000000000000000000000000000000000000",
      topics: ["0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5"]
    }
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getUncleByBlockHashAndIndex

[index.js:eth_getUncleByBlockHashAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a uncle of a block by hash and uncle index position.

**Parameters**

-   `hash_0` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `number_1` **BN** -- A number quantity.


Result **"Block"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getUncleByBlockHashAndIndex("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", <BN ...>)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getUncleByBlockNumberAndIndex

[index.js:eth_getUncleByBlockNumberAndIndex](../../../blob/master/src/index.js Source code on GitHub")

Returns information about a uncle of a block by number and uncle index position.

**Parameters**

-   `number_0` **BN** -- A number quantity or tag (i.e. "earliest", "latest").
-   `number_1` **BN** -- A number quantity.


Result **"Block"**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getUncleByBlockNumberAndIndex(<BN ...>, <BN ...>)
.then((result) => {
  /*
  // result

  {
    "number": <BN ...>,
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "parentHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "nonce": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "sha3Uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "logsBloom": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "transactionsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "stateRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "receiptsRoot": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "miner": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "difficulty": <BN ...>,
    "totalDifficulty": <BN ...>,
    "extraData": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "size": <BN ...>,
    "gasLimit": <BN ...>,
    "gasUsed": <BN ...>,
    "timestamp": <BN ...>,
    "transactions": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "uncles": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }
  */
})
.catch((error) => {
  // null
});
```


### eth.getCompilers

[index.js:eth_getCompilers](../../../blob/master/src/index.js Source code on GitHub")

Returns a list of available compilers in the client.

**Parameters**

none.

Result **[String]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getCompilers()
.then((result) => {
  /*
  // result

  ["0.1.6"]
  */
})
.catch((error) => {
  // null
});
```


### eth.compileLLL

[index.js:eth_compileLLL](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled LLL code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.compileLLL("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.compileSolidity

[index.js:eth_compileSolidity](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled solidity code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.compileSolidity("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.compileSerpent

[index.js:eth_compileSerpent](../../../blob/master/src/index.js Source code on GitHub")

Returns compiled serpent code.

**Parameters**

-   `data_0` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.compileSerpent("0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.newFilter

[index.js:eth_newFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter object, based on filter options, to notify when the state changes (logs).

**Parameters**

-   `object_0` **Object** -- An event filter object.


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.newFilter({
  fromBlock: '1',
  toBlock: new Eth.BN('45'),
  address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
  topics: ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', null],
})
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.newBlockFilter

[index.js:eth_newBlockFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter in the node, to notify when a new block arrives.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.newBlockFilter()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.newPendingTransactionFilter

[index.js:eth_newPendingTransactionFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates a filter in the node, to notify when new pending transactions arrive.

**Parameters**

none.

Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.newPendingTransactionFilter()
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.uninstallFilter

[index.js:eth_uninstallFilter](../../../blob/master/src/index.js Source code on GitHub")

Uninstalls a filter with given id. Should always be called when watch is no longer needed.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.uninstallFilter(<BN ...>)
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.getFilterChanges

[index.js:eth_getFilterChanges](../../../blob/master/src/index.js Source code on GitHub")

Polling method for a filter, which returns an array of logs which occurred since last poll.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["FilterChange"]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getFilterChanges(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### eth.getFilterLogs

[index.js:eth_getFilterLogs](../../../blob/master/src/index.js Source code on GitHub")

Returns an array of all logs matching filter with given id.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["FilterChange"]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getFilterLogs(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### eth.getLogs

[index.js:eth_getLogs](../../../blob/master/src/index.js Source code on GitHub")

Returns an array of all logs matching a given filter object.

**Parameters**

-   `object_0` **Object** -- An event filter object.


Result **Array**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getLogs({
  fromBlock: '1',
  toBlock: new Eth.BN('45'),
  address: '0x8888f1f195afa192cfee860698584c030f4c9db1',
  topics: ['0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b', null],
})
.then((result) => {
  /*
  // result

  [{
    "removed": true,
    "logIndex": <BN ...>,
    "transactionIndex": <BN ...>,
    "transactionHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockHash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45",
    "blockNumber": <BN ...>,
    "address": "0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78",
    "data": "0xce3f4596cbd1514f446ef8a306403354f53cb4aa9508a6440b6f93d8bccba3a1",
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  }]
  */
})
.catch((error) => {
  // null
});
```


### eth.getWork

[index.js:eth_getWork](../../../blob/master/src/index.js Source code on GitHub")

Returns the hash of the current block, the seedHash, and the boundary condition to be met ("target").

**Parameters**

none.

Result **[String]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.getWork()
.then((result) => {
  /*
  // result

  ["0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"]
  */
})
.catch((error) => {
  // null
});
```


### eth.submitWork

[index.js:eth_submitWork](../../../blob/master/src/index.js Source code on GitHub")

Used for submitting a proof-of-work solution.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.
-   `hash_1` **String** -- A 32 byte prefixed alphanumeric hex string.
-   `hash_2` **String** -- A 32 byte prefixed alphanumeric hex string.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.submitWork("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbab45")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.submitHashrate

[index.js:eth_submitHashrate](../../../blob/master/src/index.js Source code on GitHub")

Used for submitting mining hashrate.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.
-   `data_1` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.submitHashrate("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.db_putString

[index.js:db_putString](../../../blob/master/src/index.js Source code on GitHub")

Stores a string in the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.
-   `data_2` **String** -- String data.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.db_putString("0.1.6", "0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.db_getString

[index.js:db_getString](../../../blob/master/src/index.js Source code on GitHub")

Returns string from the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.db_getString("0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### eth.db_putHex

[index.js:db_putHex](../../../blob/master/src/index.js Source code on GitHub")

Stores binary data in the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.
-   `data_2` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.db_putHex("0.1.6", "0.1.6", "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.db_getHex

[index.js:db_getHex](../../../blob/master/src/index.js Source code on GitHub")

Returns binary data from the local database.

**Parameters**

-   `data_0` **String** -- String data.
-   `data_1` **String** -- String data.


Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.db_getHex("0.1.6", "0.1.6")
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_post

[index.js:shh_post](../../../blob/master/src/index.js Source code on GitHub")

Sends a whisper message.

**Parameters**

-   `object_0` **Object** -- An SHH post object.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_post({
  from: '0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1',
  to: '0x3e245533f97284d442460f2998cd41858798ddf04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a0d4d661997d3940272b717b1',
  topics: ['0x776869737065722d636861742d636c69656e74', '0x4d5a695276454c39425154466b61693532'],
  payload: '0x7b2274797065223a226d6',
  priority: '65',
  ttl: '80',
})
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_version

[index.js:shh_version](../../../blob/master/src/index.js Source code on GitHub")

Returns the current whisper protocol version.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_version()
.then((result) => {
  /*
  // result

  "0.1.6"
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_newIdentity

[index.js:shh_newIdentity](../../../blob/master/src/index.js Source code on GitHub")

Creates new whisper identity in the client.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_newIdentity()
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_hasIdentity

[index.js:shh_hasIdentity](../../../blob/master/src/index.js Source code on GitHub")

Checks if the client hold the private keys for a given identity.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_hasIdentity("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_newGroup

[index.js:shh_newGroup](../../../blob/master/src/index.js Source code on GitHub")

Creates a new SHH group.

**Parameters**

none.

Result **String**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_newGroup()
.then((result) => {
  /*
  // result

  "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3"
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_addToGroup

[index.js:shh_addToGroup](../../../blob/master/src/index.js Source code on GitHub")

Adds an identity to an SHH group.

**Parameters**

-   `data_0` **String** -- Hexified bytes data of an undefined length.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_addToGroup("0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3")
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_newFilter

[index.js:shh_newFilter](../../../blob/master/src/index.js Source code on GitHub")

Creates filter to notify, when client receives whisper message matching the filter options.

**Parameters**

-   `object_0` **Object** -- An SHH filter object.


Result **BN**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_newFilter({
   topics: ['0x12341234bf4b564f'],
   to: '0x04f96a5e25610293e42a73908e93ccc8c4d4dc0edcfa9fa872f50cb214e08ebf61a03e245533f97284d442460f2998cd41858798ddfd4d661997d3940272b717b1'
})
.then((result) => {
  /*
  // result

  <BN ...>
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_uninstallFilter

[index.js:shh_uninstallFilter](../../../blob/master/src/index.js Source code on GitHub")

Uninstalls a filter with given id. Should always be called when watch is no longer needed.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **Boolean**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_uninstallFilter(<BN ...>)
.then((result) => {
  /*
  // result

  true
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_getFilterChanges

[index.js:shh_getFilterChanges](../../../blob/master/src/index.js Source code on GitHub")

Polling method for whisper filters. Returns new messages since the last call of this method.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["SHHFilterChange"]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_getFilterChanges(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "from": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "to": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "expiry": <BN ...>,
    "ttl": <BN ...>,
    "sent": <BN ...>,
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "payload": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "workProved": <BN ...>
  }]
  */
})
.catch((error) => {
  // null
});
```


### eth.shh_getMessages

[index.js:shh_getMessages](../../../blob/master/src/index.js Source code on GitHub")

Get all messages matching a filter. Unlike 'shh_getFilterChanges' this returns all messages.

**Parameters**

-   `number_0` **BN** -- A number quantity.


Result **["SHHFilterChange"]**.

```js
const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('http://localhost:8545'));

eth.shh_getMessages(<BN ...>)
.then((result) => {
  /*
  // result

  [{
    "hash": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "from": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "to": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "expiry": <BN ...>,
    "ttl": <BN ...>,
    "sent": <BN ...>,
    "topics": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "payload": "0xbf2b4596cbd1511f4a6ef8af06d03354f53cb8aa9508a6810b6f93d8bccbabd40cb8da3",
    "workProved": <BN ...>
  }]
  */
})
.catch((error) => {
  // null
});
```


## Browser Builds

`ethjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/ethjs.js` or `dist/ethjs.min.js` directly into an HTML file to start using this module. Note, an `Eth` object is made available globally.

```html
<script type="text/javascript" src="ethjs.min.js"></script>
<script type="text/javascript">
Eth(...);
</script>
```

## Webpack Figures

Minified: **103 kB**.

```
Hash: b267c64f72c936248871                                                            
Version: webpack 2.1.0-beta.15
Time: 928ms
       Asset    Size  Chunks             Chunk Names
    ethjs.js  235 kB       0  [emitted]  main
ethjs.js.map  291 kB       0  [emitted]  main
  [24] multi main 28 bytes {0} [built]
    + 24 hidden modules

Hash: b7b0fe38a80ebbca42e2                                                            
Version: webpack 2.1.0-beta.15
Time: 3373ms
       Asset    Size  Chunks             Chunk Names
ethjs.min.js  103 kB       0  [emitted]  main
  [24] multi main 28 bytes {0} [built]
    + 24 hidden modules
```

Note, even though `ethjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

## Other Awesome Modules, Tools and Frameworks

### **Ethereum Foundation**
  - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum JS swiss army knife
  - [ethereumjs](https://github.com/ethereumjs) -- critical ethereum javascript infrastructure/community
  - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE
  - [mists](https://github.com/ethereum/mist/releases) -- the official Ethereum wallet and browser

### Nodes
  - [geth](https://github.com/ethereum/go-ethereum) Go-Ethereum (Ethereum Foundation)
  - [parity](https://github.com/ethcore/parity) Rust-Ethereum build in Rust (Ethcore)
  - [testrpc](https://github.com/ethereumjs/testrpc) JS-Testing Node (Ethereumjs)

### Testing
  - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
  - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
  - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
  - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
  - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts
  - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework

### Wallets
  - [mist](https://github.com/ethereum/mist/releases) -- turns your browser into an Ethereum enabled browser =D
  - [geth](https://github.com/ethereum/go-ethereum) -- standard Ethereum wallet
  - [parity](https://github.com/ethcore/parity) -- standard Ethereum wallet
  - [ethers-wallet](https://github.com/ethers-io/ethers-wallet) -- an amazingly small Ethereum wallet
  - [metamask](https://metamask.io/) -- turns your browser into an Ethereum enabled browser =D, a one click install **Chrome Extention**
  - [eth-lightwallet](https://github.com/ConsenSys/eth-lightwallet) -- an HD wallet built in Javascript

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.

## Special Thanks

`ethjs` was built by a strong community of Ethereum developers. A special thanks to:

  - [Fabian Vogelsteller](https://twitter.com/feindura?lang=en) - for his work on `Mist` and `web3.js`
  - [Tim Coulter](https://github.com/tcoulter) - for his work on `TestRPC` and `Truffle`
  - [Aaron Davis](https://github.com/kumavis) - for his guidence and work on `MetaMask` and `ethereumjs`
  - [Richard Moore](https://github.com/ricmoo) - for his work on `ethers-io` and `ethers-wallet` from which so much of `ethjs` is build from
  - [Karl Floersch](https://twitter.com/karl_dot_tech?lang=en) - for his guidence and support
  - [Martin Betsy](https://github.com/wanderer) - for his work on `ethereumjs`
  - [Alex Beregszaszi](https://github.com/axic) - for his work on `ethereumjs`
  - [Vitalik Buterin](https://twitter.com/VitalikButerin) - for creating `Ethereum`
