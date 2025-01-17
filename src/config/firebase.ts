import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCIMJZoILKLP8BTymLLwZdIkZk8GAYNsNs",
  authDomain: "guitarapp-180d7.firebaseapp.com",
  projectId: "guitarapp-180d7",
  storageBucket: "guitarapp-180d7.firebasestorage.app",
  messagingSenderId: "587340853683",
  appId: "1:587340853683:web:688eab04bf9bf760f25bc6",
  measurementId: "G-RFM29TQKSV"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
