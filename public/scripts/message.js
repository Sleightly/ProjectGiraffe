function getMatches() {
	var promise = new Promise((resolve, _) => {
		var user = getUserName();
		var ref = firebase.firestore().collection('users').doc(user).collection("matches");
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
		var ppl = document.getElementsByClassName('ppl')[0];

		console.log("HERE I AM")
		console.log(matches.size)
		//create chat rooms here
		var i;
		for (i = 0; i < matches.size; i++) {
			var msgs = document.createElement('div');
			var image = document.createElement("img")
			var text = document.createElement('div');

			//get name from id
			//get profileURL from id
			var dbRef = firebase.firestore().collection('users').where("id", "==", matches[i])
			dbRef.get().then(function(querySnapshot) {
		      if(querySnapshot.size > 0) {
		        text.innerText = querySnapshot.docs[0].data().name;
		       	image.src = querySnapshot.docs[0].data().profilePicUrl;
		      }
		    })
			
			text.classList.add("message-text");
			msgs.classList.add("message");

			msgs.appendChild(image)
			msgs.appendChild(text)
			console.log("O BOY STUFF")
			ppl.insertBefore(msgs, ppl.firstChild);
		}
		//dont worry about duplicates, if already matched, then won't be added
  	});
}


// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}
