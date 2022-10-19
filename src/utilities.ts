import {commandRunner} from './command-runner'

interface SemanticVersion {
  major: number
  minor: number
  patch: number
  candidate?: number
}

/**
 * Parses a tag string and return a SemanticVersion
 * @param tagString String containing the tag
 * @returns SemanticVersion or undefined
 */
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

export async function getCommitLog(): Promise<string> {
  const gitVersionPromise = commandRunner('git log --pretty="format: %H | %D"')
  return gitVersionPromise
}

/**
 * Return the last release version from a list of git tags.
 * @param gitTags String containing all git tags.
 * @returns The last release version as SemanticVersion object.
 */
export function getLastVersion(gitTags: string): string {
  const versionRegEx = '^v([0-9]+).([0-9]+).([0-9]+)$'

  const lastVersion = gitTags
    .split('\n')
    .filter(line => line.match(versionRegEx))[0]

  return lastVersion
}

/**
 * Create a new release candidate based on the given tags.
 * @param gitTags String containing all git tags.
 * @returns The new release candidate as SemanticVersion object.
 */
export function getLastReleaseCandidate(gitTags: string): string {
  const candidateRegEx = '^v([0-9]+).([0-9]+).([0-9]+)-RC([0-9]+)$'

  const candidateVersion = gitTags
    .split('\n')
    .filter(line => line.match(candidateRegEx))[0]

  return candidateVersion
}

/**
 * Checks wether the last version tag is a release candidate or not.
 * @param gitTags String containing all git tags.
 * @returns True, if the last version tag is a release candidate.
 */
export function isLastVersionCandidate(gitTags: string): boolean {
  const regEx = '^v([0-9]+).([0-9]+).([0-9]+)(-RC([0-9]+))?$'

  const lastVersionString = gitTags
    .split('\n')
    .filter(line => line.match(regEx))[0]

  if (lastVersionString !== undefined && lastVersionString.includes('RC')) {
    return true
  }
  return false
}

/**
 * Creates a String from a SemanticVersion object
 * @param version SemanticVersion object
 * @returns String containing the version object
 */
export function createVersionString(version: SemanticVersion): string {
  const versionString = 'v'.concat(
    String(version.major),
    '.',
    String(version.minor),
    '.',
    String(version.patch)
  )
  if (version.candidate) {
    return ''.concat(versionString, '-RC', String(version.candidate))
  }
  return versionString
}

/**
 * Creates a new release candidate based on the given git tags and the version level to increase.
 * @param releaseType Defines, what version level to increase, 'major', 'minor' or 'patch'
 * @param gitTags String containing all git tags.
 * @returns
 */
export function createNewCandidateVersion(
  releaseType: 'major' | 'minor' | 'patch',
  gitTags: string
): string {
  let lastVersionString: string = getLastVersion(gitTags)
  if (!lastVersionString) {
    lastVersionString = 'v0.0.1'
  }
  let lastCandidateString: string = getLastReleaseCandidate(gitTags)
  if (!lastCandidateString) {
    lastCandidateString = 'v0.0.1-RC1'
  }

  const lastVersion = parseTagString(lastVersionString)
  const lastCandidate = parseTagString(lastCandidateString)

  const newVersion: SemanticVersion = {
    major: 0,
    minor: 0,
    patch: 1
  }

  function createVersionFromLastVersion(): void {
    switch (releaseType) {
      case 'patch':
        newVersion.major = lastVersion?.major ?? 0
        newVersion.minor = lastVersion?.minor ?? 0
        newVersion.patch =
          lastVersion && lastVersion.patch ? lastVersion.patch + 1 : 1
        break
      case 'minor':
        newVersion.major = lastVersion?.major ?? 0
        newVersion.minor =
          lastVersion && lastVersion.minor ? lastVersion.minor + 1 : 1
        newVersion.patch = 0
        break
      case 'major':
        newVersion.major =
          lastVersion && lastVersion.major ? lastVersion.major + 1 : 1
        newVersion.minor = 0
        newVersion.patch = 0
        break
    }
    newVersion.candidate = 1
  }

  if (isLastVersionCandidate(gitTags)) {
    if (
      lastVersion &&
      lastCandidate &&
      lastVersion[releaseType] < lastCandidate[releaseType]
    ) {
      newVersion.major = lastCandidate?.major ?? 0
      newVersion.minor = lastCandidate?.minor ?? 0
      newVersion.patch = lastCandidate?.patch ?? 0
      newVersion.candidate = lastCandidate.candidate
        ? lastCandidate.candidate + 1
        : 1
    } else {
      createVersionFromLastVersion()
    }
  } else {
    createVersionFromLastVersion()
  }

  return createVersionString(newVersion)
}

export function createNewVersion(gitTags: string): string {
  if (!isLastVersionCandidate(gitTags)) {
    return 'undefined'
  }
  const lastReleaseCandidate = parseTagString(getLastReleaseCandidate(gitTags))
  if (lastReleaseCandidate?.candidate) {
    lastReleaseCandidate.candidate = undefined
  }
  return createVersionString(
    lastReleaseCandidate ?? {major: 0, minor: 0, patch: 0}
  )
}
