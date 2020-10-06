import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { YellowBox } from 'react-native'
import { firebase, firestore } from './src/firebase/firebase.app'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, ChatScreen, RegistrationScreen } from './src/screens'

import { decode, encode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

YellowBox.ignoreWarnings([
  new RegExp('Setting a timer for a long period of time'),
  new RegExp('Remote debugger'),
])

const Stack = createStackNavigator()

export default function App() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firestore
          .collection('users')
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            console.warn('There was a problem on getting the user.', error)
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })
  }, [])

  if (loading) {
    return <></>
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name='Home'>
            {(props) => <ChatScreen {...props} userData={user} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Registration' component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
