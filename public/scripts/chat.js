//Create chat room
function chatRoom(user1, user2) {
	window.location.href = "dm.html?p1="+user1+"&p2="+user2;
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
}

function getUrlVar(name) {
    return getUrlVars()[name];
}

//authenticate
function authenticate() {
	var user1 = getUrlVar('p1');
	var user2 = getUrlVar('p2');
	var myid = getUniqueId();
	if (myid != user1 && myid != user2) {
		window.location.href = 'home.html';
	}
	if (myid == user1) {
		//get user2
		var name = firebase.firestore().collection('users').doc(user2).data().name;
		document.getElementById("otherName").innerText = name;
	} else {
		var name = firebase.firestore().collection('users').doc(user1).data().name;
		document.getElementById("otherName").innerText = name;
	}
	loadMessages();
}


// Saves a new message on the Cloud Firestore.
function saveMessage(messageText) {
  var myid = getUniqueId();
  var user1 = getUrlVar('p1');
  var user2 = getUrlVar('p2');
  var fromUser = user1;
  var toUser = user2;
  if (user2 == myid) {
  	fromUser = user2;
  	toUser = user1;
  }
  var uniqueId = getId(user1, user2);
  // Add a new message entry to the Firebase database.
  return firebase.firestore().collection('chat').doc(uniqueId).collection('msgs')
    .add({
    from: fromUser,
    to: toUser,
    text: messageText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  var user1 = getUrlVar('p1');
  var user2 = getUrlVar('p2');
  var uniqueId = getId(user1, user2);
  var iamone = true;

  var myid = getUniqueId();
  if (user1 != myid) {
  	iamone = false;
  }

  var query = firebase.firestore().collection('chat').doc(uniqueId).collection('msgs').orderBy('timestamp', 'desc').limit(12);
  
  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
        var message = change.doc.data();
        var texts = document.getElementsByClassName('dm-body')[0];
        var para = document.createElement("p");
		para.innerText = message.text;
		var div = document.createElement("div");
		div.appendChild(para);
        if (message.from == user1) {
        	if (iamone) {
        		div.classList.add("speech-bubble-out");
        	} else {
        		div.classList.add("speech-bubble-in");
        	}
        } else {
        	if (iamone) {
        		div.classList.add("speech-bubble-in");
        	} else {
        		div.classList.add("speech-bubble-out");
        	}
        }
        texts.appendChild(div);
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
  if (!firebase.auth().currentUser) {
  	window.location.href = 'home.html';
  } 
  return firebase.auth().currentUser.uid;
}

//Returns a unique identifier for the other user.
function getOtherId() {
  //get other id
}

