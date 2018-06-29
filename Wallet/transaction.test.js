const Wallet = require('./index');
const Transaction = require('./transaction');
const {MINING_REWARD} = require('../config');

describe('Blockchain',() => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'rechioat';
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount);
    });

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amount);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 5000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('and updating a transaction', () => {
        let nextAmount, nextRecipient;
    
        beforeEach(() => {
            nextAmount = 30;
            nextRecipient = '1289e1nsc';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });
    
        it(`subtracts the next amount from sender's wallet`, () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });
    
        it(`Outputs an amount for next recipient`, () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });
    });

    describe(`creating a reward transaction`, () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it(`rewards the miner`, () => {
            expect(transaction.outputs.find(t => t.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });
    });

});