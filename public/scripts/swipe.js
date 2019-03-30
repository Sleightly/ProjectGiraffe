
document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;
var user2 = null;
var query = firebase.auth().collection('preferences').orderBy('timestamp', 'desc');

function queryNextMatch() {
    //get user preferences
    var pref = [];
    query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            pref.push(change);   
        });
    });

    //find next optimal match
    //randomly pick next category
    var collection = pref[Math.floor(Math.random() * pref.length)];
    var query = firebase.auth().collection(collection).orderBy('timestamp', 'desc');
    var users = [];
    query.onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            users.push(change);   
        });
    });

    //update display
    user2 = users[Math.floor(Math.random() * users.length)];

    //TODO UPDATE DISPLAY WITH USER2

}

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
        } else {
            /* right swipe */
            firebase.auth().collection('users').collection('matches').add({
                user2: user2,
                }).catch(function(error) {
                console.error('Error writing new message to Firebase Database', error);
            });
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};