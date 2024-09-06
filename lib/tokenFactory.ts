import { ethers } from 'ethers';
import { TickerTokenFactory } from '@/contracts/TickerTokenFactory'; // Adjust the path to your ABI

declare global {
  interface Window {
    ethereum: any;
  }
}

export const tickerContractFactoryProvider = () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

export const tickerContractFactory = (signer?: ethers.Signer) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_TICKER_TOKEN_FACTORY_ADDRESS as string,
    TickerTokenFactory,
    signer || provider
  );
  return contract;
};

export const createTicker = async (name: string, symbol: string, signer: ethers.Signer) => {
  const contract = tickerContractFactory(signer);
  const tx = await contract.createToken(name, symbol);
  await tx.wait();
  return tx;
};

export const listTokens = async () => {
  const contract = tickerContractFactory();
  const tokens = await contract.listOfAllERC20Token();
  return tokens;
};

export const isTokenCreator = async (address: string) => {
  const contract = tickerContractFactory();
  const isCreator = await contract.isCreatorAndHasToken(address);
  return isCreator;
};
