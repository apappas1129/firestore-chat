import React, { useEffect, useState, useCallback } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
// import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { View } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { firestore } from '../../firebase/firebase.app'
import registerToPushNotification from '../../helpers/register-to-push-notification'
import sendPushNotifications from '../../helpers/send-push-notifications'

import PropTypes from 'prop-types'

const chatsRef = firestore.collection('chats')
const expoPushTokensRef = firestore.collection('expoPushTokens')

const ChatScreen = (props) => {
  const [messages, setMessages] = useState([])
  const [expoPushToken, setExpoPushToken] = useState()
  const [participantTokens, setParticipantTokens] = useState()

  const user = props.userData

  useEffect(() => {
    getExpoNotifToken()

    const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === 'added')
        .map(({ doc }) => {
          const message = doc.data()
          // `createdAt` is firebase.firestore.Timestamp instance
          // https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
          return { ...message, createdAt: message.createdAt.toDate() }
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Render messages
      appendMessages(messagesFirestore)
    })

    // Stop listening for updates when no longer required
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = expoPushTokensRef.onSnapshot((querySnapshot) => {
      const otherTokens = querySnapshot
        .docChanges()
        .filter(({ doc }) => doc.data().token !== expoPushToken)
        .map(({ doc }) => doc.data().token)

      setParticipantTokens(otherTokens)
    })

    return () => unsubscribe()
  }, [])

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      )
    },
    [messages]
  )

  async function getExpoNotifToken() {
    let token = await AsyncStorage.getItem('expoPushToken')

    if (!token) {
      registerToPushNotification().then((response) => {
        if (!response) return

        token = response

        // NOTE: We separated the tokens to another collection instead of using the 'users' collection.
        // This is to flatten data and avoid expensive queries when notifying multiple devices.
        expoPushTokensRef.doc(user._id).set({ token })

        AsyncStorage.setItem('expoPushToken', token)
      })
    }

    setExpoPushToken(token)
  }

  async function handleSend(messages) {
    const writes = messages.map((m) => chatsRef.doc(m._id).set(m)) // Can be chatsRef.add(m)) but using it auto generates the document id.

    await Promise.all(writes)

    const notif = {
      title: user.name.trim() + 'sent a message!',
      body: (messages[0].text || '').slice(0, 49), // Android standard max length for notifs is 49 characters
    }
    await sendPushNotifications(notif, participantTokens)
  }

  return (
    // {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior='padding' />} */}
    <View style={{ flex: 1 }}>
      <GiftedChat messages={messages} user={user} onSend={handleSend} />
    </View>
  )
}

ChatScreen.propTypes = {
  userData:PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
}

export default ChatScreen