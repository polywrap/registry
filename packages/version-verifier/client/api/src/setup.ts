import fs from "fs/promises";
import { Wallet } from "ethers";
import { prompt } from "inquirer";

interface SecretOptions {
  type: "privateKey" | "new";
  password: string;
  payload?: string;
}

async function promptWalletType(): Promise<{
  type: "privateKey" | "new";
}> {
  return await prompt([
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
}

async function promptPrivateKey(): Promise<{
  payload?: string;
}> {
  return await prompt({
    type: "input",
    name: "payload",
    message: "Enter your privateKey",
  });
}

async function promptPassword(): Promise<{
  password: string;
}> {
  return await prompt({
    type: "password",
    name: "password",
    message: "Enter a strong password that will be used to encrypt your wallet",
  });
}

async function createSecret(options: SecretOptions): Promise<void> {
  let wallet: Wallet;
  switch (options.type) {
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
    const walletType = await promptWalletType();
    let payload: {
      payload?: string;
    } = {};
    switch (walletType.type) {
      case "privateKey": {
        payload = await promptPrivateKey();
        break;
      }
    }
    const password = await promptPassword();

    await createSecret({ ...walletType, ...payload, ...password });
  }
}
