import { BytesLike } from "ethers";
import { arrayify } from "ethers/lib/utils";

//Pads the end of the array with zeroes
export const zeroPadEnd = (value: BytesLike, length: number): Uint8Array => {
  value = arrayify(value);

  if (value.length > length) {
    throw Error("Value out of range");
  }

  const result = new Uint8Array(length);
  result.set(value, 0);

  return result;
};
