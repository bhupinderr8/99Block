const {INITIAL_BALANCE} = require('../config');
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
}

module.exports = Wallet;