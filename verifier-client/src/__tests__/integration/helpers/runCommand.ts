import { ExecException, exec } from "child_process"

export const runCommand = async (command: string, quiet: boolean, cwd: string) => {

  if (!quiet) {
    console.log(`> ${command}`)
  }

  return new Promise((resolve, reject) => {
    const callback = (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        if (!quiet) {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`)
          console.log(`stderr: ${stderr}`)
        }

        resolve(null);
      }
    }

    exec(command, { cwd: cwd }, callback)
  })
};
