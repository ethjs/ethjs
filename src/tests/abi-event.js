const assert = require('chai').assert;
const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const provider = TestRPC.provider();
const Eth = require('../index.js');
const SampleMathContract = require('./SampleMath.json');

// This test uses a very simple Solidity contract that can be found
// in SampleMath.sol
// It uses the abi from that contract which is in SampleMath.json
// The asssumption is that ethjs will create the same kind of object
// from the event as web3, but as the failing test demonstrates, it does not
describe('eth.js', () => {
  describe('abitest', () => {
    it('should create event options from abi like web3', (done) => {
      const eth = new Eth(provider);
      const addr = '0x6e0E0e02377Bc1d90E8a7c21f12BA385C2C35f78';
      const SampleMathContractInstance = eth.contract(SampleMathContract.abi).at(addr);
      assert.equal(typeof SampleMathContractInstance.add, 'function');
      assert.equal(typeof SampleMathContractInstance.addEvent, 'function');
      const web3 = new Web3();
      const SampleMathContractInstanceWeb3 = web3.eth.contract(SampleMathContract.abi).at(addr);
      assert.equal(typeof SampleMathContractInstanceWeb3.add, 'function');
      assert.equal(typeof SampleMathContractInstanceWeb3.addEvent, 'function');
      /*
      const addEventWeb3 = SampleMathContractInstanceWeb3.addEvent({ a: 5 }, { fromBlock: 0, toBlock: 'latest' });
      const addEvent = SampleMathContractInstance.addEvent({ a: 5 }, { fromBlock: 0, toBlock: 'latest' });
      assert.equal(addEvent.options, addEventWeb3.options);
      */
      done();
    });
  });
});
