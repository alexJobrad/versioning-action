import { CommandRunner } from "./CommandRunner"

interface SemanticVersion {
    major: number
    minor: number
    patch: number
    candidate?: number
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
  
  export async function getCommitLog (): Promise<string> {
    let gitVersionPromise = CommandRunner ('git log --pretty="format: %H | %D"');
    return gitVersionPromise
  }
  
  export async function getLastVersion (gitTags: string) : Promise<string> {
    // don't delete these, yet, maybe, we need them in the main.ts later...
    // const gitLog = await CommandRunner('git tag --list --sort=-version:refname')
    // const gitLog = await CommandRunner('git tag --list --sort=-committerdate')
    const versionRegEx = '^v([0-9]+)\.([0-9]+)\.([0-9]+)$'
  
    let lastVersion: string
  
    lastVersion = gitTags
      .split('\n')
      .filter( (line) => {
        if (line.match(versionRegEx)) {
          return true
        } else {
          return false
        }
      })[0]
  
    return lastVersion
  }
  
  export async function getLastReleaseCandidate (gitTags: string) : Promise<string> {
    const candidateRegEx = '^v([0-9]+)\.([0-9]+)\.([0-9]+)-RC([0-9]+)$'
  
    let candidateVersion: string
    
    candidateVersion = gitTags
      .split('\n')
      .filter( (line) => {
        if (line.match(candidateRegEx)) {
          return true
        } else {
          return false
        }
      })[0]
  
    return candidateVersion
  }
  
  export function isLastVersionCandidate (gitTags: string) : boolean {
    let regEx = '^v([0-9]+)\.([0-9]+)\.([0-9]+)(-RC([0-9]+))?$'
    let lastVersionString = gitTags
      .split('\n')
      .filter( (line) => {
        if (line.match(regEx)) {
          return true
        }
      })[0]
    if ( lastVersionString.includes('RC') ) {
      return true
    }
    return false
  }
  
  export function createVersionString (version: SemanticVersion) : string {
    let versionString = "v" + version.major + "." + version.minor + "." + version.patch
    if (version.candidate) {
      return versionString + "-RC" + version.candidate
    }
    return versionString
  }
  
  export async function createNewCandidateVersion (releaseType: 'major' | 'minor' | 'patch', gitTags: string) : Promise<string> {
  
    let lastVersionString: string = await getLastVersion(gitTags)
    if (!lastVersionString) {
        lastVersionString = "v0.0.1"
    }
    let lastCandidateString: string = await getLastReleaseCandidate(gitTags)
    if (!lastCandidateString) {
        lastCandidateString = "v0.0.1-RC1"
    }
  
    const lastVersion = parseTagString(lastVersionString)
    const lastCandidate = parseTagString(lastCandidateString)
  
    let newVersion: SemanticVersion = {
      major: 0,
      minor: 0,
      patch: 1
    }
  
    function createVersionFromLastVersion () {
      switch(releaseType) {
        case 'patch':
          newVersion.major = lastVersion!.major
          newVersion.minor = lastVersion!.minor
          newVersion.patch = lastVersion!.patch + 1
          break;
        case 'minor':
          newVersion.major = lastVersion!.major
          newVersion.minor = lastVersion!.minor + 1
          newVersion.patch = 0
          break;
        case 'major':
          newVersion.major = lastVersion!.major + 1
          newVersion.minor = 0
          newVersion.patch = 0
          break;
      }
      newVersion.candidate = 1
    }
    
    if (isLastVersionCandidate(gitTags)) {
      if (lastVersion![releaseType] < lastCandidate![releaseType]) {
        newVersion.major = lastCandidate!.major
        newVersion.minor = lastCandidate!.minor
        newVersion.patch = lastCandidate!.patch
        newVersion.candidate = lastCandidate!.candidate! + 1
      } else {
        createVersionFromLastVersion()
      }
    } else {
      createVersionFromLastVersion()
    }
  
    return createVersionString(newVersion)
  }
  