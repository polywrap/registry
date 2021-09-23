export const toPrettyHex = (hex: string): string => {
  return `${hex.slice(0, 6)}...${hex.slice(-4, hex.length)}`;
};
