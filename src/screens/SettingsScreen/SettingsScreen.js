import React, { useCallback, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { GiftedAvatar } from 'react-native-gifted-chat'
import PropTypes from 'prop-types'
import { debounce } from '../../utils'

const SettingsScreen = (props) => {
  const themes = ['default-theme', 'sassy', 'darktheme']
  const user = props.userData
  // If user has a higher resolution photo, use it.
  user.avatar = user.photo || user.avatar

  const { chatTheme, setChatTheme } = props.route.params
  const [currentTheme, setCurrentTheme] = useState(chatTheme || themes[0])

  const onPressSwitch = useCallback(
    debounce(() => {
      const i =
        themes.indexOf(currentTheme) === themes.length - 1
          ? 0
          : themes.indexOf(currentTheme) + 1

      const nextTheme = themes[i] || themes[0]

      setCurrentTheme(nextTheme)

      //update ChatScreen state
      setChatTheme(nextTheme)
    }, 100),
    [currentTheme]
  )

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <GiftedAvatar
        user={user}
        avatarStyle={{
          marginTop: 32,
          height: 160,
          width: 160,
          borderRadius: 80,
        }}
        textStyle={{
          fontSize: 64,
        }}
      />
      <Text
        accessibilityRole='header'
        numberOfLines={1}
        style={{
          marginTop: 12,
          fontSize: 32,
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        {user.name}
      </Text>
      <Button onPress={onPressSwitch} title={currentTheme} color='#841584' />
    </View>
  )
}

SettingsScreen.propTypes = {
  userData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    providerId: PropTypes.string,
    avatar: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
}

export default SettingsScreen
