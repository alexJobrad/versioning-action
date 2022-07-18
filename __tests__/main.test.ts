import {wait} from '../src/wait'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'
import { parseTagString } from '../src/main'
import { version } from 'os'

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


test('parse complete tag string', () => {
  let versionConstruct = parseTagString('v1.2.3-RC4');
  expect(versionConstruct).toBeDefined();
  if (versionConstruct) {
    expect(versionConstruct.major).toBe(1);
    expect(versionConstruct.minor).toBe(2);
    expect(versionConstruct.patch).toBe(3);
    expect(versionConstruct.candidate).toBe(4);
  }
})

test('parse version release tag', () => {
  let versionConstruct = parseTagString('v16.2.493');
  expect(versionConstruct).toBeDefined();
  if (versionConstruct) {
    expect(versionConstruct.major).toBe(16);
    expect(versionConstruct.minor).toBe(2);
    expect(versionConstruct.patch).toBe(493);
    expect(versionConstruct.candidate).toBeNaN();
  }
})

test('not parsing invalid string', () => {
  let versionConstruct = parseTagString('d1.2.3-RC4');
  expect(versionConstruct).toBeUndefined();
})

test('not parsing another invalid string', () => {
  let versionConstruct = parseTagString('v1.2.3a');
  expect(versionConstruct).toBeUndefined();
})