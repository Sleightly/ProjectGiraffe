function matchingMapGeneration(mId){
  const firebase = require("firebase");
  // Required for side-effects
  require("firebase/firestore");

  firebase.initializeApp({
      apiKey: 'AIzaSyD-6L1HaTNNWgkzacsDiD2mhrOW5OCNsaE',
      authDomain: 'project-giraffe-4c1a9.firebaseapp.com',
      projectId: 'project-giraffe-4c1a9'
      });

  var db = firebase.firestore();
  var scores = {};
  var array = [];
  db.collection("users").where("id", "==", mId)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              array = doc.data().preferences;
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

  console.log("test",array.length);
  db.collection("users").where('id','>',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().ownedItems;
      var count = 0;
      for(var i = 0; tempo!=null && i<tempo.length; i++){
        if(array.indexOf(tempo[i])>=0){
          count++;
        }
      }
      if(count!=0){
        scores[doc.id] = count;
        console.log(doc.id,"count = "+count);
      }
    });
  });
  db.collection("users").where('id','<',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().ownedItems;
      var count = 0;
      for(var i = 0; tempo!=null && i<tempo.length; i++){
        if(array.indexOf(tempo[i])>=0){
          count++;
        }
      }
      if(count!=0){
        scores[doc.id] = count;
        console.log(doc.id,"count = "+count);
      }
    });
  });
  return scores;
}
