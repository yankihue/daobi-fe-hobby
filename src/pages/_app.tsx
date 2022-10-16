import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, chain, defaultChains } from "wagmi";
import { wagmiClient } from "@/ethereum/wagmiClient";
import PageLayout from "@/components/Layout/PageLayout";
import { SessionProvider } from "next-auth/react";

const MyDApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session}>
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </SessionProvider>
    </WagmiConfig>
  );
};

export default MyDApp;
