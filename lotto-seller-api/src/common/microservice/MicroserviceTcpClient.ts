export enum TcpServices {
  LOTTO_GAME_SERVER = "LOTTO_GAME_SERVER",
  LOTTO_AUTH_SERVER = "LOTTO_AUTH_SERVER",
}

export enum GameTcpCommands {
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
}

export enum TicketTcpCommands {
  TICKET_DETAILS_BY_ID = "TICKET_DETAILS_BY_ID",
  TICKET_BUNDLE_DETAILS_BY_ID = "TICKET_BUNDLE_DETAILS_BY_ID",
  TICKET_BUNDLE_findTicketDetailPaginationByOwnerId = "TICKET_BUNDLE_findTicketDetailPaginationByOwnerId",
  TICKET_ISSUING_TICKET = "TICKET_ISSUING_TICKET",
  TICKET_BUNDLE_ISSUING_TICKET = "TICKET_BUNDLE_ISSUING_TICKET",
  TICKET_BUNDLE_findOngoingTicketByOwnerId = "TICKET_BUNDLE_findOngoingTicketByOwnerId",
  TICKET_ADMIN_DETAILS_BY_ID = "TICKET_ADMIN_DETAILS_BY_ID",
  TICKET_ADMIN_TOTAL_LIST = "TICKET_ADMIN_TOTAL_LIST",
  TICKET_ADMIN_TRANSACTION_LIST = "TICKET_ADMIN_TRANSACTION_LIST",
  TICKET_ADMIN_TRANSACTION_DETAILS = "TICKET_ADMIN_TRANSACTION_DETAILS",
  TICKET_findWinningTicketDetailByFilterSort = "TICKET_findWinningTicketDetailByFilterSort",
  TICKET_BUNDLE_WINNING_TICKET = "TICKET_BUNDLE_WINNING_TICKET",
}

export enum RolePermissionTcpCommands {
  LOTTO_PERMISSION_LIST_GET = "LOTTO_PERMISSION_LIST_GET",
  LOTTO_MENU_LIST_GET = "LOTTO_MENU_LIST_GET",
  LOTTO_MENU_LIST_SET = "LOTTO_MENU_LIST_SET",
  LOTTO_ROLE_SET = "LOTTO_ROLE_SET",
  LOTTO_ROLE_GET = "LOTTO_ROLE_GET",
  LOTTO_ROLE_ALL_LIST = "LOTTO_ROLE_ALL_LIST",
  LOTTO_ROLE_EDIT = "LOTTO_ROLE_EDIT",
  LOTTO_ROLE_DeleteRole = "LOTTO_ROLE_DeleteRole",
}

export enum AccountTcpCommands {
  ACCOUNT_ADMIN_USER_BY_ID = "ACCOUNT_ADMIN_USER_BY_ID",
  ACCOUNT_ADMIN_USER_BY_USERNAME = "ACCOUNT_ADMIN_USER_BY_USERNAME",
  ACCOUNT_ADMIN_USER_BY_EMAIL = "ACCOUNT_ADMIN_USER_BY_EMAIL",
  ACCOUNT_ADMIN_LIST_BY_FILTERS = "ACCOUNT_ADMIN_LIST_BY_FILTERS",
  ACCOUNT_ADMIN_USER_DETAIL_BY_ID = "ACCOUNT_ADMIN_USER_DETAIL_BY_ID",
  ACCOUNT_ADMIN_USER_PASSWORD_HASH_BY_ID = "ACCOUNT_ADMIN_USER_PASSWORD_HASH_BY_ID",
  ACCOUNT_ADMIN_USER_CREATE = "ACCOUNT_ADMIN_USER_CREATE",
  ACCOUNT_ADMIN_USER_EDIT = "ACCOUNT_ADMIN_USER_EDIT",
  ACCOUNT_ADMIN_USER_ROLE_CREATE = "ACCOUNT_ADMIN_USER_ROLE_CREATE",
  ACCOUNT_ADMIN_INFO_BY_ID = "ACCOUNT_ADMIN_INFO_BY_ID",

  ACCOUNT_USER_SIGNUP = "ACCOUNT_USER_SIGNUP",
  ACCOUNT_USER_BY_ID = "ACCOUNT_USER_BY_ID",
  ACCOUNT_USER_BY_USERNAME = "ACCOUNT_USER_BY_USERNAME",
  ACCOUNT_USER_BY_EMAIL = "ACCOUNT_USER_BY_EMAIL",
  ACCOUNT_USER_PASSWORD_HASH_BY_ID = "ACCOUNT_USER_PASSWORD_HASH_BY_ID",
  ACCOUNT_USER_PROFILE_BY_ID = "ACCOUNT_USER_PROFILE_BY_ID",
  ACCOUNT_CLIENT_REGISTER_CREATE = "ACCOUNT_CLIENT_REGISTER_CREATE",
  ACCOUNT_CLIENT_REGISTER_EDIT_TOKEN = "ACCOUNT_CLIENT_REGISTER_EDIT_TOKEN",

  ACCOUNT_PLAYER_USER_TOTAL_LIST = "ACCOUNT_PLAYER_USER_TOTAL_LIST",
  ACCOUNT_PLAYER_USER_DETAIL = "ACCOUNT_PLAYER_USER_DETAIL",
  ACCOUNT_playerUserGoogleLogin = "ACCOUNT_playerUserGoogleLogin",
  ACCOUNT_playerUserLogin = "ACCOUNT_playerUserLogin",
  ACCOUNT_playerUserSignup = "ACCOUNT_playerUserSignup",
  ACCOUNT_playerUserRefreshToken = "ACCOUNT_playerUserRefreshToken",
  
  ACCOUNT_sellerUserLogin = "ACCOUNT_sellerUserLogin",
  ACCOUNT_sellerUserRefreshToken = "ACCOUNT_sellerUserRefreshToken",
}

export enum FinanceTcpCommands {
  FINANCE_findAssetById = "FINANCE_findAssetById",
  FINANCE_findAssetByOwnerIdAndAssetType = "FINANCE_findAssetByOwnerIdAndAssetType",
  FINANCE_createAsset = "FINANCE_createAsset",

  FINANCE_findAssetTransactionById = "FINANCE_findAssetTransactionById",
  FINANCE_findAssetTransactionPaginationByFilterSort = "FINANCE_findAssetTransactionPaginationByFilterSort",
  FINANCE_pointDeposit = "FINANCE_pointDeposit",
  FINANCE_buyTicket = "FINANCE_buyTicket",

  FINANCE_requestPrizeClaimable = "FINANCE_requestPrizeClaimable",
  FINANCE_findPrizePayoutDetailByFilterSort = "FINANCE_findPrizePayoutDetailByFilterSort",
}
