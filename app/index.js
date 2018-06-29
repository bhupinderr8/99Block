const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const Wallet = require('../Wallet/index');
const TransactionPool = require('../Wallet/transaction-pool');
const P2pServer = require('./p2p-server');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 8080;

const app = express();
const wallet = new Wallet();
const tp = new TransactionPool();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/blocks', (req, res) =>{
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions', (req,res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req, res) => {
    const {recipient, amount} = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadCastTransaction(transaction);
    res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added ${block.toString()}`);
    res.redirect('/blocks');
});

app.get('/public-key', (req, res) => {
    res.json({publickKey: wallet.publicKey});
});

app.listen(HTTP_PORT, () => console.log(`Listening to port ${HTTP_PORT}`));
p2pServer.listen();