import 'react-native-gesture-handler'
import React, { useEffect, useCallback } from 'react'
import { LogBox } from 'react-native'
import { firebase, firestore } from './src/firebase/firebase.app'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack'
import {
  LoginScreen,
  ChatScreen,
  RegistrationScreen,
  SettingsScreen,
} from './src/screens'
import AsyncStorage from '@react-native-community/async-storage'
import { GiftedAvatar } from 'react-native-gifted-chat'

import { decode, encode } from 'base-64'
if (!global.btoa) {
  global.btoa = encode
}
if (!global.atob) {
  global.atob = decode
}

LogBox &&
  LogBox.ignoreLogs &&
  LogBox.ignoreLogs([
    new RegExp('Setting a timer for a long period of time'),
    new RegExp('Remote debugger'),
    new RegExp('Animated'), // TODO: Fix this issue since upgrading to sdk 39. This is related to reanimated
  ])

const Stack = createStackNavigator()

export default function App() {
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState(null)
  const [chatTheme, setChatTheme] = React.useState(null)

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

  useEffect(() => {
    updateChatTheme()
  }, [chatTheme])

  const updateChatTheme = useCallback(async ()=> {
    if (chatTheme) {
      AsyncStorage.setItem('chatTheme', chatTheme)
    } else {
      setChatTheme(await AsyncStorage.getItem('chatTheme'))
    }
  }, [chatTheme])

  if (loading) {
    return <></>
  }

  const renderHeaderButton = (navigation) => {
    const btn = () => {
      return (
        <GiftedAvatar
          user={user}
          onPress={() => {
            navigation.navigate('Settings', {
              setChatTheme,
              chatTheme
            })
          }}
          avatarStyle={{ marginRight: 8 }}
        />
      )
    }

    return btn
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name='Home'
              options={({ navigation }) => {
                return { headerRight: renderHeaderButton(navigation) }
              }}
            >
              {(props) => (
                <ChatScreen {...props} userData={user} theme={chatTheme} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name='Settings'
              options={{
                title: 'Settings',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              }}
            >
              {(props) => <SettingsScreen {...props} userData={user} />}
            </Stack.Screen>
          </>
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
