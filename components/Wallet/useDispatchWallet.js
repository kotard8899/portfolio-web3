import { Wallet } from "ethers"
import { useContext } from "react"
import WalletDispatchContext from "./WalletDispatchContext"

const useDispatchWallet = () => useContext(WalletDispatchContext)

export default useDispatchWallet
