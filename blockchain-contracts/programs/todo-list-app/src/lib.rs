use anchor_lang::prelude::*;

declare_id!("HVzwtWs8uPGWMPTywKmyqSqi9YavpqW3qMyXGhGidkSk");

#[program]
pub mod bidding_system {
    use super::*;

    pub fn create_bid_pool(ctx: Context<CreateBidPool>, bid_pool_id: String, logistics_id: String) -> Result<()> {
        let bid_pool = &mut ctx.accounts.bid_pool;
        bid_pool.id = bid_pool_id;
        bid_pool.logistics_id = logistics_id.clone(); // Clone if necessary for later use
        bid_pool.bids = Vec::new();
        msg!("Bid pool created with ID: {}, Logistics ID: {}", &bid_pool.id, &logistics_id); // Logging with borrowed values
        Ok(())
    }

    pub fn submit_bid(ctx: Context<SubmitBid>, amount: u64, logistics_id: String) -> Result<()> {
        let bid_pool = &mut ctx.accounts.bid_pool;
        let bid = Bid {
            bidder: *ctx.accounts.bidder.key,
            amount,
            is_accepted: false,
            logistics_id: logistics_id.clone(), // Clone if necessary for later use
        };
        bid_pool.bids.push(bid);
        msg!("Bid submitted to Pool ID: {}, Amount: {}, Logistics ID: {}", &bid_pool.id, amount, &logistics_id); // Logging with borrowed values
        Ok(())
    }

    pub fn accept_bid(ctx: Context<ManageBid>, bidder_pubkey: Pubkey) -> Result<()> {
        let bid_pool = &mut ctx.accounts.bid_pool;
        for bid in bid_pool.bids.iter_mut() {
            if bid.bidder == bidder_pubkey {
                bid.is_accepted = true;
                msg!("Bid accepted for Bidder: {} in Pool ID: {}", bidder_pubkey, &bid_pool.id); // Logging
                return Ok(());
            }
        }
        Err(ErrorCode::BidNotFound.into())
    }

    pub fn cancel_bid(ctx: Context<ManageBid>, bidder_pubkey: Pubkey) -> Result<()> {
        let bid_pool = &mut ctx.accounts.bid_pool;
        if let Some(index) = bid_pool.bids.iter().position(|bid| bid.bidder == bidder_pubkey) {
            bid_pool.bids.remove(index);
            msg!("Bid cancelled for Bidder: {} in Pool ID: {}", bidder_pubkey, &bid_pool.id); // Logging
            return Ok(());
        }
        Err(ErrorCode::BidNotFound.into())
    }
}

#[derive(Accounts)]
pub struct CreateBidPool<'info> {
    #[account(init, payer = user, space = 8 + 32 + 64 + 4 + (64 * 100))] // Adjust space as needed
    pub bid_pool: Account<'info, BidPool>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitBid<'info> {
    #[account(mut)]
    pub bid_pool: Account<'info, BidPool>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub bidder: Signer<'info>,
}

#[derive(Accounts)]
pub struct ManageBid<'info> {
    #[account(mut)]
    pub bid_pool: Account<'info, BidPool>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct BidPool {
    pub id: String,
    pub logistics_id: String,
    pub bids: Vec<Bid>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Bid {
    pub bidder: Pubkey,
    pub amount: u64,
    pub is_accepted: bool,
    pub logistics_id: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The specified bid was not found.")]
    BidNotFound,
}
