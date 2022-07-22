import { useContext } from "react"
import { WalletStateContext, WalletDispatchContext } from "./WalletContext"

export const useDispatchWallet = () => useContext(WalletDispatchContext)

export const useWallet = () => useContext(WalletStateContext)
