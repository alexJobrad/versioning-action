import * as core from '@actions/core'
import * as exec from '@actions/exec'

export const commandRunner = async (
  command: string,
  args?: [string]
): Promise<string> => {
  let output = ''
  let errors = ''
  const options: exec.ExecOptions = {}
  options.silent = true
  options.listeners = {
    stdout: (data: Buffer) => {
      output += data.toString()
    },
    stderr: (data: Buffer) => {
      errors += data.toString()
    }
  }

  try {
    await exec.exec(command, args, options)
  } catch (err) {
    if (args) {
      core.info(`The command cd '${command} ${args.join(' ')}' failed: ${err}`)
    } else {
      core.info(`The command cd '${command}' failed: ${err}`)
    }
  }

  if (errors !== '') {
    core.info(`stderr: ${errors}`)
  }

  return output
}
