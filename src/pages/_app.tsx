import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/cookie/400.css";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { ChakraProvider,extendTheme } from '@chakra-ui/react';

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const fonts = {
    heading: `'Inter', sans-serif`,
    body: `'Poppins', sans-serif`,
    customHeading: `'Inter', sans-serif`,
    customCursive: `'Poppins', sans-serif`
  };
const theme = extendTheme({fonts});

const App: FC<AppProps> = ({ Component, pageProps }) => {
    // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Wallets that implement either of these standards will be available automatically.
             *
             *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
             *     (https://github.com/solana-mobile/mobile-wallet-adapter)
             *   - Solana Wallet Standard
             *     (https://github.com/solana-labs/wallet-standard)
             *
             * If you wish to support a wallet that supports neither of those standards,
             * instantiate its legacy wallet adapter here. Common legacy adapters can be found
             * in the npm package `@solana/wallet-adapter-wallets`.
             */
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ChakraProvider theme={theme}>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <Component {...pageProps} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </ChakraProvider>
    );
};

export default App;
