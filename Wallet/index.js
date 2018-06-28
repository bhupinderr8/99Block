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

    createTransaction(recipient, amount, transactionPool){
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
}

module.exports = Wallet;