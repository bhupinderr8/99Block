# 99Block
This mini-project implements cryptocurrency using blockchain. Nodejs is used because of its easy implementation of server-side.

## Blockchain
This code part implements the block class. Block has the following members:

- TimeStamp unique and created for hashing purpose

- LastHash used to connect the current block with the last block.

- Hash For hashing purpose, SHA-256 is used using sha256 module

- Data generic value. It would be equal to the transaction in case of cryptocurrency.

- Difficulty Determines the time required for inserting a new blockchain

- Nonce For hashing purpose.

The Blockchain part(index.js) is used to create a linked list for the block class. This blockchain class ensures wether the current linked list of blocks is valid.

## Wallet
This folder contains all the files related to the transactions and storage of wallet information.

### Transaction
Here, to implement a transaction, we need to create a transaction class which will be the data of our blockchain. Also, one has to manually check for the validity of a transaction, so a transaction pool is created. First of all, the transaction is stored in the transaction pool from which it will be added to the blockchain only after validation.

### Wallet
This is unique for every person. As the user registers, he/she will be given a wallet having the following features:

- Balance
- Public Key
- Signature

## App
This part implements p2p communications and mining.

### Server
This is used for the p2p connection. As the user comes online, he/she will first synchronize the blockchain and then will be able to mine.

### Mine
For mining purposes, a miner class is created explicitly.
