class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return require('crypto').createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data))
      .digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if(currentBlock.previousHash !== prevBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Example usage:
let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, new Date().toISOString(), { amount: 100 }));
myCoin.addBlock(new Block(2, new Date().toISOString(), { amount: 50 }));

console.log(JSON.stringify(myCoin, null, 4));
console.log("Is blockchain valid? " + myCoin.isChainValid());
