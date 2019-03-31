// need to install zipcodes using: npm i zipcodes

function matchingMapGeneration(mId){
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
      });

  function one(mId){
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
      });
    }
    function five(zip1,mId) {
      if(zip1){ db.collection("users").where('id','>',mId).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              var zip2 = parseInt(doc.data().zipcode);
              if(!zip2) zip2 = 0;
              var x = Math.abs(zip1 - zip2) * 5;
              var dist = ((1/Math.log(x+1.2))+0.3)/1.2;
              distance[doc.data().id] = dist;
            });
          });
        }
        return two(mId);
      }

  function two(mId) {
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

    function three(mId) {
      return db.collection("items").where('userId','<',mId).get().then(function(querySnapshot) {
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


    function final(mId) {
      var order = [];
      var temp = Object.keys(scores).length;
      for (var i = 0; i< temp; i++ ){
        var max = Object.keys(scores)[0];
        for (const k in scores) {
          if(scores[max]<scores[k]){
            max = k;
          }
        }
        delete scores[max]
        order.push(max);
      }
      return new Promise((resolve, _) => {
        setTimeout(function() {
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
