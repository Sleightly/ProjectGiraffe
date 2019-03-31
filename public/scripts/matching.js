// need to install zipcodes using: npm i zipcodes

function matchingMapGeneration(mId){
  console.log('matching');
  var db = firebase.firestore();
  var scores = {};
  var distance = {};
  var array = [];
  var zip1;
  var zip2;
  return db.collection("users").where("id", "==", mId)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              array = [doc.data().preferences];
          });
          return one(mId);
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  console.log("arr ",array.length);


  function one(mId){
    console.log(1);
    return db.collection("users").where("id", "==", mId)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              zip1 = parseInt(doc.data().zipcode);
          });
          return five(zip1,mId);
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    }
    function five(zip1,mId) {
      if(zip1){ db.collection("users").where('id','>',mId).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              var zip2 = parseInt(doc.data().zipcode);
              if(!zip2) zip2 = 0;
              var x = Math.abs(zip1 - zip2) * 5;
              console.log("dist = ",x);
              var dist = ((1/Math.log(x+1.2))+0.3)/1.2;
              console.log("score from dist = ",count);
              distance[doc.data().id] = dist;
            });
          });
        }
        console.log(5);
        return two(mId);
      }
  console.log("Meh ",Object.keys(scores).length);
  console.log("test",array.length);

  function two(mId) {
    console.log(2);
    return db.collection("items").where('userId','>',mId).get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = distance[doc.data().userId];
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.data().userId!= mId){
        scores[doc.data().imageUrl] = count;
      }
    });
    return three(mId);
  });
}

    console.log("Meh ",Object.keys(scores).length);

    function three(mId) {
      console.log(3);
      return db.collection("items").where('userId','<',mId).get().then(function(querySnapshot) {
       console.log(3.2);
    querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      var tempo = doc.data().type;
      var count = distance[doc.data().userId];
      if(array.indexOf(tempo)>=0){
        count++;
      }
      if(doc.data().userId!= mId){
        scores[doc.data().imageUrl] = count;
      }
    });
    return final(mId);
  });
}

  console.log("Meh ",Object.keys(scores).length);


    function final(mId) {
      console.log("Meh ",Object.keys(scores).length);
      var order = [];
      console.log("Meh ",Object.keys(scores).length," " ,order.length);
      console.log(5.7);
      for (var i = 0; i< Object.keys(scores).length; i++ ){
        console.log(5.8);
        var max = Object.keys(scores)[0];
        console.log(5.85);
        for (const k in scores) {
          if(scores[max]<scores[k]){
            max = k;
          }
        }
        console.log(5.9);
        delete scores[max]
        order.push(max);
      }
      console.log(6);
      console.log("DONE WITH RANK ",order.length);
      return new Promise((resolve, _) => {
        setTimeout(function() {
          console.log(order);
          resolve(order);
        }, 10)
      });
    }
}

function getBloc(mId){
  var result = db.collection("users").where("id","==",mId).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          return doc.data();
      });
  });
  return -1;
}
