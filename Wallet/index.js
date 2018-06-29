const {INITIAL_BALANCE} = require('../config');
const Transaction = require('./transaction');
const chainUtil = require('../chain-util');
class Wallet{

    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = chainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet - 
        Balance    : ${this.balance}
        Public Key : ${this.publicKey.toString()}`
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient, amount, blockchain, transactionPool){

        this.balance = this.calculateBalance(blockchain);

        if(amount > this.balance){
            console.log('Not enough balance');
            return;
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this,recipient, amount);
        }else{
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransactions(transaction);
        }

        return transaction;
    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block => {
            block.data.forEach(transaction => {
                transactions.push(transaction);
            });
        });

        let startTime = 0;

        const walletInputTs = transactions.filter(t => t.input.address === this.publicKey);
        if(walletInputTs.length > 0){
            const recentT = walletInputTs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );

            balance = recentT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentT.input.timestamp;
        }

        transactions.forEach(t => {
            if(t.input.timestamp > startTime) {
                t.outputs.find(o => {
                    if(o.address === this.publicKey) balance += o.amount;
                });
            }
        });

        return balance;
    }

    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.publicKey = 'blockchain-wallet';
        return blockchainWallet;
    }
}

module.exports = Wallet;