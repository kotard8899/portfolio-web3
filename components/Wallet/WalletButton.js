import { useEffect, useState } from "react"
import detectEthereumProvider from "@metamask/detect-provider"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { useWallet, useDispatchWallet } from "./useWallet"
import styles from "./Wallet.module.css"
import switchNetwork from "./switchNetwork"
import { providers } from "ethers"

const btnClassNames = [
  "cursor-pointer",
  "rounded-xl border border-secondary",
  "p-2",
  "transition duration-200",
  "hover:bg-lightBack",
]

const supportChain = process.env.NEXT_PUBLIC_SUPPORT_CHAIN

const wcProvider = new WalletConnectProvider({
  rpc: {
    1: "https://mainnet.infura.io/v3/6c145e774d8640e288f94d7263558483",
    4: "https://rinkeby.infura.io/v3/6c145e774d8640e288f94d7263558483",
  },
})

const DiconnectItem = () => {
  const hasWalletConnect = !!localStorage.getItem("walletconnect")
  if (!hasWalletConnect) return null

  const handleWcDisconnect = () => {
    wcProvider.disconnect()
    window.location.reload(false)
  }

  return (
    <div
      className={`${btnClassNames.join(
        " ",
      )} flex justify-between items-center space-x-2`}
      onClick={handleWcDisconnect}
    >
      <span className="ml-2">Disconnect WalletConnect</span>
      {/* <SVG className="inline-block" src="images/walletConnect.svg" width={32} height={32} /> */}
    </div>
  )
}

const WalletListItem = ({ walletName, onClick }) => {
  let walletText
  if (walletName === "metamask") walletText = "MetaMask"
  else if (walletName === "walletConnect") walletText = "Wallet Connect"
  else if (walletName === "qubic") walletText = "Qubic"

  return (
    <div
      className={`${btnClassNames.join(
        " ",
      )} flex justify-between items-center space-x-2`}
      onClick={onClick}
    >
      <span className="w-44 ml-2">{walletText}</span>
      {/* <SVG className="inline-block" src={`images/${walletName}.svg`} width={32} height={32} /> */}
    </div>
  )
}

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
            <WalletListItem
              walletName="metamask"
              onClick={() => handleConnect("metamask")}
            />
          )}
          <WalletListItem
            walletName="walletConnect"
            onClick={() => handleConnect("walletConnect")}
          />
          <DiconnectItem />
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
  const { account, provider, chainId } = useWallet()
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
              chainId !== supportChain && account
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

  const handleConnect = async (walletName) => {
    let _account
    let _chainId = supportChain
    try {
      if (walletName === "metamask") {
        _account = (await provider.send("eth_requestAccounts"))[0]
        if (chainId !== _chainId) {
          _chainId = await switchNetwork(provider.provider, chainId)
        }
      } else {
        _account = (await wcProvider.enable())[0]
        if (wcProvider.chainId !== _chainId) {
          _account = null
          wcProvider.disconnect()
        }
      }
    } catch (e) {}
    dispatch({
      type: "UPDATE_C_A",
      payload: {
        account: _account,
        chainId: _chainId,
      },
    })
    setIsModal(false)
  }

  const accountShorten =
    account && account.slice(0, 6) + "..." + account.slice(38, 42)

  return (
    <>
      {account ? (
        <button
          className={`inline-block py-4 px-8 text-mon font-bold ${styles.blurBtn}`}
          onClick={() => dispatch({ type: "DISCONNECT" })}
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
