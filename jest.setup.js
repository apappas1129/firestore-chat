/* eslint-disable no-undef */

// #region AsyncStorage
/**
 * Async Storage module is tightly coupled with its NativeModule part.
 * It needs a running React Native application to work properly.
 * In order to use it in tests, you have to provide its separate implementation.
 * https://react-native-community.github.io/async-storage/docs/advanced/jest/#with-jest-setup-file
 */
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)
// #endregion AsyncStorage

// #region ReactNavigation
/**
 * Testing code using React Navigation takes some setup since we need
 * to mock some native dependencies used in the navigators.
 * https://reactnavigation.org/docs/testing/#mocking-native-modules
 */
import 'react-native-gesture-handler/jestSetup'

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {}

  return Reanimated
})

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
// #endregion ReactNavigation