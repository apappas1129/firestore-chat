import { Notifications } from 'expo'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { Platform } from 'react-native'

export default async function registerToPushNotification() {
  // Make sure app is running on physical device, since push notifs don't work on simulators
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return Promise.reject(
        'Failed to get expo push token for push notification!'
      )
    } else {
      // On Android, we need to specify a channel. Find out more  details at expo notification documentation
      if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
          name: 'default',
          sound: true,
          priority: 'max',
          vibrate: [0, 250, 250, 250],
        })
      }

      return Notifications.getExpoPushTokenAsync()
    }
  }
}
