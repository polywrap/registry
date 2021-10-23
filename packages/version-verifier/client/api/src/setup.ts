import fs from "fs/promises";
import { Wallet } from "ethers";
import { prompt } from "inquirer";

type WalletType = {
  type: "mnemonic" | "privateKey" | "new";
};

type WalletPayload = {
  payload?: string;
};

type WalletPassword = {
  password: string;
};

interface SecretOptions {
  type: "mnemonic" | "privateKey" | "new";
  password: string;
  payload?: string;
}

async function getWalletType(): Promise<WalletType> {
  const walletType = await prompt<WalletType>([
    {
      type: "list",
      name: "type",
      message: `Select a method to create wallet: `,
      choices: [
        { name: "Create a new wallet", value: "new" },
        {
          name: "Create wallet from existing privateKey",
          value: "privateKey",
        },
        { name: "Create wallet from existing mnemonic", value: "mnemonic" },
      ],
    },
  ]);
  return walletType;
}

async function getPrivateKey(): Promise<WalletPayload> {
  const privateKey = await prompt<WalletPayload>({
    type: "input",
    name: "payload",
    message: "Enter your privateKey",
  });
  return privateKey;
}

async function getMnemonic(): Promise<WalletPayload> {
  const mnemonic = await prompt<WalletPayload>({
    type: "input",
    name: "payload",
    message: "Enter your mnemonic",
  });
  return mnemonic;
}

async function getPassword(): Promise<WalletPassword> {
  const password = await prompt<WalletPassword>({
    type: "password",
    name: "password",
    message: "Enter a strong password that will be used to encrypt your wallet",
  });
  return password;
}

async function createSecret(options: SecretOptions): Promise<void> {
  let wallet: Wallet;
  switch (options.type) {
    case "mnemonic": {
      if (!options.payload)
        throw Error("mnemonic type require payload in options");
      wallet = Wallet.fromMnemonic(options.payload);
      break;
    }
    case "privateKey": {
      if (!options.payload)
        throw Error("privateKey type require payload in options");
      wallet = new Wallet(options.payload);
      break;
    }
    case "new": {
      // Create new wallet
      wallet = Wallet.createRandom();
      break;
    }
  }

  const encryptedWallet = await wallet.encrypt(options.password);
  await fs.writeFile("./secret.json", encryptedWallet);
}

export async function setup(): Promise<void> {
  try {
    await fs.access("./secret.json");
  } catch (e) {
    // File does not exists
    const walletType = await getWalletType();
    let payload: WalletPayload = {};
    switch (walletType.type) {
      case "mnemonic": {
        payload = await getMnemonic();
        break;
      }
      case "privateKey": {
        payload = await getPrivateKey();
        break;
      }
    }
    const password = await getPassword();

    await createSecret({ ...walletType, ...payload, ...password });
  }
}
