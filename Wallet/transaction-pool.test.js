const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {

    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, '1hejkasd', 30);
        tp.updateOrAddTransactions(transaction);
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
});