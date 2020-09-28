/* eslint-disable no-undef */

import React, { useState } from 'react'
import { create, act } from 'react-test-renderer'
import App from '../App'

//HACK: https://github.com/facebook/jest/issues/4359#issuecomment-413238977
jest.useFakeTimers()

// NOTE: Stubbinitial states according to the order of `useState`'s of the component
const loading = false
const user = {
  _id: '93nJbIsNNRMezRIXoIgKUg9PKh42',
  email: 'apappas1129@gmail.com',
  name: 'Ts Xs',
}

// Mocking state hooks in order
jest
  .spyOn(React, 'useState')
  .mockImplementationOnce(() => useState(loading))
  .mockImplementationOnce(() => useState(user))

const tree = create(<App />)

console.log('Let me see:', tree)
console.log('1. I see dead people.', tree.toJSON())
console.log('2. I see dead people.', tree.getInstance())
console.log('3. I see dead people.', tree.toTree())

/**
 * Basic Unit Test
 */
it('App renders without crashing', async () => {
  await act(async () => {
    expect(tree.toJSON()).toBeTruthy()
  })
})

/**
 * Snapshot tests are used to make sure the UI stays consistent,
 * especially when a project is working with global styles that are
 * potentially shared across components.
 * Read more about it on https://jestjs.io/docs/en/snapshot-testing.
 */
it('App test against snapshot', async () => {
  await act(async () => {
    expect(tree.toJSON()).toMatchSnapshot()
  })
})
