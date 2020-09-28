/* eslint-disable no-undef */

import React from 'react'
import { create } from 'react-test-renderer'
import App from '../App'

// HACK: experimental; Remove if unnecessary
// Trying to mock App's state to render home page
const setHookState = (newState) => jest.fn().mockImplementation(() => [
  newState,
  () => {}
])
React.useState = setHookState({
  user: {
    _id: '93nJbIsNNRMezRIXoIgKUg9PKh42',
    email: 'apappas1129@gmail.com',
    name: 'Ts Xs'
  },
  loading: false
})

const tree = create(<App />)

/**
 * Basic Unit Test
 */
it('App renders without crashing', () => {
  expect(tree.toJSON()).toBeTruthy()
})

/**
 * Snapshot tests are used to make sure the UI stays consistent,
 * especially when a project is working with global styles that are
 * potentially shared across components.
 * Read more about it on https://jestjs.io/docs/en/snapshot-testing.
 */
it('App test against snapshot', () => {
  expect(tree.toJSON()).toMatchSnapshot()
})
