// need to install zipcodes using: npm i zipcodes
function matchingMapGeneration(mId){
  var zipcodes = require('zipcodes');
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
  var zip1;
  var zip2;
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

  db.collection("users").where("id", "==", mId)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              zip1 = int(doc.data().zip);
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });

  console.log("test",array.length);
  db.collection("items").where('userId','>',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.id in scores){
        scores[doc.id]++
      } else if (count > 0){
        scores[doc.id] = 1;
      }
    });
  });
  db.collection("items").where('userId','<',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.id in scores){
        scores[doc.id]++
      } else if (count > 0){
        scores[doc.id] = 1;
      }
    });
  });
  db.collection("users").where('id','<',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.id in scores){
        scores[doc.id]++
      } else if (count > 0){
        scores[doc.id] = 1;
      }
    });
  });
  if(zip1!=null){
    db.collection("users").where('id','>',mId).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var zip2 = int(doc.data().zip);
        var x = zipcodes.distance(zip1, zip2);
        console.log("dist = ",x);
        var count = ((1/Math.log(x+1.2))+0.3)/1.2;
        console.log("score from dist = ",count);
        if(doc.id in scores){
          scores[doc.id] += count;
        } else if (count > 0){

          scores[doc.id] = count;
        }
      });
    });
  }
  var order = [];
  for (var i = 0; i< scores.size; i++ ){
    var max = 0;
    for (const k of scores.keys()) {
      if(scores[max]<scores[k]){
        max = k;
      }
    }
    order.push(k);
  }
  return order;
}
