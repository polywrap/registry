import { ethers } from "ethers";
import { solidityKeccak256 } from "ethers/lib/utils";

export const computeMerkleProof = (
  leaves: string[],
  index: number
): [string[], boolean[]] => {
  let path = index;

  //Copy to local var so we don't accidentally modify the leaves arg
  let _leaves = [...leaves];
  const proof = [];
  const sides: boolean[] = [];
  while (_leaves.length > 1) {
    if (path % 2 == 1) {
      proof.push(_leaves[path - 1]);
      sides.push(true);
    } else {
      if (path + 1 < _leaves.length) {
        proof.push(_leaves[path + 1]);
        sides.push(false);
      }
    }

    // Reduce the merkle tree one level
    _leaves = reduceMerkleBranches(_leaves);

    // Move up
    path = Math.floor(path / 2);
  }

  return [proof, sides];
};

function reduceMerkleBranches(leaves: string[]) {
  const output: string[] = [];

  while (leaves.length) {
    const left = leaves.shift()!;
    if (leaves.length === 0) {
      output.push(left);
      break;
    }
    const right =
      leaves.length === 0 ? ethers.constants.HashZero : leaves.shift();

    const leaf = solidityKeccak256(["bytes32", "bytes32"], [left, right]);
    output.push(leaf);
  }

  return output;
}
