import * as firebase from 'firebase'
import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'
import { firebaseConfig } from '../../environment'

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
