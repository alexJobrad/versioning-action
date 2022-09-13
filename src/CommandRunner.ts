import * as core from '@actions/core'
import * as exec from '@actions/exec'

export const CommandRunner = async (
  command: string,
  ...args: any
): Promise<string> => {
  let output = '',
    errors = ''
  let options: exec.ExecOptions = {}
  options.silent = true
  options.listeners = {
    stdout: (data: any) => {
      output += data.toString()
    },
    stderr: (data: any) => {
      errors += data.toString()
    }
  }

  try {
    await exec.exec(command, args, options)
  } catch (err) {
    core.info(`The command cd '${command} ${args.join(' ')}' failed: ${err}`);
  }

  if (errors !== '') {
    core.info(`stderr: ${errors}`);
  }

  return output
}
