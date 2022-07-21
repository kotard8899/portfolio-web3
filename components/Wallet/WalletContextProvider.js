import { useEffect, useReducer } from "react"
import WalletReducer from "./WalletReducer"
import WalletInitialState from "./WalletInitialState"
import WalletStateContext from "./WalletStateContext"
import WalletDispatchContext from "./WalletDispatchContext"

const WalletContextProdiver = ({ children }) => {
  const [state, dispatch] = useReducer(WalletReducer, WalletInitialState)

  return (
    <WalletDispatchContext.Provider value={dispatch}>
      <WalletStateContext.Provider value={state}>
        {children}
      </WalletStateContext.Provider>
    </WalletDispatchContext.Provider>
  )
}

export default WalletContextProdiver
