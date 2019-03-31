/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Signs-in Friendly Chat.
function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      if(!checkLoginExists(getUniqueId())) {
        firebase.firestore().collection('users').add({
          name: getUserName(),
          profilePicUrl: getProfilePicUrl(),
          email: getEmail(),
          id: getUniqueId(),
          preference: "miscellaneous",
          zipcodes: "00000"
        })
      }
    }).then(function() {
      if (firebase.auth().currentUser) {
        window.location.href = 'home.html';
      }
    }).catch(function(error) {
      console.error('Error sending profile information to Firebase Database', error);
  });
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

//Returns the signed-in user's email.
function getEmail() {
  return firebase.auth().currentUser.email;
}

//Returns a unique identifier for the signed-in user.
function getUniqueId() {
  return firebase.auth().currentUser.uid;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// returns true if the login exists otherwise its false
function checkLoginExists(id){
  var result = -1;
  firebase.firestore().collection("users").where("id", "==", id)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              result = doc.id;
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  return result!=-1;
}
