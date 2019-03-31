function getLocation() {
  var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var dbRef = firebase.firestore().collection('users').where('id', '==', user);

    dbRef.get().then(function(querySnapshot) {
      if(querySnapshot.size > 0) {
        resolve(querySnapshot.docs[0].data().zipcode);
      } else {
        reject('failed');
      }
    });
  });

  promise.then(function(zip) {
    document.getElementById('showLoc').innerText = zip;
  });
}

function getPreference() {
  var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var dbRef = firebase.firestore().collection('users').where('id', '==', user);

    dbRef.get().then(function(querySnapshot) {
      if(querySnapshot.size > 0) {
        resolve(querySnapshot.docs[0].data().preference);
      } else {
        reject('failed');
      }
    });
  });

  promise.then(function(preference) {
    preference = preference.charAt(0).toUpperCase() + preference.slice(1);
    var options = document.getElementsByTagName('option');
    for(var i = 0; i < options.length; i++) {
      if(options[i].value === preference) {
        options[i].selected = 'selected';
        break;
      }
    }
    document.getElementsByTagName('select')[0].style.display = 'inline';
  });
}

function getItems() {
  var promise = new Promise((resolve, reject) => {
    var user = getUserName();
    var itemRef = firebase.firestore().collection('items').where("userId", "==", user);

    itemRef.get().then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
    		resolve(querySnapshot.docs);
    	} else {
    		reject('failed');
    	}
    });
  });

  promise.then(function(items) {
    var container = document.getElementsByClassName('for-trade-items')[0];
    for(var i = 0; i < items.length; i++) {
      container.innerHTML += `<div class="for-trade-item"><img src="${items[i].data().imageUrl}"><p>${items[i].data().title}</p><i onclick="deleteItem(this)" class="far fa-trash-alt"></i></div>`;
    }
  });
}

function updateLocation(newLoc) {
  if(newLoc.length < 5) return;
	var user = getUserName();
	firebase.firestore().collection('users').where('id', '==', user)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.data().id == user) {
         doc.ref.update({ zipcode: newLoc })
      }
    })
    getLocation();
  })
}

function updatePreference(newPref) {
  var user = getUserName();
	firebase.firestore().collection('users').where('id', '==', user)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      if (doc.data().id == user) {
         doc.ref.update({ preference: newPref })
      }
    })
    getPreference();
  })
}

function deleteItem(item) {
  var promise = new Promise((resolve, reject) => {
    var url = item.parentElement.firstChild.src;
    var itemRef = firebase.firestore().collection('items').where('imageUrl', '==', url);

    itemRef.get().then(function(querySnapshot) {
      if (querySnapshot.size > 0) {
        resolve(querySnapshot.docs[0]);
      } else {
        reject('failed');
      }
    })
  });

  promise.then(function(doc) {
    firebase.firestore().collection('items').doc(doc.id).delete().then(function() {
      item.parentElement.parentNode.removeChild(item.parentElement);
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  })
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.uid;
}
