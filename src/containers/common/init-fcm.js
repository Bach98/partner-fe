import firebase from "firebase/app";
import "firebase/messaging";

let messaging;

if (firebase.messaging.isSupported()) {
  firebase.initializeApp({
    apiKey: "AIzaSyDe_9g55CMof-ZN0j3LywkK--oCcHf-qK0",
    authDomain: "toro-wallet-8c8ae.firebaseapp.com",
    databaseURL: "https://toro-wallet-8c8ae.firebaseio.com",
    projectId: "toro-wallet-8c8ae",
    storageBucket: "toro-wallet-8c8ae.appspot.com",
    messagingSenderId: "937479546338",
    appId: "1:937479546338:web:567e64ff40b4aaeeb945bb",
    measurementId: "G-Y53B5E80LP"
  });
  messaging = firebase.messaging();
}

export { messaging };