const WalletReducer = (state, { type, payload }) => {
  switch (type) {
    case "UPDATE_ALL":
      return {
        ...state,
        provider: payload.provider,
        chainId: payload.chainId,
        account: payload.account,
        signer: payload.signer,
      }
    case "UPDATE_C_A":
      return {
        ...state,
        account: payload.account,
        chainId: payload.chainId,
      }
    case "UPDATE_CHAIN_ID":
      return {
        ...state,
        chainId: payload,
      }
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: payload,
      }
    case "DISCONNECT":
      return {
        ...state,
        account: null,
      }
  }
}

export default WalletReducer
