import { BigNumber } from "@ethersproject/bignumber";

export class VersionNumber {
  major: number;
  minor: number;
  patch: number;

  constructor(major: number, minor: number, patch: number) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  static fromString(versionNumber: string): VersionNumber | undefined {
    const parts = versionNumber.split(".");

    if (
      parts.length != 3 ||
      !Number.isInteger(+parts[0]) ||
      !Number.isInteger(+parts[1]) ||
      !Number.isInteger(+parts[2])
    ) {
      return undefined;
    }

    return new VersionNumber(+parts[0], +parts[1], +parts[2]);
  }

  static fromBigNumbers(
    major: BigNumber,
    minor: BigNumber,
    patch: BigNumber
  ): VersionNumber {
    return new VersionNumber(
      major.toNumber(),
      minor.toNumber(),
      patch.toNumber()
    );
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
}
