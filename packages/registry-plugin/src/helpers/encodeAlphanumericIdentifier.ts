import { BigNumber } from "ethers";

export const encodeAlphanumericIdentifier = (identifier: string): BigNumber => {
  if (identifier.length > 20) {
    throw Error("Identifier too long: " + identifier);
  }

  //First bit is 0 to indicate alphanumeric identifier
  let hex = BigNumber.from(1);

  for (let i = 0; i < identifier.length; i++) {
    const char = identifier[i];
    const asciiNumber = char.charCodeAt(0);
    let encodedHex = BigNumber.from(0);

    if (asciiNumber === 45) {
      encodedHex = BigNumber.from(1);
    } else if (asciiNumber >= 48 && asciiNumber <= 57) {
      encodedHex = BigNumber.from(asciiNumber - 48 + 2);
    } else if (asciiNumber >= 65 && asciiNumber <= 90) {
      encodedHex = BigNumber.from(asciiNumber - 65 + 2 + 10);
    } else if (asciiNumber >= 97 && asciiNumber <= 122) {
      encodedHex = BigNumber.from(asciiNumber - 97 + 2 + 10 + 26);
    }

    hex = hex.shl(6).or(encodedHex);
  }

  //Fill the rest with 0s
  for (let i = 0; i < 20 - identifier.length; i++) {
    hex = hex.shl(6).or(BigNumber.from(0));
  }

  return hex;
};
