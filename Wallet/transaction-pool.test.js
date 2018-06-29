const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain/index');

describe('TransactionPool', () => {

    let tp, wallet, transaction, bc;

    beforeEach(() => {
        bc = new Blockchain();
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = wallet.createTransaction('b23hjb2vvc', 30, bc, tp);
    });

    it('adds a transaction to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });

    it('updates transactions in the pool', () => {

        const oTransaction = JSON.stringify(transaction);
        const nTransaction = transaction.update(wallet, '32rfe2r', 30);
        tp.updateOrAddTransactions(nTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === nTransaction.id))).not.toEqual(oTransaction);
    });

    it('clears transactions', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt transactions', () => {
        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for(let i=0; i<6; i++){
                wallet = new Wallet();
                transaction = wallet.createTransaction('b23hjb2vvc', 30, bc, tp);

                if(i%2 === 0) transaction.input.amount === 99999;
                else validTransactions.push(transaction);
            }
        });

        it('shows the differ between valid and corrupt transactions', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs a valid transaction', () => {
            expect(tp.validTransactions()).not.toEqual(validTransactions);
        });
    });
});