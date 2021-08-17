import { ethers } from "hardhat";
import { formatBytes32String, keccak256, solidityKeccak256 } from "ethers/lib/utils";

export const computeMerkleProof = (leaves: string[], index: number): [string[], boolean[]] => {
  var path = index;

  let leavess = leaves.map(x => x);
  var proof = [];
  let sides: boolean[] = [];
  while (leavess.length > 1) {
    if ((path % 2) == 1) {
      proof.push(leavess[path - 1])
      sides.push(true);
    } else {
      if (path + 1 < leavess.length) {
        proof.push(leavess[path + 1]);
        sides.push(false);
      }
    }

    // Reduce the merkle tree one level
    leavess = reduceMerkleBranches(leavess);

    // Move up
    path = Math.floor(path / 2);
  }

  return [proof, sides];
}

function reduceMerkleBranches(leavess: string[]) {
  var output: string[] = [];

  while (leavess.length) {
    var left = leavess.shift()!;
    if (leavess.length === 0) {
      output.push(left);
      break;
    }
    var right = (leavess.length === 0) ? ethers.constants.HashZero : leavess.shift();

    const leaf = solidityKeccak256(["bytes32", "bytes32"], [left, right]);
    output.push(leaf);
  }

  return output;
}
