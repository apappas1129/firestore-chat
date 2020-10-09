/* eslint-disable indent */
import React from 'react'
import { Bubble } from 'react-native-gifted-chat'

export default function renderChatBubbles(theme) {
  let renderBubble
  switch (theme) {
    case 'sassy':
      renderBubble = SASSY
      break
    case 'darktheme':
      renderBubble = DARK
      break
    default:
      renderBubble = DEFAULT
      break
  }
  return renderBubble
}

const SASSY = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: '#ecff70',
        },
        left: {
          color: 'white',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: '#dfa7ff',
        },
        right: {
          backgroundColor: '#ff36b8',
        },
      }}
      usernameStyle= {{
        color: '#faffaf'
      }}
    />
  )
}

const DARK = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#333',
        },
        right: {
          backgroundColor: '#532480',
        },
      }}
      textStyle={{
        right: {
          color: 'white',
        },
        left: {
          color: 'white',
        },
      }}
    />
  )
}

const DEFAULT = (props) => {
  return (
    <Bubble
      {...props}
      textStyle={{
        right: {
          color: 'black',
        },
        left: {
            color: 'white',
        },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: '#1652F0',
        },
        right: {
            backgroundColor: '#e5e5e5'
        }
      }}
      usernameStyle= {{
        color: 'white'
      }}
      timeTextStyle= {{
        color: 'green' // currently still not working https://github.com/FaridSafi/react-native-gifted-chat/issues/1308
      }}
    />
  )
}
