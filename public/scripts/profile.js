function updateName(newName) {
	var user = getUserName();
	firebase.firestore().collection('users').doc(user).update({
		"name": newName
	})
}

function updateBio(newBio) {
	var user = getUserName();
	firebase.firestore().collection('users').doc(user).update({
		"Bio": newBio
	})
}

function updateLocation(newLoc) {
	var user = getUserName();
	firebase.firestore().collection('users').doc(user).update({
		"Location": newLoc
	})
}	

function addPreferences(newPrefs) {
	var user = getUserName();
	var currPref = (firebase.firestore().collection('users').doc(user).preferences).concat(newPrefs);
	firebase.firestore().collection('users').doc(user).update({
		preferences: currPref
	})
}

function removePreferences(oldPrefs) {
	var user = getUserName();
	var currPref = firebase.firestore().collection('users').doc(user).preferences;
	currPref.filter(value => oldPrefs.includes(value))
	firebase.firestore().collection('users').doc(user).update({
		preferences: currPref
	})
}

function addOwnedItems(items) {
	var user = getUserName();
	var currItems = (firebase.firestore().collection('users').doc(user).ownedItems).concat(items);
	firebase.firestore().collection('users').doc(user).update({
		ownedItems: currItems
	})
}

function removeOwnedItems(items) {
	var user = getUserName();
	var currItems = firebase.firestore().collection('users').doc(user).ownedItems;
	currItems.filter(value => items.includes(value))
	firebase.firestore().collection('users').doc(user).update({
		ownedItems: currItems
	})	
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}