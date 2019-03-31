function getMatches() {
	var promise = new Promise((resolve, reject) => {
		var user = getUserName();
		var matches = [];
		var ref = firebase.firestore().collection('users').where("id","==",user);
		ref.get().then(function(querySnapshot) {
	      if(querySnapshot.size > 0) {
	        querySnapshot.docs[0].collections('matches')
	        .get()
	        .then(function(querySnapshot)) {
	        	querySnapshot.forEach(function(doc) {
			    if (doc.data().belongs != user) {
			    	matches.push(doc.data().belongs)
			    }
			  })
	          resolve(matches);
	        }
	      } else {
	        reject('failed');
	      }
	    });
    });

	promise.then(function(m) {
      console.log(m);
  	  return m;
    });
}


// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.uid;
}
