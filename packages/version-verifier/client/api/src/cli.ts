import { program } from "commander";
import { run } from "./app";
import { wallet } from "./wallet";

program
  .command("run")
  .description("starts the version verifier node")
  .action(run);

program
  .command("wallet [action]")
  .description("setup or view wallet")
  .action(wallet);

program.parse(process.argv);
