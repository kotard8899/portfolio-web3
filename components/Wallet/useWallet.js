import { useContext } from "react"
import WalletStateContent from "./WalletStateContext"

const useWallet = () => useContext(WalletStateContent)

export default useWallet
