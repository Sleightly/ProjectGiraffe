/*
 * jTinder v.1.0.0
 * https://github.com/do-web/jTinder
 * Requires jQuery 1.7+, jQuery transform2d
 *
 * Copyright (c) 2014, Dominik Weber
 * Licensed under GPL Version 2.
 * https://github.com/do-web/jTinder/blob/master/LICENSE
 */
var items = [];
var currIdx = 0;

var _user;
var _other;

function passArray(itemArray) {
	items = itemArray;
}

// returns true if the two have not been matched yet
function notMatched(otherId, currId){
  	var result = -1;
  	firebase.firestore().collection("users").where("id", "==", currId)
		.collection("potentialBuyers")
		.where("matchedWith", "==", "otherId")
      	.then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
              return doc.empty == false;
              //result = doc.id;
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  return doc.empty == true;
}

function checkMatched(otherId, currUserId) {
	//console.log("here!");
	//console.log(otherId);
	//console.log(currUserId);
	var ref = firebase.firestore().collection('users');
	ref.where("id", "==", otherId).get().then(function(querySnap) {
		//console.log(querySnap);
		querySnap.forEach(function(doc) {
			//console.log(doc.id);
			firebase.firestore().collection('users').doc(doc.id).collection('matches').where("belongs", "==", currUserId).get().then(function(query) {
				//console.log("query coming up!");
				//console.log(query);
				if (query.empty == false) {
					$('#modal').css('display', 'block');
          var img1 = document.getElementById('pic1');
          var img2 = document.getElementById('pic2');
          var display1 = document.getElementById('txt1');
          var display2 = document.getElementById('txt2');
          var prof1, prof2, name1, name2;
          var p1 = firebase.firestore().collection('users').where('id', '==', currUserId)
            .get().then(function(querySnapshot) {
              if(querySnapshot.size > 0) {
                prof1 = querySnapshot.docs[0].data().profilePicUrl;
                name1 = querySnapshot.docs[0].data().name.split(" ")[0];
              }
            });
          var p2 = firebase.firestore().collection('users').where('id', '==', otherId)
            .get().then(function(querySnapshot) {
              if(querySnapshot.size > 0) {
                prof2 = querySnapshot.docs[0].data().profilePicUrl;
                name2 = querySnapshot.docs[0].data().name.split(" ")[0];
              }
            });
          Promise.all([p1, p2]).then(function() {
            img1.src = prof1;
            img2.src = prof2;
            display1.innerText = name1;
            display2.innerText = name2;
          });
					firebase.firestore().collection('users').doc(doc.id).collection('potentialBuyers').add({
						matchedWith: currUserId
					}).then(function() {
						ref.where("id", "==", currUserId).get().then(function(querySnapshot) {
							querySnapshot.forEach(function(doc2) {
								firebase.firestore().collection('users').doc(doc2.id).collection('potentialBuyers').add ({
									matchedWith: otherId
								})
							})
						})
					});
					return true;
				}
			})
		return false;
		})
	})
}

