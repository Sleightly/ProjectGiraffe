function getMatches() {
	var promise = new Promise((resolve, _) => {
		var user = getUserName();
		var ref = firebase.firestore().collection('users').doc(user).collection("potentialBuyers");
		ref.get().then(function(querySnapshot) {
	    	resolve(querySnapshot);
	    })
	});
	promise.then(function(querySnapshot) {
		var matches = new Set();
		querySnapshot.forEach(function(doc) {
			if (doc.data().matchedWith != firebase.auth().currentUser.uid){
				matches.add(doc.data().matchedWith)
        console.log(matches);
			}
		})
		console.log(matches);
		let array = Array.from(matches);
		var ppl = document.getElementsByClassName('ppl')[0];

		//create chat rooms here
		var i;
		for (i = 0; i < array.length; i++) {
      console.log(array);
      console.log(array[i]);
			var msgs = document.createElement('div');
			var image = document.createElement("img")
			var textDiv = document.createElement('div');
      var name = document.createElement('h6');
      var msg = document.createElement('p');

			//get name from id
			//get profileURL from id
			setName(name, array[i]);
      setMsg(msg, array[i]);
      if(msg.innerText == "") continue;
			setImage(image, array[i]);

			msgs.setAttribute("onclick", "window.location=\"https://project-giraffe-4c1a9.firebaseapp.com/dm.html?p1="+firebase.auth().currentUser.uid+"&p2="+array[i]+"\";");

			textDiv.classList.add("message-text");
			msgs.classList.add("message");

      textDiv.appendChild(name);
      textDiv.appendChild(msg);
			msgs.appendChild(image)
			msgs.appendChild(textDiv)
			console.log("O BOY STUFF")
			ppl.insertBefore(msgs, ppl.firstChild);
		}i
		//dont worry about duplicates, if already matched, then won't be added
  	});
}

function setName(text, hash) {
	var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var dbRef = firebase.firestore().collection('users').where('id', '==', hash);

    dbRef.get().then(function(querySnapshot) {
      if(querySnapshot.size > 0) {
        resolve(querySnapshot.docs[0].data().name);
      } else {
        reject('failed');
      }
    });
  });

  promise.then(function(name) {
    text.innerText = name;
  });
}

function setImage(image, hash) {
	var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var dbRef = firebase.firestore().collection('users').where('id', '==', hash);

    dbRef.get().then(function(querySnapshot) {
      if(querySnapshot.size > 0) {
        resolve(querySnapshot.docs[0].data().profilePicUrl);
      } else {
        reject('failed');
      }
    });
  });

  promise.then(function(pic) {
    image.src = pic;
  });
}

function setMsg(text, hash) {
  var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var dbRef1 = firebase.firestore().collection('chat').doc(`${hash}${firebase.auth().currentUser.uid}`);
    var dbRef2 = firebase.firestore().collection('chat').doc(`${firebase.auth().currentUser.uid}${hash}`);

    dbRef1.collection('msgs').orderBy('timestamp',  'desc').limit(1).get().then(function(querySnapshot) {
      if(querySnapshot.size <= 0) {
        dbRef2.collection('msgs').orderBy('timestamp', 'desc').limit(1).get().then(function(querySnapshot2) {
          if(querySnapshot2.size <= 0) {
            reject('nothing');
          } else {
            if(querySnapshot2.docs[0].data().from == firebase.auth().currentUser.uid) {
              resolve('You: ' + querySnapshot2.docs[0].data().text);
            } else {
              resolve(querySnapshot2.docs[0].data().text);
            }
          }
        })
      } else {
        if(querySnapshot.docs[0].data().from == firebase.auth().currentUser.uid) {
          resolve('You: ' + querySnapshotdocs[0].data().text);
        } else {
          resolve(querySnapshot.docs[0].data().text);
        }
      }
    })
  })

  promise.then(function(message) {
    text.innerText = message;
  })
  .catch(function() {
    createNewMatch(hash);
  });
}

function createNewMatch(user) {
  var parent = document.getElementsByClassName('new-matches')[0];

  var image = document.createElement('img');
  firebase.firestore().collection('users').where('id', '==', user)
    .get()
    .then(function(querySnapshot) {
      if(querySnapshot.size > 0) {
        image.src = querySnapshot.docs[0].data().profilePicUrl;
        parent.appendChild(image);
      }
    })
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}
