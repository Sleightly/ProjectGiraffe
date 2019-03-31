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
			if (doc.data().belongs != firebase.auth().currentUser.uid){
				matches.add(doc.data().belongs)
			}
		})
		console.log(matches);
		let array = Array.from(matches);
		var ppl = document.getElementsByClassName('ppl')[0];

		//create chat rooms here
		var i;
		for (i = 0; i < array.length; i++) {
			var msgs = document.createElement('div');
			var image = document.createElement("img")
			var text = document.createElement('div');

			//get name from id
			//get profileURL from id
			setName(text, array[i]);
			setImage(image, array[i]);

			msgs.setAttribute("onclick", "window.location=\"https://project-giraffe-4c1a9.firebaseapp.com/dm.html?p1="+
				firebase.auth().currentUser.uid+"&p2="+array[i]+"\";");

			text.classList.add("message-text");
			msgs.classList.add("message");

			msgs.appendChild(image)
			msgs.appendChild(text)
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


// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}