;(function ($, window, document, undefined) {
	var pluginName = "jTinder",
		defaults = {
			onDislike: null,
			onLike: null,
			animationRevertSpeed: 200,
			animationSpeed: 400,
			threshold: 1,
			likeSelector: '.like',
			dislikeSelector: '.dislike'
		};

	var container = null;
	var panes = null;
	var $that = null;
	var xStart = 0;
	var yStart = 0;
	var touchStart = false;
	var posX = 0, posY = 0, lastPosX = 0, lastPosY = 0, pane_width = 0, pane_count = 0, current_pane = 0;

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(element);
	}

	Plugin.prototype = {


		init: function (element) {

			container = $(">ul", element);
			panes = $(">ul>li", element);
			pane_width = container.width();
			pane_count = panes.length;
			current_pane = panes.length - 1;
			$that = this;

			$(element).bind('touchstart mousedown', this.handler);
			$(element).bind('touchmove mousemove', this.handler);
			$(element).bind('touchend mouseup', this.handler);
		},

		showPane: function (index) {
			panes.eq(current_pane).hide();
			current_pane = index;
		},

		next: function () {
			return this.showPane(current_pane - 1);
		},

		dislike: function() {
			panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onDislike) {
					$that.settings.onDislike(panes.eq(current_pane));
				}
				$that.next();
			});
		},

		like: function() {
			panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onLike) {
					$that.settings.onLike(panes.eq(current_pane));
				}
				$that.next();
			});
		},

		handler: function (ev) {
			ev.preventDefault();

			switch (ev.type) {
				case 'touchstart':
					if(touchStart === false) {
						touchStart = true;
						xStart = ev.originalEvent.touches[0].pageX;
						yStart = ev.originalEvent.touches[0].pageY;
					}
				case 'mousedown':
					if(touchStart === false) {
						touchStart = true;
						xStart = ev.pageX;
						yStart = ev.pageY;
					}
				case 'mousemove':
				case 'touchmove':
					if(touchStart === true) {
						var pageX = typeof ev.pageX == 'undefined' ? ev.originalEvent.touches[0].pageX : ev.pageX;
						var pageY = typeof ev.pageY == 'undefined' ? ev.originalEvent.touches[0].pageY : ev.pageY;
						var deltaX = parseInt(pageX) - parseInt(xStart);
						var deltaY = parseInt(pageY) - parseInt(yStart);
						var percent = ((100 / pane_width) * deltaX) / pane_count;
						posX = deltaX + lastPosX;
						posY = deltaY + lastPosY;

						panes.eq(current_pane).css("transform", "translate(" + posX + "px," + posY + "px) rotate(" + (percent / 2) + "deg)");

						var opa = (Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2;
						if(opa > 1.0) {
							opa = 1.0;
						}
						if (posX >= 0) {
							panes.eq(current_pane).find($that.settings.likeSelector).css('opacity', opa);
							panes.eq(current_pane).find($that.settings.dislikeSelector).css('opacity', 0);
						} else if (posX < 0) {

							panes.eq(current_pane).find($that.settings.dislikeSelector).css('opacity', opa);
							panes.eq(current_pane).find($that.settings.likeSelector).css('opacity', 0);
						}
					}
					break;
				case 'mouseup':
				case 'touchend':
					touchStart = false;
					var pageX = (typeof ev.pageX == 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
					var pageY = (typeof ev.pageY == 'undefined') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
					var deltaX = parseInt(pageX) - parseInt(xStart);
					var deltaY = parseInt(pageY) - parseInt(yStart);

					posX = deltaX + lastPosX;
					posY = deltaY + lastPosY;
					var opa = Math.abs((Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2);

					if (opa >= 1) {
						if (posX > 0) {
							panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
								if($that.settings.onLike) {
									$that.settings.onLike(panes.eq(current_pane));
								}
								$that.next();
							});
						} else {
							panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
								if($that.settings.onDislike) {
									$that.settings.onDislike(panes.eq(current_pane));
								}
								$that.next();
							});
						}
					} else {
						lastPosX = 0;
						lastPosY = 0;
						panes.eq(current_pane).animate({"transform": "translate(0px,0px) rotate(0deg)"}, $that.settings.animationRevertSpeed);
						panes.eq(current_pane).find($that.settings.likeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
						panes.eq(current_pane).find($that.settings.dislikeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
					}
					break;
			}
		}
	};

	$.fn[ pluginName ] = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
			else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, 'plugin_' + pluginName)[options]();
		    }
		});

		return this;
	};

})(jQuery, window, document);

$("#tinderslide").jTinder({
    onDislike: function (item) {
    },
    onLike: function (item) {
      wantItem(items[parseInt(item.attr('class').split('e')[1]) - 1]);
    },
	animationRevertSpeed: 200,
	animationSpeed: 400,
	threshold: 1,
	likeSelector: '.like',
	dislikeSelector: '.dislike'
});

function wantItem(itemUrl) {
	//console.log(itemRef.imageUrl);
	var matched;
	var ref = firebase.firestore().collection('users');
	var itemRef = firebase.firestore().collection('items');
	var otherUserId;
	// Get the current user's matches array and add item
	itemRef.where("imageUrl", "==", itemUrl).get().then(function(item) {
		item.forEach(function(itemDoc) {
			//console.log("hello");
			firebase.firestore().collection('items').doc(itemDoc.id).get().then(function(moreItem) {
				otherUserId = moreItem.data().userId;
        _other = otherUserId;
        _user = firebase.auth().currentUser.uid;
				matched = checkMatched(otherUserId, firebase.auth().currentUser.uid);
			});
		})
	}).then(function() {
			ref.where("id", "==", firebase.auth().currentUser.uid).get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					//console.log(firebase.firestore().collection('users').doc(doc.id).collection('matches').collectionGroup);
					if (firebase.firestore().collection('users').doc(doc.id).collection('matches').collectionGroup == undefined) {
						firebase.firestore().collection('users').doc(doc.id).collection('matches').add({
							currIdx: itemUrl,
							belongs: otherUserId
						});
					} else {
						firebase.firestore().collection('users').doc(doc.id).collection('matches').get().then(function(snap) {
							snap.forEach(function(d) {
								firebase.firestore()
								.collection('users')
								.doc(doc.id)
								.collection('matches')
								.doc(d.id)
								.set (
									{[currIdx]: itemUrl},
									{belongs: otherUserId},
									{merge: true}
								);
							})
						})
					}
				})
				currIdx += 1;
			})
    })
  }

function chat() {
  window.location.href = "dm.html?p1=" + _user + "&p2=" + _other;
}

$('#tinderslide').jTinder();
