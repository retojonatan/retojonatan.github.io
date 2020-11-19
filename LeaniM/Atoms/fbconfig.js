var firebaseConfig = {
  apiKey: "AIzaSyC6r8l89wHjrKNY70-LDQNQoTTsMS3rDiY",
  authDomain: "leanim-crm-83458.firebaseapp.com",
  databaseURL: "https://leanim-crm-83458.firebaseio.com",
  projectId: "leanim-crm-83458",
  storageBucket: "leanim-crm-83458.appspot.com",
  messagingSenderId: "1027927186767",
  appId: "1:1027927186767:web:5cc89b2deb297b9b7cf93a",
  measurementId: "G-CNMD7GWDY6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();