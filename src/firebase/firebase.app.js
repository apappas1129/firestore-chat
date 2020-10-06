import * as firebase from 'firebase'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBegA8g71WdnpxcAiYQ54Jvac90gWVmshw',
  authDomain: 'reactnativedemo-28f3b.firebaseapp.com',
  databaseURL: 'https://reactnativedemo-28f3b.firebaseio.com',
  projectId: 'reactnativedemo-28f3b',
  storageBucket: 'reactnativedemo-28f3b.appspot.com',
  messagingSenderId: '759121270965',
  appId: '1:759121270965:web:674115d7f359b0f6b3c6fc',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const firestore = firebase.firestore()
const cloudStorage = firebase.storage()

/**
 * Creates a new firestore timestamp from the given date.
 * @param {Date} date
 * @returns {Timestamp} A new Timestamp representing the same point in time as the given date.
 * @typedef {import ("firebase").firestore.Timestamp} Timestamp
 */
const getTimestamp = (date) => {
  return firebase.firestore.Timestamp.fromDate(date || new Date())
}

export { firebase, firestore, cloudStorage, getTimestamp }
