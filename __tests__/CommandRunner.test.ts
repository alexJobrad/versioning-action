import {expect, test} from '@jest/globals'
import {CommandRunner} from '../src/CommandRunner'

test('dummy', () => {
  console.log('test')
})

// test('run command test', async () => {
//     return CommandRunner('echo hallo').then(data => {
//       console.log("data: " + data);
//       expect(data).toBe("hallo");
//     })
//     // const returnValue = await CommandRunner('echo hallo')
//     // console.log(returnValue)
//     // expect(returnValue).resolves.toBe('hallo')
//   })

// test('fails running non-existing command', async () => {
//     const returnValue = await CommandRunner('asdfijkjdf')
//     console.log(returnValue)
// })
