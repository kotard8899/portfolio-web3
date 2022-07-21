import Head from "next/head"
import { WalletButton } from "@/components/Wallet"

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        hello
        <div className="">test</div>
        <WalletButton />
      </main>
    </div>
  )
}
