export enum GameMessagePatterns {
  GAME_findGameDetailsByGameId = "GAME_findGameDetailsByGameId",
  GAME_editGameBaseInfo = "GAME_editGameBaseInfo",
  GAME_editGameStatus = "GAME_editGameStatus",
  GAME_findGameWinningRulesByGameId = "GAME_findGameWinningRulesByGameId",
  GAME_saveGameWinningRules = "GAME_saveGameWinningRules",
  GAME_findRoundById = "GAME_findRoundById",
  GAME_findRoundByGameIdAndTurnNumber = "GAME_findRoundByGameIdAndTurnNumber",
  GAME_findRoundByActive = "GAME_findRoundByActive",
  GAME_findRoundSummaryByGameIdAndTurnNumber = "GAME_findRoundSummaryByGameIdAndTurnNumber",
  GAME_findRoundSummaryByActive = "GAME_findRoundSummaryByActive",
  GAME_findRoundSummaryPagination = "GAME_findRoundSummaryPagination",
  GAME_divideRoundByCycleCode = "GAME_divideRoundByCycleCode",
  GAME_findWinningNumberByRoundId = "GAME_findWinningNumberByRoundId",
  GAME_createWinningNumber = "GAME_createWinningNumber",
  GAME_forcedBatchJob = "GAME_forcedBatchJob",
  GAME_resetRoundByCycleCode = "GAME_resetRoundByCycleCode",

  TICKET_findBundleTicketDetailById = "TICKET_findBundleTicketDetailById",
  TICKET_findTicketDetailPaginationByOwnerId = "TICKET_findTicketDetailPaginationByOwnerId",
  TICKET_createIssuedTicket = "TICKET_createIssuedTicket",
  TICKET_createBundleIssuedTicket = "TICKET_createBundleIssuedTicket",
  TICKET_findOngoingTicketByOwnerId = "TICKET_findOngoingTicketByOwnerId",
  TICKET_findAdminTicketDetailById = "TICKET_findAdminTicketDetailById",
  TICKET_findAdminTotalTicketList = "TICKET_findAdminTotalTicketList",
  TICKET_findTicketTransactionList = "TICKET_findTicketTransactionList",
  TICKET_findTicketTransactionDetails = "TICKET_findTicketTransactionDetails",
  TICKET_findWinningTicketDetailByFilterSort = "TICKET_findWinningTicketDetailByFilterSort",
  TICKET_createEmptyTicket = "TICKET_createEmptyTicket",
  TICKET_deleteEmptyTicket = "TICKET_deleteEmptyTicket",

  FINANCE_findAssetById = "FINANCE_findAssetById",
  FINANCE_findAssetByOwnerIdAndAssetType = "FINANCE_findAssetByOwnerIdAndAssetType",
  FINANCE_createAsset = "FINANCE_createAsset",
  FINANCE_findAssetTransactionById = "FINANCE_findAssetTransactionById",
  FINANCE_findAssetTransactionPaginationByFilterSort = "FINANCE_findAssetTransactionPaginationByFilterSort",
  FINANCE_pointDeposit = "FINANCE_pointDeposit",
  FINANCE_buyTicket = "FINANCE_buyTicket",
  FINANCE_cancelTicket = "FINANCE_cancelTicket",
  FINANCE_requestPrizeClaimable = "FINANCE_requestPrizeClaimable",
  FINANCE_findPrizePayoutDetailById = "FINANCE_findPrizePayoutDetailById",
  FINANCE_findPrizePayoutDetailByFilterSort = "FINANCE_findPrizePayoutDetailByFilterSort",
  FINANCE_confirmPayout = "FINANCE_confirmPayout",
}