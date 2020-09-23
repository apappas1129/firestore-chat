import { Platform } from 'react-native'

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

/**
 * Send's push notifications to given `tokens` using the native `fetch`.
 * @param {*} notification object expected as body for Expo's Push Notification POST endpoint
 * @param {*} tokens array of Expo Push Notification Tokens (e.g. ['ExponentPushToken[YMm_tGFQ8EVLhs-lRjw39L]'])
 */
export default function sendPushNotifications(notification, tokens = []) {
  if (Platform.OS !== 'android' /**TODO: iOS */) {
    return Promise.reject('Cannot send push notification from web!')
  }

  const notifications = tokens.map((token) => {
    return {
      to: token, // NOTE: expo tokens (e.g. 'ExponentPushToken[YMm_tGFQ8EVLhs-lRjw39L]' )
      sound: notification.sound || 'default',
      title: notification.title || 'Default Title',
      body: notification.body || 'Message Received',
      data: notification.data || { data: 'default payload' }, // sample
    }
  })

  // Expo Notification can receive a request body as an array of up to 100 message objects. See https://docs.expo.io/push-notifications/sending-notifications/
  const payloads = [...chunks(notifications, 100)]

  const requests = payloads.map((payload) =>
    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        host: 'exp.host',
        Accept: 'application/json',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  )

  return Promise.all(requests)
}
