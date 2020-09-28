/* eslint-disable no-undef */

import React from 'react'
import renderer from 'react-test-renderer'
import App from '../App'

/**
 * Basic Unit Test
 */
it('App renders without crashing', () => {
  const rendered = renderer.create(<App />).toJSON()
  expect(rendered).toBeTruthy()
})

/**
 * Snapshot tests are used to make sure the UI stays consistent,
 * especially when a project is working with global styles that are
 * potentially shared across components.
 * Read more about it on https://jestjs.io/docs/en/snapshot-testing.
 */
it('App test against snapshot', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
