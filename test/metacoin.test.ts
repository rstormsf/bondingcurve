import { MetaCoinInstance } from '../types/truffle-contracts';

const BN = require('bn.js');
const chai = require('chai');
const { expect } = require('chai');
const MetaCoin = artifacts.require('MetaCoin');

chai.use(require('chai-bn')(BN));

contract('MetaCoin', (accounts) => {
  let metaCoinInstance: MetaCoinInstance;

  beforeEach(async () => {
    metaCoinInstance = await MetaCoin.new();
  });

  it('should put 10000 MetaCoin in the first account', async () => {
    const balance = await metaCoinInstance.getBalance(accounts[0]);

    expect(balance.valueOf()).to.be.a.bignumber.that.equals(new BN('10000'));
  });

  it('should call a function that depends on a linked library', async () => {
    const metaCoinBalance = await metaCoinInstance.getBalance(accounts[0]);

    const metaCoinEthBalance = await metaCoinInstance.getBalanceInEth(
      accounts[0],
    );

    expect(metaCoinEthBalance).to.be.a.bignumber.that.equals(
      new BN(metaCoinBalance).mul(new BN('2')),
    );
  });

  it('should send coin correctly', async () => {
    // Setup 2 accounts.
    const [accountOne, accountTwo] = accounts;

    // Get initial balances of first and second account.
    const accountOneStartingBalance = await metaCoinInstance.getBalance(
      accountOne,
    );
    const accountTwoStartingBalance = await metaCoinInstance.getBalance(
      accountTwo,
    );

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = await metaCoinInstance.getBalance(
      accountOne,
    );
    const accountTwoEndingBalance = await metaCoinInstance.getBalance(
      accountTwo,
    );

    expect(accountOneEndingBalance).to.be.a.bignumber.that.equals(
      new BN(accountOneStartingBalance).sub(new BN(amount)),
    );

    expect(accountTwoEndingBalance).to.be.a.bignumber.that.equals(
      new BN(accountTwoStartingBalance).add(new BN(amount)),
    );
  });
});
