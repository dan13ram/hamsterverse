import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import '@rainbow-me/rainbowkit/styles.css';
import '@fontsource/courier-prime';
import '@fontsource/creepster';

import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./contexts/MUDContext";
import mudConfig from "contracts/mud.config";
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { wagmiConfig } from "./wallet/config";
import { rainbowTheme } from "./wallet/theme";

const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient();

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then(async (result) => {
  root.render(
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <MUDProvider value={result}>
            <App />
            <ToastContainer position="top-right" draggable={false} theme="dark" />
          </MUDProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );

  // https://vitejs.dev/guide/env-and-mode.html
  if (import.meta.env.DEV) {
    const { mount: mountDevTools } = await import("@latticexyz/dev-tools");
    mountDevTools({
      config: mudConfig,
      publicClient: result.network.publicClient,
      walletClient: result.network.walletClient,
      latestBlock$: result.network.latestBlock$,
      storedBlockLogs$: result.network.storedBlockLogs$,
      worldAddress: result.network.worldContract.address,
      worldAbi: result.network.worldContract.abi,
      write$: result.network.write$,
      recsWorld: result.network.world,
    });
  }
});
