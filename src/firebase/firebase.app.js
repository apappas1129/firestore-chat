import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCI8XZTr0uYVfsOekGf9HyibI8oTAD_HTk',
  authDomain: 'reactnativefirebase-78631.firebaseapp.com',
  databaseURL: 'https://reactnativefirebase-78631.firebaseio.com',
  projectId: 'reactnativefirebase-78631',
  storageBucket: 'reactnativefirebase-78631.appspot.com',
  messagingSenderId: '243790233194',
  appId: '1:243790233194:web:44e3e983f7bdb587c39413',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export { firebase, firestore };
