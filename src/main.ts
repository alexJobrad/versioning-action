import * as core from '@actions/core'
import {CommandRunner} from './CommandRunner'
import {createNewCandidateVersion, createNewVersion} from './VersionProvider'

type ReleaseType = 'major' | 'minor' | 'patch' | 'release'

async function run(): Promise<void> {
  // don't delete these, yet, maybe, we need them in the main.ts later...
  const gitTags = await CommandRunner('git tag --list --sort=-version:refname')
  // const gitTags = await CommandRunner('git tag --list --sort=-committerdate')
  core.debug('I found following git tags: ' + gitTags)
  // const newVersionString = createNewCandidateVersion('patch', gitTags)

  try {
    const releaseType: ReleaseType = core.getInput('releaseType') as ReleaseType
    const newVersion = await performRelease(releaseType, gitTags)

    core.debug("new version string: " + newVersion)

    if (newVersion == 'undefined') {
      core.setFailed("Couldn't create release!")
    }
    core.setOutput('newVersion', newVersion)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export async function performRelease(
  releaseType: ReleaseType,
  gitTags: string
): Promise<string> {
  if (releaseType === 'release') {
    return createNewVersion(gitTags)
  } else {
    return createNewCandidateVersion(releaseType, gitTags)
  }
}

run()
