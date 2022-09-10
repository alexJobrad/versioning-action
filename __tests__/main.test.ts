import {expect, test} from '@jest/globals'
import { performRelease } from '../src/main'

// test('throws invalid number', async () => {
//   const input = parseInt('foo', 10)
//   await expect(wait(input)).rejects.toThrow('milliseconds not a number')
// })

// test('wait 500 ms', async () => {
//   const start = new Date()
//   await wait(500)
//   const end = new Date()
//   var delta = Math.abs(end.getTime() - start.getTime())
//   expect(delta).toBeGreaterThan(450)
// })

// // shows how the runner will run a javascript action with env / stdout protocol
// test('test runs', () => {
//   process.env['INPUT_MILLISECONDS'] = '500'
//   const np = process.execPath
//   const ip = path.join(__dirname, '..', 'lib', 'main.js')
//   const options: cp.ExecFileSyncOptions = {
//     env: process.env
//   }
//   console.log(cp.execFileSync(np, [ip], options).toString())
// })

test('test releasing the last candidate', async () => {
    const gitTags = "v1.112.43-RC45\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('release', gitTags).then(data => {
        expect(data).toBe("v1.112.43")
    })
})

test('test creating a new minor candidate', async () => {
    const gitTags = "v1.112.43-RC45\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('minor', gitTags).then(data => {
        expect(data).toBe("v1.112.43-RC46")
    })
})

test('test creating a new major candidate', async () => {
    const gitTags = "v1.112.43-RC45\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('major', gitTags).then(data => {
        expect(data).toBe("v2.0.0-RC1")
    })
})

test('test creating a new minor candidate', async () => {
    const gitTags = "v1.0.1-RC2\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('minor', gitTags).then(data => {
        expect(data).toBe("v1.1.0-RC1")
    })
})

test('test creating a new patch candidate', async () => {
    const gitTags = "v1.0.1-RC2\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('patch', gitTags).then(data => {
        expect(data).toBe("v1.0.1-RC3")
    })
})


test('test creating a new patch candidate', async () => {
    const gitTags = "v1.0.1\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('patch', gitTags).then(data => {
        expect(data).toBe("v1.0.2-RC1")
    })
})

test('test creating a new patch candidate', async () => {
    const gitTags = "v1.0.1\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('patch', gitTags).then(data => {
        expect(data).toBe("v1.0.2-RC1")
    })
})


test('test creating a release from a release - should fail', async () => {
    const gitTags = "v1.0.1\n\
v1.0.1-RC1\n\
v1.0.0-RC2\n\
v1.0.0-RC1\n\
v1.0.0\n\
v0.0.34\n\
staging\n\
production"
    performRelease('release', gitTags).then(data => {
        expect(data).toBe("undefined")
    })
})