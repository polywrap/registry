import { exec, ExecException } from "child_process";

export default async function runCommand(
  command: string,
  quiet: boolean,
  cwd: string
): Promise<void> {
  if (!quiet) {
    console.log(`> ${command}`);
  }

  return new Promise((resolve, reject) => {
    const callback = (
      err: ExecException | null,
      stdout: string,
      stderr: string
    ) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        }

        resolve();
      }
    };

    exec(command, { cwd: cwd }, callback);
  });
}