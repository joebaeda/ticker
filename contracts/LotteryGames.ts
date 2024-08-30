export const LotteryGames = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_tokenFactory",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8[4]",
                "name": "userNumbers",
                "type": "uint8[4]"
            }
        ],
        "name": "BetPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "round",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8[4]",
                "name": "winningNumbers",
                "type": "uint8[4]"
            },
            {
                "indexed": false,
                "internalType": "address[]",
                "name": "winners",
                "type": "address[]"
            }
        ],
        "name": "DrawCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PrizeWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ReceivedEther",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ReceivedTokens",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "buyLotteryGameToken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creator",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creatorFeePercentage",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentRound",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "draw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factory",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "roundNumber",
                "type": "uint256"
            }
        ],
        "name": "getRoundData",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isDrawn",
                "type": "bool"
            },
            {
                "internalType": "uint8[4]",
                "name": "winningNumbers",
                "type": "uint8[4]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "playerAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8[4]",
                        "name": "numbers",
                        "type": "uint8[4]"
                    }
                ],
                "internalType": "struct LotteryGame.Player[]",
                "name": "players",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUserStats",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "betCount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalSpentTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "roundCompleted",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_minimumBetTokens",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_creatorFeePercentage",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_tokenAddress",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minimumBetTokens",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8[4]",
                "name": "userNumbers",
                "type": "uint8[4]"
            },
            {
                "internalType": "uint256",
                "name": "tokenBetAmount",
                "type": "uint256"
            }
        ],
        "name": "placeBetWithTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_creatorFeePercentage",
                "type": "uint256"
            }
        ],
        "name": "setCreatorFeePercentage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_minimumBetTokens",
                "type": "uint256"
            }
        ],
        "name": "setminimumBetTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenFactory",
        "outputs": [
            {
                "internalType": "contract ILotteryGamesTokenFactory",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "roundNumber",
                "type": "uint256"
            }
        ],
        "name": "withdrawPrize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawUnusedEther",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]