'use strict';

// Library for all tool actions
var tools = {
	
	//Log Function & Utility Vars
	alertNum: 0,
	alertType: {
		's': 'alert-success',
		'i': 'alert-info',
		'w': 'alert-warning',
		'e': 'alert-danger'
	},
	log: function(msg, type, timeout){
		timeout = timeout || 5000;
		tools.alertNum++;
		$('.alertCont').append('<div id="alertBox'+tools.alertNum+'" class="alert '+tools.alertType[type]+' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+msg+'</div>');
		setTimeout(function(){
			$('#alertBox'+tools.alertNum).alert('close');
		}, timeout);
		console.log(msg);
	},
	
	// Ajax loading gunction and getting the tools
	curTool: null,
	getTool: function(tool) {
		var nextTool = (typeof tool != 'object')? tool : window.location.hash.slice(1);
		if(tools.curTool == nextTool)
			return;
		tools.curTool = nextTool;
		window.location.hash = nextTool;
		$('#wheel-logo').css('transform', 'rotate(360deg)');
	  $('#main-content').fadeOut(100,function() {
		  $.ajax({
		    url: 'tools/' + tools.curTool + '.tool',
		    dataType: 'html',
		    error: function() {
		      tools.log('Tool not found', 'e');
		    }
		  }).done(function(data){
		    $('#main-content').html(data);
	      $('#main-content').fadeIn(250,function() {
	        $('#wheel-logo').css('transform', 'rotate(0deg)');
	      });
		  });
	  });
	},
	
	//Toggle the sidemenu
	toggleSideMenu: function(){
		$('.wrapper-main').toggleClass('toggled');
	},
	
	// Memory to store stuff
	memStore: function(type, name, val){
		window[type].setItem(name, val);
	},
	memGet: function(type, name){
		return window[type].getItem(name);
	},
	mem: {
		local: {
			set: function(name, val){
				tools.memStore('localStorage', tools.curTool+name, val);
			},
			get: function(name){
				return tools.memGet('localStorage', tools.curTool+name);
			},
		},
		session: {
			set: function(name, val){
				tools.memStore('sessionStorage', tools.curTool+name, val);
			},
			get: function(name){
				return tools.memGet('sessionStorage', tools.curTool+name);
			},
		}
	}
}

/*
	Initialization of page
*/

//Binding tool change whenever the hash is changed
window.onhashchange = tools.getTool;
//Setting home if no other tool is selected
if(window.location.hash == '' || window.location.hash == null)
	window.location.hash = 'home';

// Binding the buttons
$('.toggleSidebarBtn').click(tools.toggleSideMenu);

amivaccess.ready(function(){
	
	tools.getTool();
	
	if(amivaccess.authenticated())
		$('.loginPanel').css({'top':'-100%'});
	
});