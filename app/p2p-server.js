const Websocket = require('ws');
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}
const P2P_PORT = process.env.P2P_PORT || 8081;
const peers = process.env.PEERS?process.env.PEERS.split(',') : [];

class p2pServer{
    constructor(blockchain, transactionPool){
        this.transactionPool = transactionPool;
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();



        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        })
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log(`Socket Connected`);
        this.sendChain(socket);
        this.messageHandler(socket);
    }

    messageHandler(socket){
        socket.on('message', message => {
        switch(data.type){
            case MESSAGE_TYPES.chain:
                this.blockchain.replaceChain(data.chain);
                break;
            case MESSAGE_TYPES.transaction:
                this.tp.updateOrAddTransaction(data.transaction);
                break;
        }
        });
    }

    sendChain(socket){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));
    }

    sendTransaction(socket, transaction){
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.transaction,
            transaction
        }));
    }

    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadCastTransaction(transaction){
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
}

module.exports = p2pServer;