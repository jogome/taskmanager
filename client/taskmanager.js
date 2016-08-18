	// configures the accounts.ui in order to show 
    // the options of user name and user email
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_AND_EMAIL"
    });
	
	
	//////
	/// HELPERS
	///////////
	Template.taskmanager.helpers({
		"tasks": function() {
			var actualUserId = Meteor.userId();
			console.log("User ID to show "+actualUserId);
			var tasks = Tasks.find({createdBy: actualUserId}, {sort: {priority: "high"}});
			//var tasks = Tasks.find({createdBy: actualUserId});
			return tasks;
			
		},
		"getUser":function() {
			var user = Meteor.user().username;
				if (user) {
					return user;
				}
				else {
					return "unknown";
				}	
		 },
		 "checkBox": function() {
			var taskId = this._id;
			//console.log("The value= "+Tasks.findOne({_id: taskId}).boxChecked);
			var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
			if (checkBoxValue == true) {
				console.log("Box value = "+checkBoxValue);
				return "checked";
			}
			else {
				return "";
			}
		 },
		 "priorityLevel": function() {
			var taskId = this._id;
			var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
			if (taskPriorityLevel == 'normal') {
				
				return "high-priority";
			}
			else {
				
				return  "normal-priority";
			} 
		 },
		 "getEndDate": function() {  //  TO FIX !!!!!!!!!!!!!!!!
			var users = Meteor.userId();
			console.log("The task ID is: "+users);
			var taskId = this._id;
			console.log("The task ID is: "+taskId);
			var endDates = Tasks.findOne({_id: taskId}).endDate;
			console.log("The end date is: "+endDates);
			return endDates;
		 } 
	});
	
	// end  HELPERS for taskmanager template /////////////////////////////////
	
	//////
	/// TIMER COUNTDOWN
	/////////////
	
	var timeinterval;

Meteor.startup(function () {
	var endtime = 'September 8 2016 14:50:30 UTC-0400';
	timeinterval = setInterval(function () {
		Meteor.call("getCurrentTime", function (error, result) {
			Session.set("time", result);
			var t = getTimeRemaining(endtime);
			Session.set("t", t);
		})
	}, 1000);
});

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Session.get('time');
	var seconds = ("0" + Math.floor( (t/1000) % 60 )).slice(-2);
	var minutes = ("0" + Math.floor( (t/1000/60) % 60 )).slice(-2);
	var hours = ("0" + Math.floor( (t/(1000*60*60)) % 24 )).slice(-2);
	var days = Math.floor( t/(1000*60*60*24) );
	
	console.log(t);
	if(t <= 0)
		clearInterval(timeinterval);
		
	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

///////
/// HELPERS
///////////

Template.countdown.helpers({
	t: function () {
		return Session.get("t");
	}
});

Template.body.helpers({
	ended: function () {
		console.log(Session.get("t").total <= 0);
		return Session.get("t").total <= 0
	}
})

	
	// END TIMER COUNTDOWN
	

	//////
	/// EVENTS
	//////////
	
	
	var dateNow = new Date().toISOString();
				// formating the date
				var yearMonthDay = dateNow.slice(0, 10);
				var time = dateNow.slice(11, 16);
				var formatedTime = yearMonthDay + " at " + time;
				
	
	Template.addTask.onRendered(
		function() {
			console.log("I rendered!");
			$("form").hide();
		});
	
	
	Template.addTask.events({
		"submit form": function(event) {
			event.preventDefault();
			var taskCounter = Tasks.find().count();
			
			Tasks.find(
			  {
				_id: this._id
			  }
			).forEach(function(obj){
				print(obj.fieldname)
			})
			
			
			// the user that is loged in (current user) 
			var currentUserId = Meteor.userId();
			// get the task title from the form
			var newTaskTitle = event.target.taskTitle.value;
			// get the task content from the form
			var newTask = event.target.addingtask.value;
			
			// inserting task to the database
			Tasks.insert({
				taskNumber: taskCounter+1,
				taskTitle: newTaskTitle, 
				task: newTask,
				time: formatedTime,
				createdBy: currentUserId,
				boxChecked: false,
				priority: 'high',
				startDate: "",
				startTime: "",
				endDate: "",
				endTime: ""
				});
			
			// Reseting input text fields
			event.target.taskTitle.value = "";
			event.target.addingtask.value = "";
			
			$("form").toggle('slow');
			$(".add-task").html("<span class='added-task'>New Task Added!</span>");
			setTimeout(function() {$(".add-task").html("<span class='glyphicon glyphicon-plus' aria-hidden='true'>Add New Task!</span>").show();}, 2000);
			
		},
		"click .add-task": function() {
			$("form").toggle('slow');
		}
		
	});
	
	Template.taskmanager.events({
		"click .glyphicon-remove": function(event) {
			// getting the id of the clicked task 
			var itemId = this._id;
			
			/*////// MODAL confirm remove//*/ 
			var modalTitle = document.getElementById("modal-header-delete");
			var modalText = document.getElementById("modal-text-delete");
			modalTitle.innerHTML = "Task manager - Delete task"
			modalText.innerHTML = "Are you sure you want to delete permanentely this task?";
			
			$('#modalDeletePost').modal('show');
			var confirm_cancel = document.getElementById("cancel_delete");
			var confirm_ok = document.getElementById("ok_delete");
			
			
			
			confirm_ok.onclick = function() {
				// add a hide effect and then remove the task
				$('#'+itemId).hide('slow', function() {
						Tasks.remove({_id: itemId});
					});
					return false; 
			}
			
		},
		"click .checkbox": function() {
			console.log("You clicked on a checkbox!");
			//console.log(this._id);
			var taskId = this._id;
			var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
			if (checkBoxValue == false) {
				Tasks.update({_id: taskId}, {$set: {boxChecked: true}});
			}
			else {
				Tasks.update({_id: taskId}, {$set: {boxChecked: false}});
			}	
		},
		"click .task-priority": function() {
			
				var taskId = this._id;
				var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
				if (taskPriorityLevel == "normal") {
					Tasks.update({_id: taskId}, {$set: {priority: 'high'}});
				}
				else {
					Tasks.update({_id: taskId}, {$set: {priority: 'normal'}});
				}	
				 
		},
		"change input[type=date].startDate": function(event) {
			var taskId = this._id;
			var selectedStartDate = event.target.value;
			console.log("Starting date preview = "+selectedStartDate);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{startDate: selectedStartDate}});
		},
		"change input[type=date].endDate": function(event) {
			var taskId = this._id;
			var selectedEndDate = event.target.value;
			console.log("Ending date preview = "+selectedEndDate);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{endDate: selectedEndDate}});
		},
		"change input[type=time].startTime": function(event) {
			var taskId = this._id;
			var selectedStartTime = event.target.value;
			console.log("starting time = "+selectedStartTime);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{startTime: selectedStartTime}});
		},
		"change input[type=time].endTime": function(event) {
			var taskId = this._id;
			var selectedEndTime = event.target.value;
			console.log("ending time = "+selectedEndTime);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{endTime: selectedEndTime}});
		}	
		
	});
	
	// end  EVENTS /////////////////////////////////
	
	
