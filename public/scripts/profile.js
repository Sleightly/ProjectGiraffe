function getLocation() {
  var user = getUserName();
  console.log(user)
  var name;
  firebase.firestore().collection('users').where("id", "==", user)
  .get()
  .then(function(doc) {
    if (doc.exists) {
      name = doc.data().zipcode;
    } else {
      console.log('no xd');
    }
  })
  return name;
  /*.get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.data().id == user) {
        name = doc.data().zipcode;
        console.log("name:  "+name)
        return name;
      } else {
        console.log('no loc');
      }
    })
  })*/
}

function getPreference() {
  var user = getUserName();
  var name;
  firebase.firestore().collection('users').where("id", "==", user)
  .get()
  .then(function(doc) {
    if (doc.exists) {
  		name = doc.data().preferences;
  	} else {
  		console.log('no preferences');
  	}
  })
  return name;
}

function getItems() {
  var user = getUserName();
  var name;
  firebase.firestore().collection('users').where("id", "==", user)
  .get()
  .then(function(doc) {
    if (doc.exists) {
  		name = doc.data().ownedItems;
  	} else {
  		console.log('no items');
  	}
  })
  return name;
}

function updateProfilePic(pic) {
	var storageRef = firebase.storage().ref();
	ref.put(pic).then(function(snapshot) {
	  console.log('Uploaded a blob or file!');
	});
}

function updateName(newName) {
	var user = getUserName();
	var name;
	firebase.firestore().collection('users').where("id", "==", user)
	.get()
	.then(function(doc) {
	if (doc.exists) {
			doc.update({
				"name": newName
			})
		}
	})
}

function updateLocation(newLoc) {
	var user = getUserName();
  console.log(user)
	firebase.firestore().collection('users')
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.data().id == user) {
         doc.ref.update({ zipcode: newLoc })
      } else {
        console.log('no loc');
      }
    })
  })
}

function changePreferences(oldPrefs) {
	var user = getUserName();
	var name;
	firebase.firestore().collection('users').where("id", "==", user)
	.get()
	.then(function(doc) {
	if (doc.exists) {
			doc.update({
				"preferences": currPref
			})
		}
	})
}

function addOwnedItems(item) {
	var user = getUserName();
	var cItems;
	firebase.firestore().collection('users').where("id", "==", user).get()
      .then(function(doc) {
        cItems = doc.data().ownedItems;
        cItems = cItems.push(item);
        doc.update({
			ownedItems: cItems
		})
  })
}

function removeOwnedItems(item) {
	var user = getUserName();
	var cItems;
	firebase.firestore().collection('users').where("id", "==", user).get()
    .then(function(doc) {
        cItems = doc.data().ownedItems;
        var index = cItems.indexOf(item);
		if (index !== -1) cItems.splice(index, 1);
		doc.update({
			ownedItems: cItems
		})
  })
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.uid;
}
