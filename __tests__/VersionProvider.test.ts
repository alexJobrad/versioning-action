import {expect, test} from '@jest/globals'
import {
  getLastVersion,
  getLastReleaseCandidate,
  createNewCandidateVersion,
  parseTagString,
  createNewVersion
} from '../src/VersionProvider'

/** parseTagString */
test('parse complete tag string', () => {
  let versionConstruct = parseTagString('v1.2.3-RC4')
  expect(versionConstruct).toBeDefined()
  if (versionConstruct) {
    expect(versionConstruct.major).toBe(1)
    expect(versionConstruct.minor).toBe(2)
    expect(versionConstruct.patch).toBe(3)
    expect(versionConstruct.candidate).toBe(4)
  }
})

test('parse version release tag', () => {
  let versionConstruct = parseTagString('v16.2.493')
  expect(versionConstruct).toBeDefined()
  if (versionConstruct) {
    expect(versionConstruct.major).toBe(16)
    expect(versionConstruct.minor).toBe(2)
    expect(versionConstruct.patch).toBe(493)
    expect(versionConstruct.candidate).toBeNaN()
  }
})

test('not parsing invalid string', () => {
  let versionConstruct = parseTagString('d1.2.3-RC4')
  expect(versionConstruct).toBeUndefined()
})

test('not parsing another invalid string', () => {
  let versionConstruct = parseTagString('v1.2.3a')
  expect(versionConstruct).toBeUndefined()
})

/** getLastVersion */

test('get last version', async () => {
  const gitTags =
    'v1.112.43-RC45\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production'

  const commitLog = getLastVersion(gitTags).then(data => {
    expect(data).toBe('v1.0.0')
  })
})

/** getLastReleaseCandidate */

test('get last release candidate', async () => {
  const gitTags =
    'v1.112.43-RC45\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production'

  const commitLog = getLastReleaseCandidate(gitTags).then(data => {
    expect(data).toBe('v1.112.43-RC45')
  })
})

/** createNewCandidateVersion */

test('create new patch level release candidate', async () => {
  const gitTags = 'v1.112.43-RC45\nv1.112.43'
  createNewCandidateVersion('patch', gitTags).then(data => {
    expect(data).toBe('v1.112.44-RC1')
  })
})

test('create new patch level release candidate from previous RC', async () => {
  const gitTags = 'v1.112.44-RC45\nv1.112.43'
  createNewCandidateVersion('patch', gitTags).then(data => {
    expect(data).toBe('v1.112.44-RC46')
  })
})

test('create new minor level release candidate', async () => {
  const gitTags = 'v1.112.44-RC45\nv1.112.43'
  createNewCandidateVersion('minor', gitTags).then(data => {
    expect(data).toBe('v1.113.0-RC1')
  })
})

test('create new minor level release candidate', async () => {
  const gitTags = 'v1.112.44-RC45\nv1.112.43'
  createNewCandidateVersion('minor', gitTags).then(data => {
    expect(data).toBe('v1.113.0-RC1')
  })
})

test('create new major level release candidate', async () => {
  const gitTags = 'v1.112.44-RC45\nv1.112.43'
  createNewCandidateVersion('major', gitTags).then(data => {
    expect(data).toBe('v2.0.0-RC1')
  })
})

test('create new candidate from version string', async () => {
  const gitTags = 'v1.112.44\nv1.112.43\nv0.0.1-RC1'
  createNewCandidateVersion('minor', gitTags).then(data => {
    expect(data).toBe('v1.113.0-RC1')
  })
})

test('no release candidate available', async () => {
  const gitTags = 'v1.1.1\nv1.1.0'
  createNewCandidateVersion('patch', gitTags).then(data => {
    expect(data).toBe('v1.1.2-RC1')
  })
})

test('no version available', async () => {
  const gitTags = 'v1.1.0-RC1\nv1.2.3-RC4'
  createNewCandidateVersion('minor', gitTags).then(data => {
    expect(data).toBe('v1.1.0-RC2')
  })
})

test('no version available', async () => {
  const gitTags = 'v1.2.4-RC1\nv1.2.3-RC4'
  createNewCandidateVersion('patch', gitTags).then(data => {
    expect(data).toBe('v1.2.4-RC2')
  })
})

/** createNewRelease */

test('create new release from candidate', async () => {
  const gitTags = 'v1.3.0-RC1\nv1.2.3-RC4'
  createNewVersion(gitTags).then(data => {
    expect(data).toBe('v1.3.0')
  })
})

test('create new release: order of version tags matters, not numbers', async () => {
  const gitTags = 'v1.1.0-RC1\nv1.2.3-RC4'
  createNewVersion(gitTags).then(data => {
    expect(data).toBe('v1.1.0')
  })
})
