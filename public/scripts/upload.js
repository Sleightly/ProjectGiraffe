function uploadPhoto(pic, title, type, user) {
	ref = firebase.storage().ref();
	const name = (+new Date()) + '-' + pic.name;
	var link;
	const task = ref.child(name).put(file)
	task.then(snapshot => snapshot.ref.getDownloadURL())
	.then(function(url) => link = url)

	firebase.firestore().collection('items').add({
		"title": title,
		"types": type,
		"userId": user,
		"imageUrl": link  
	});

}