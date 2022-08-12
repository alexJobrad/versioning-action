import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { resolve } from 'path'
import { CommandRunner } from './CommandRunner'
import { createNewCandidateVersion } from './VersionProvider'
import {wait} from './wait'

async function run(): Promise<void> {

  // idea: get git tags, here, and then create a new version from it
  const gitTags = await CommandRunner('git tag --list --sort=-committerdate')
  const newVersionString = createNewCandidateVersion('patch', gitTags)

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

run()
