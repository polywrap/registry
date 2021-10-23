import { program } from "commander";
import { run } from "./app";
import { setup } from "./setup";

program.command("run").action(run);

program.command("setup").action(setup);

program.parse(process.argv);
