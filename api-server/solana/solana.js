const anchor = require('@project-serum/anchor');
const fs = require('fs');
require('dotenv').config();

const RPC_URL = process.env.SOLANA_RPC_URL;
const connection = new anchor.web3.Connection(RPC_URL, 'confirmed');
const idl = JSON.parse(fs.readFileSync('../blockchain-contracts/target/idl/bidding_system.json', 'utf8'));

const walletKeyPair = anchor.web3.Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(fs.readFileSync(process.env.SOLANA_PRIVATE_KEY_PATH)))
);
const wallet = new anchor.Wallet(walletKeyPair);

const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: 'recent' });
const programId = new anchor.web3.PublicKey(idl.metadata.address);
const program = new anchor.Program(idl, programId, provider);

async function createBidPool(bidPoolId, logisticsId) { // Now accepting logisticsId
  const bidPool = anchor.web3.Keypair.generate();
  await program.rpc.createBidPool(bidPoolId, logisticsId, { // Passing logisticsId to the smart contract
    accounts: {
      bidPool: bidPool.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [bidPool],
  });
  return bidPool.publicKey;
}

async function submitBid(bidPoolPubkey, amount, logisticsId) { // Now accepting logisticsId
  await program.rpc.submitBid(new anchor.BN(amount), logisticsId, { // Passing logisticsId to the smart contract
    accounts: {
      bidPool: new anchor.web3.PublicKey(bidPoolPubkey),
      bidder: provider.wallet.publicKey, // Assuming the bidder is the one making the request
      // Note: You might need to adjust the bidder account depending on your application's logic
    },
    signers: [], // If additional signers are needed, they would be added here
  });
}

async function acceptBid(bidPoolPubkey, bidderPubkey) {
  await program.rpc.acceptBid(new anchor.web3.PublicKey(bidderPubkey), { // Ensure bidderPubkey is correctly passed as a PublicKey
    accounts: {
      bidPool: new anchor.web3.PublicKey(bidPoolPubkey),
      user: provider.wallet.publicKey,
    },
  });
}

async function cancelBid(bidPoolPubkey, bidderPubkey) {
  await program.rpc.cancelBid(new anchor.web3.PublicKey(bidderPubkey), { // Ensure bidderPubkey is correctly passed as a PublicKey
    accounts: {
      bidPool: new anchor.web3.PublicKey(bidPoolPubkey),
      user: provider.wallet.publicKey,
    },
  });
}

module.exports = {
  createBidPool,
  submitBid,
  acceptBid,
  cancelBid,
};
