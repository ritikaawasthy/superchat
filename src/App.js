
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { useState, useRef} from 'react';
var firebaseConfig = {
   apiKey: "AIzaSyCHLHO5L4ixPbtR-3zh5g5s91LlBKzXE9k",
   authDomain: "superchat-d6c68.firebaseapp.com",
   projectId: "superchat-d6c68",
   storageBucket: "superchat-d6c68.appspot.com",
   messagingSenderId: "876929679177",
   appId: "1:876929679177:web:de83f00d10da2b159ee498"
 };
 // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 const auth= firebase.auth();
 const firestore= firebase.firestore();


function App() {
  const [user]= useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <h1>superchat</h1>
      <SignOut/>
      </header>

      <section>
       {user ? <ChatRoom/>: <SignIn/>}
      </section>

    </div>
  );
}

function SignIn(){
  const signInWithGoogle= () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const dummy = useRef()
  const [messages] = useCollectionData(query,{idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const sendMessage = async(e) => {
    e.preventDefault(); //prevent refresh of the page
  const {uid, photoURL}= auth.currentUser;
  await messagesRef.add({
    text: formValue,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL
  });

  setFormValue('');
  dummy.current.scrollIntoView({behaviour: 'smooth'});
  }

  return(<>

    <main>
     {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
     <div ref={dummy}></div>
    </main>

    <form onSubmit={sendMessage}>

    <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} />
    <button type='submit'> </button>
    </form>
    </>

  )
}

function ChatMessage(props){
  const {text,uid, photoURL}= props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


  return(
    <div className={`message ${messageClass}`}>
    <img src={photoURL} alt="profile"/>
    <p>{text}</p>
    </div>
  )
}

export default App;
