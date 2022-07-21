import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import useWallet from "./useWallet"
import useDispatchWallet from "./useDispatchWallet"
import styles from "./Wallet.module.css"
import { providers } from "ethers"
import switchNetwork from "./switchNetwork"

const btnClassNames = [
  "cursor-pointer",
  "rounded-xl border border-secondary",
  "p-2",
  "transition duration-200",
  "hover:bg-lightBack",
]

const WalletList = ({ setIsModal, handleConnect, isMetaMaskInstalled }) => {
  return (
    <div className="flex fixed inset-0 backdrop-blur z-50">
      <div className="m-auto rounded-2xl p-6 w-80 space-y-6 bg-back border border-secondary">
        <header>
          <h1>Select wallet</h1>
        </header>
        <div className="space-y-4">
          {!isMetaMaskInstalled ? (
            <a
              className={`${btnClassNames.join(
                " ",
              )} hidden sm:flex justify-between items-center space-x-2`}
              target="_blank"
              rel="noreferrer"
              href="https://metamask.io/download.html"
            >
              <span className="ml-2">Install MetaMask</span>
              {/* <SVG className="inline-block" src="images/metamask.svg" width={32} height={32} /> */}
            </a>
          ) : (
            <div
              className={`${btnClassNames.join(
                " ",
              )} flex justify-between items-center space-x-2`}
              onClick={handleConnect}
            >
              <span className="w-44 ml-2">MetaMask</span>
              {/* <SVG className="inline-block" src={`images/${walletName}.svg`} width={32} height={32} /> */}
            </div>
          )}
        </div>
        <footer>
          <div
            className={`${btnClassNames.join(" ")} text-center`}
            onClick={() => setIsModal(false)}
          >
            Close
          </div>
        </footer>
      </div>
    </div>
  )
}

const WalletButton = () => {
  const { account, provider, signer, chainId } = useWallet()
  const dispatch = useDispatchWallet()
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)
  const [isModal, setIsModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const provider = await detectEthereumProvider()
      if (provider) {
        const etherProvider = new providers.Web3Provider(provider)
        const account = (await provider.request({ method: "eth_accounts" }))[0]
        const { chainId } = await etherProvider.getNetwork()
        const signer = etherProvider.getSigner()
        dispatch({
          type: "UPDATE_ALL",
          payload: {
            provider: etherProvider,
            account: account || null,
            chainId:
              chainId !== 4 && account
                ? await switchNetwork(provider, chainId)
                : chainId,
            signer,
          },
        })
      } else {
        setIsMetaMaskInstalled(false)
      }
    })()
  }, [dispatch])

  useEffect(() => {
    if (provider) {
      provider.provider.on("chainChanged", (chainId) => {
        dispatch({
          type: "UPDATE_CHAIN_ID",
          payload: parseInt(chainId),
        })
      })
      provider.provider.on("accountsChanged", (accounts) => {
        dispatch({
          type: "UPDATE_ACCOUNT",
          payload: accounts[0],
        })
      })
    }
  }, [dispatch, provider])

  const handleDisconnect = () => dispatch({ type: "DISCONNECT" })

  const handleConnect = async () => {
    try {
      dispatch({
        type: "UPDATE_ACCOUNT",
        payload: (await provider.send("eth_requestAccounts"))[0],
      })

      if (chainId !== 4) {
        dispatch({
          type: "UPDATE_CHAIN_ID",
          payload: await switchNetwork(provider.provider, chainId),
        })
      }

      setIsModal(false)
    } catch (e) {}
  }

  const accountShorten =
    account && account.slice(0, 6) + "..." + account.slice(38, 42)

  return (
    <>
      {account ? (
        <button
          className={`inline-block py-4 px-8 text-mon font-bold ${styles.blurBtn}`}
          onClick={handleDisconnect}
        >
          {accountShorten}
        </button>
      ) : (
        <button
          className={`inline-block py-4 px-8 text-mon font-bold ${styles.blurBtn}`}
          onClick={() => setIsModal(true)}
        >
          Connect Wallet
        </button>
      )}
      {isModal && (
        <WalletList
          setIsModal={setIsModal}
          handleConnect={handleConnect}
          isMetaMaskInstalled={isMetaMaskInstalled}
        />
      )}
    </>
  )
}

export default WalletButton
