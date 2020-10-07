import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import { firebase } from '../../firebase/firebase.app'
import * as Facebook from 'expo-facebook'
import { facebookAppID } from '../../../environment'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert('User does not exist anymore.')
              return
            }
            const user = firestoreDocument.data()
            navigation.navigate('Home', { user: user })
          })
          .catch((error) => {
            alert(error)
          })
      })
      .catch((error) => {
        alert(error)
      })
  }

  async function loginWithFacebook() {
    try {
      await Facebook.initializeAsync({
        appId: facebookAppID,
      })
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      })
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token)

        firebase
          .auth()
          .signInWithCredential(credential)
          .then(({ additionalUserInfo, user }) => {
            const { profile, providerId } = additionalUserInfo
            const data = {
              _id: user.uid,
              email: profile.email || user.email || user.providerData[0].email,
              name: profile.name || user.displayName,
              avatar:
                profile.picture?.data?.url ||
                user.photoURL ||
                user.providerData[0].photoURL,
              providerId,
              photo: `https://graph.facebook.com/${profile.id}/picture?height=500`,
            }
            const usersRef = firebase.firestore().collection('users')
            usersRef
              .doc(user.uid)
              .set(data)
              .then(() => {
                navigation.navigate('Home', { user: data })
              })
              .catch((error) => {
                alert(error)
              })
          })
          .catch((error) => {
            alert(error)
          })
      }
    } catch (error) {
      console.warn('FB_LOGIN_FAILED', JSON.stringify(error))
      alert(`Facebook Login Error: ${error.message}`)
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'
      >
        <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => loginWithFacebook()}
        >
          <Text style={styles.buttonTitle}>Log in With Facebook</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
