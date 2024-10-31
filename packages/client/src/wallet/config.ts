import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  base,
} from 'wagmi/chains';


export const wagmiConfig = getDefaultConfig({
  appName: 'Hamster App',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [base],
});
