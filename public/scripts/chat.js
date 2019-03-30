// Saves a new message on the Cloud Firestore.
function saveMessage(messageText, user1, user2) {
  var uniqueId = getId(user1, user2);
  // Add a new message entry to the Firebase database.
  return firebase.firestore().collection('chat').doc(uniqueId)
    .set({
    to: user1,
    from: user2,
    text: messageText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages(user1, user2) {
  var uniqueId = getId(user1, user2);

  var query = firebase.firestore().collection('chat').doc(uniqueId).orderBy('timestamp', 'desc').limit(12);
  
  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteMessage(change.doc.id);
      } else {
        var message = change.doc.data();
        displayMessage(change.doc.id, message.timestamp, message.name,
                      message.text);
      }
    });
  });
}

function getId(user1, user2) {
  var uniqueId = user1+user2;
  if (user1 > user2) {
  	uniqueId = user2+user1;
  }
  return uniqueId;
}

//Returns a unique identifier for the signed-in user.
function getUniqueId() {
  return firebase.auth().currentUser.uid;
}

//Returns a unique identifier for the other user.
function getOtherId() {
  //get other id
}