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
			var tasks = Tasks.find({createdBy: actualUserId});
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
		 }
		  
		
	});
	
	// end  HELPERS /////////////////////////////////
	

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
				priority: 'high' 
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
				 
			}
		
		
	});
	
	// end  EVENTS /////////////////////////////////
