export const toPrettyHex = (hex: string): string => {
  return hex
    ? `${hex.slice(0, 6)}...${hex.slice(-4, hex.length)}`
    : "0x00...0000";
};
