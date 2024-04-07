import * as anchor from '@project-serum/anchor';
import { BiddingSystem } from '../target/types/bidding_system';
import assert from 'assert';

describe('bidding_system', () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.BiddingSystem as anchor.Program<BiddingSystem>;

    it('Creates a bid pool and submits a bid', async () => {
        // Generate a new keypair for the bid pool
        const bidPool = anchor.web3.Keypair.generate();

        // Fund the bid pool account to pay for its creation
        await provider.connection.confirmTransaction(
            await provider.connection.requestAirdrop(bidPool.publicKey, anchor.web3.LAMPORTS_PER_SOL),
            "confirmed"
        );

        // Create a bid pool
        const bidPoolId = "pool1";
        await program.rpc.createBidPool(bidPoolId, {
            accounts: {
                bidPool: bidPool.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [bidPool],
        });

        // Fetch the created bid pool to verify it was created successfully
        const createdBidPool = await program.account.bidPool.fetch(bidPool.publicKey);
        assert.strictEqual(createdBidPool.id, bidPoolId, "The bid pool ID does not match");
        assert.strictEqual(createdBidPool.bids.length, 0, "The bid pool should initially have no bids");

        // Generate a new keypair for the bidder
        const bidder = anchor.web3.Keypair.generate();

        // Submit a bid to the created bid pool
        const bidAmount = new anchor.BN(100);
        await program.rpc.submitBid(bidAmount, {
            accounts: {
                bidPool: bidPool.publicKey,
                user: provider.wallet.publicKey,
                bidder: bidder.publicKey,
            },
            signers: [bidder],
        });

        // Fetch the bid pool again to check if the bid was added
        const updatedBidPool = await program.account.bidPool.fetch(bidPool.publicKey);
        assert.strictEqual(updatedBidPool.bids.length, 1, "The bid pool should contain one bid");
        assert.strictEqual(updatedBidPool.bids[0].amount.toNumber(), bidAmount.toNumber(), "The bid amount does not match");
        assert.ok(updatedBidPool.bids[0].bidder.equals(bidder.publicKey), "The bidder's public key does not match");
    });
});
