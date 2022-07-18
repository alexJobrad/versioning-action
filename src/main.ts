import * as core from '@actions/core'
import {wait} from './wait'

interface SemanticVersion {
  major: number
  minor: number
  patch: number
  candidate?: number
}

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function parseTagString(tagString: string): SemanticVersion | undefined {
  const regEx =
    '^v(?<major>[0-9]+).(?<minor>[0-9]+).(?<patch>[0-9]+)(-RC(?<candidate>[0-9]+))?$'

  const matches = tagString.match(regEx)

  if (matches) {
    const versionConstruct: SemanticVersion = {
      major: 0,
      minor: 0,
      patch: 0
    }
    if (matches.groups) {
      versionConstruct.major = Number(matches.groups['major'])
      versionConstruct.minor = Number(matches.groups['minor'])
      versionConstruct.patch = Number(matches.groups['patch'])
      versionConstruct.candidate = Number(matches.groups['candidate'])
    }
    return versionConstruct
  }
  return undefined
}

run()
