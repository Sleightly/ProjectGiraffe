// need to install zipcodes using: npm i zipcodes

function matchingMapGeneration(mId){
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
              array = [doc.data().preferences];
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  console.log("arr ",array.length);
  db.collection("users").where("id", "==", mId)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              zip1 = parseInt(doc.data().zipcode);
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  console.log("Meh ",Object.keys(scores).length);
  console.log("test",array.length);
  db.collection("items").where('userId','>',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.data().id in scores){
        scores[doc.data().id]++
      } else if (count > 0){
        scores[doc.data().id] = 1;
      }
    });
  });
    console.log("Meh ",Object.keys(scores).length);
  db.collection("items").where('userId','<',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.data().id in scores){
        scores[doc.data().id]++
      } else if (count > 0){
        scores[doc.data().id] = 1;
      }
    });
  });
    console.log("Meh ",Object.keys(scores).length);
  db.collection("users").where('id','<',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = 0;
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.data().id in scores){
        scores[doc.data().id]++
      } else if (count > 0){
        scores[doc.data().id] = 1;
      }
    });
  });
  console.log("Meh ",Object.keys(scores).length);
  if(zip1!=null){
    db.collection("users").where('id','>',mId).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        var zip2 = int(doc.data().zip);
        var x = Math.abs(zip1 - zip2) * 5;
        console.log("dist = ",x);
        var dist = ((1/Math.log(x+1.2))+0.3)/1.2;
        console.log("score from dist = ",count);
        if(doc.data().id in scores){
          scores[doc.data().id] += dist;
        } else if (count > 0){
          scores[doc.data().id] = dist;
        }
      });
    });
  }
  console.log("Meh ",Object.keys(scores).length);
  var order = [];
  console.log("Meh ",Object.keys(scores).length," " ,order.length);
  for (var i = 0; i< Object.keys(scores).length; i++ ){
    var max = Object.keys(scores)[0];
    for (const k of scores.keys()) {
      if(scores[max]<scores[k]){
        max = k;
      }
    }
    delete scores[max]
    order.push(max);
  }
  console.log("DONE WITH RANK ",order.length);
  return order;
}
