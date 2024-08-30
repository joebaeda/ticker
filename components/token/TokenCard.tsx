// TokenCard.tsx
import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const generateColorFromToken = (tokenAddress: string): string => {
  const hash = CryptoJS.SHA256(tokenAddress).toString();
  return `#${hash.substring(0, 6)}`;
};

interface TokenCardProps {
  tokenAddress: string
  symbol: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ tokenAddress, symbol }) => {
  const [tokenColor, setTokenColor] = useState<string>('');
  const svg = generateSvg(tokenColor, symbol);

  useEffect(() => {
    if (tokenAddress) {
      const color = generateColorFromToken(tokenAddress);
      setTokenColor(color);
    }
  }, [tokenAddress]);

  return (
    <div dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

const generateSvg = (tokenColor: string, symbol: string) => {
  const textColor = "#D3D3D3";

  return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect rx="8" width="100%" height="100%" fill="${tokenColor }" />
            <text font-weight="bold" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="20" fill="${textColor}">
                $${symbol}
            </text>
      </svg>
  `;
};

export default TokenCard;