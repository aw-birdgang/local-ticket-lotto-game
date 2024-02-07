export enum AssetType {
  USD = "USD",
}

export enum TransactionType {
  DEPOSIT_POINT = "deposit_point",
  WITHDRAW_POINT = "withdraw_point",
  BUY_TICKET = "buy_ticket",
  PRIZE_TICKET = "prize_ticket",
}

export enum OrderType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TICKET = "ticket",
  PRIZE_PAYOUT = "prize_payout",
}

export enum PrizeType {
  BIG_PRIZE = "big_prize",
  SMALL_PRIZE = "small_prize",
}

export enum PrizeStatus {
  CLAIMABLE = "claimable",
  WAITING = "waiting",
  COMPLETE = "complete",
}

export enum PayoutStatus {
  CLAIMABLE = "claimable",
  WAITING = "waiting",
  COMPLETE = "complete",
}
