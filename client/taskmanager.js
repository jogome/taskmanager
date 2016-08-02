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
		/*
		"getUser":function(user_id) {
			var user = Meteor.users.findOne({_id:user_id});
			if (user) {
				//console.log(user);
				return user.username;
			}
			else {
			    return "unknown";	
			}
		}*/
		
		"getUser":function() {
			var user = Meteor.user().username;
				return user;	
		 }
		
		
	});

	//////
	/// EVENTS
	//////////
	
	var dateNow = new Date().toISOString();
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
			
			//console.log("the number of field is: " + taskCounter);
			var currentUserId = Meteor.userId();
			console.log("User name ="+Meteor.user().username);
			console.log("User name ="+Meteor.user()._id);
			var newTaskTitle = event.target.taskTitle.value;
			var newTask = event.target.addingtask.value;
			console.log("New task: "+newTask);
			Tasks.insert({
				taskNumber: taskCounter+1,
				taskTitle: newTaskTitle, 
				task: newTask,
				time: formatedTime,
				createdBy: currentUserId 
				});
			
			// Reseting input text fields
			event.target.taskTitle.value = "";
			event.target.addingtask.value = "";
			/*
			$("form").toggle('slow', function() {
					$(".add-task").html("New Task Added!").show().delay(2000).fadeOut();
				});
			*/
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
			//var confirmDelete = confirm("Are you sure you want to delete this item?");
			
			console.log("clicked on task!");
			var itemId = this._id;
			
			
			var modalTitle = document.getElementById("modal-header-delete");
			var modalText = document.getElementById("modal-text-delete");
			modalTitle.innerHTML = "Task manager - Delete task"
			modalText.innerHTML = "Are you sure you want to delete permanentely this task?";
			
			$('#modalDeletePost').modal('show');
			var confirm_cancel = document.getElementById("cancel_delete");
			var confirm_ok = document.getElementById("ok_delete");
			
			
			//if(confirmDelete == true) {
			confirm_ok.onclick = function() {
				$('#'+itemId).hide('slow', function() {
						Tasks.remove({_id: itemId});
					});
					return false; 
			}
			
		}
		
	});
	

