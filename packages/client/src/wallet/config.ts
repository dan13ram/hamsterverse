import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  base,
  //mainnet,
} from 'wagmi/chains';


export const wagmiConfig = getDefaultConfig({
  appName: 'Hamsterverse',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [base],
});
