import fs from "fs";
import { Wallet } from "ethers";
import { prompt } from "inquirer";

interface SecretOptions {
  type: "privateKey" | "new";
  password: string;
  payload?: string;
}

export async function createSecret(options: SecretOptions): Promise<void> {
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
  await fs.promises.writeFile("./secret.json", encryptedWallet);
}

export async function getWallet(
  secret: string,
  password: string
): Promise<Wallet> {
  try {
    const wallet = await Wallet.fromEncryptedJson(secret, password);
    return wallet;
  } catch (e: any) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

export async function setup(): Promise<void> {
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
      message:
        "Enter a strong password that will be used to encrypt your wallet",
    });
  }

  if (!fs.existsSync("./secret.json")) {
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

export async function view(): Promise<void> {
  async function promptPassword(): Promise<{
    password: string;
  }> {
    return await prompt({
      type: "password",
      name: "password",
      message: "Enter your password",
    });
  }

  async function promptConfirm(): Promise<{
    confirm: boolean;
  }> {
    return await prompt({
      type: "confirm",
      name: "confirm",
      message: "Are you sure you want to reveal your private key?",
    });
  }

  if (!fs.existsSync("./secret.json")) {
    console.error("Please run setup first!");
    process.exit(1);
  }

  const { password } = await promptPassword();

  const secret = await fs.promises.readFile("./secret.json");
  const wallet = await getWallet(secret.toString(), password);

  const { confirm } = await promptConfirm();

  if (confirm === true) {
    console.log(`Address: ${wallet.address}`);
    console.log(`Private Key: ${wallet.privateKey}`);
  }
}

export async function wallet(action: string): Promise<void> {
  switch (action) {
    case "setup": {
      await setup();
      break;
    }
    case "view": {
      await view();
      break;
    }
    default: {
      console.error(
        "Invalid action! Please specify one of valid actions: ['setup', 'view']"
      );
      process.exit(1);
    }
  }
}
