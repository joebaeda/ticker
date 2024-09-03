# ERC-20 Token Creator with Built-in Decentralization Features

## Project Overview

This project is a browser-based interface application that allows users to create and manage their own ERC-20 tokens on the Ethereum blockchain. Unlike traditional token creation processes that rely on external decentralized exchanges (DEXs) like Uniswap or PancakeSwap for liquidity and trading, this application integrates a built-in Automated Market Maker (AMM) directly into the smart contract. This allows the created tokens to be automatically traded once liquidity is added, providing a fully decentralized and self-contained token management solution.

## Key Features

- **Token Creation**: Easily create ERC-20 tokens with customizable names and symbols directly from the application interface.
  
- **Built-In AMM**: The application includes a built-in AMM, similar to Uniswap, which automatically determines the price of the token based on the reserves of ETH and the token itself.

- **No Need for External DEXs**: Unlike traditional tokens that require listing on external DEXs, tokens created with this application are automatically tradable within the contract itself, provided that liquidity is added.

- **Liquidity Management**: Users can add liquidity directly through the application interface, enabling the trading of their tokens.

- **Automatic Fee Collection**: The smart contract collects fees on each trade, ensuring that the liquidity pool is sustained and allowing for the collection of development fees if desired.

## How It Works

1. **Token Initialization**: The user can create a new token by specifying the token name and symbol. This initializes the token contract and sets the user as the creator.

2. **Liquidity Initialization**: Once the token is created, the user can initialize the liquidity pool by adding an initial amount of ETH and tokens. This step is crucial for enabling trading within the built-in AMM.

3. **Trading**: Users can trade ETH for tokens and vice versa directly through the contract. The smart contract uses a constant product formula to determine the exchange rate and automatically adjusts based on the reserves.

4. **Fee Collection**: A small fee (0.3%) is collected on each trade. These fees can be accumulated and used for further development or other purposes by the contract creator.

5. **Development Fee Conversion**: The smart contract allows for the conversion of collected token fees into ETH, which can then be used for development purposes or distributed as needed.

## Smart Contract Details

The smart contract is written in Solidity and leverages the OpenZeppelin library for standard ERC-20 functionality and security features. Below is a high-level overview of the key components of the contract:

- **ERC-20 Token**: The contract inherits from OpenZeppelin's ERC-20 implementation, providing standard token functionalities such as `transfer`, `approve`, and `balanceOf`.

- **Automated Market Maker (AMM)**: The contract includes a simplified AMM, allowing for the automatic determination of token prices based on liquidity reserves.

- **ReentrancyGuard**: To enhance security, the contract uses OpenZeppelin's `ReentrancyGuard` to protect against reentrancy attacks during trading operations.

- **Liquidity Management**: The contract tracks the reserves of ETH and tokens and provides functions for adding liquidity and performing swaps.

- **Fee Collection and Conversion**: The contract collects fees on trades and includes a mechanism for converting these fees into ETH, which can be used for further development or other purposes.

## Getting Started

### Prerequisites

- **Metamask**: A browser extension that allows you to interact with the Ethereum blockchain. Install Metamask from [here](https://metamask.io/).

- **Ethereum Wallet**: Ensure you have some ETH in your wallet to pay for gas fees and to add liquidity to your token.

### Installation

Clone the repository and install the required dependencies.

```bash
git clone https://github.com/ticker.git
cd ticker
npm install
```

Copy .env.example to .env or .env.local

```bash
cp .env.example .env
```

### Running the Application

```bash
npm run dev
```

This will launch the application in your default web browser.

### Creating a Token

1. Open the application in your browser.
2. Enter the desired token name and symbol.
3. Click "Create Token" to deploy your ERC-20 token on the Ethereum blockchain.

### Adding Liquidity

1. After creating the token, navigate to the "Liquidity" section.
2. Enter the amount of ETH and tokens you wish to add to the liquidity pool.
3. Click "Add Liquidity" to initialize the pool.

### Trading Tokens

1. To trade, navigate to the "Trade" section.
2. Select whether you want to swap ETH for tokens or tokens for ETH.
3. Enter the amount and click "Buy" or "Sell" button.

## Acknowledgments

This project was made possible thanks to the following technologies and platforms:

- [**Next.js**](https://nextjs.org/): A React framework that enables fast and scalable web applications.
- [**Vercel**](https://vercel.com/): A platform for deploying and hosting web applications with ease.
- [**Metamask**](https://metamask.io/): A popular Ethereum wallet and browser extension.
- [**Ether.js**](https://docs.ethers.org/v6/): A JavaScript library for interacting with the Ethereum blockchain.
- [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom designs.
- [**TypeScript**](https://www.typescriptlang.org/): A strongly typed programming language that builds on JavaScript, providing better tooling at any scale.
- [**Solidity**](https://soliditylang.org/): The programming language used to write Ethereum smart contracts.
- [**OpenZeppelin**](https://openzeppelin.com/): For their comprehensive library of secure smart contract components.

## License

This project is licensed under the MIT License. See the [LICENSE](/LICENSE.md) file for more details.

## Contact
- [Joe bae](https://t.me/joebaeda) Telegram
- [Joe bae](https://x.com/joebaeda) X Platform