const Block = require('./blockchain/block');

const block = new Block('csasc', 'cscas', 'csac', 'cass');

console.log(Block.mineBlock(Block.genesis(), 'gell'));