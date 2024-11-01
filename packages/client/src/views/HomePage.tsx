import { ConnectButton } from '@rainbow-me/rainbowkit';
//import { useAccount } from 'wagmi';

export const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center gap-4 bg-green-500 p-8 rounded-lg">
      <div className="mb-4">
        <ConnectButton
          accountStatus="full"
          chainStatus="full"
          showBalance={false}
        />
      </div>
    </div>
  );
};
