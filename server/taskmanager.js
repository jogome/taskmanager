Meteor.methods({
	'getCurrentTime': function() {
		return Date.parse(new Date());
	 } 
});



