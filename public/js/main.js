function getEvents(callback) {
            callback = callback || function(ret) {
                console.log(ret);
            }
            $.getJSON('https://amiv-apidev.vsos.ethz.ch/events/', callback);
        }

        function addElement(item) {
            $('.grid')
                .append('<div class="grid-item col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">' + item + '</div>');
        }
        
        $(document).ready(function() {
            $('.grid-item, .grid-sizer').addClass('col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2');
            $('.grid').masonry({
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true,
                originLeft: false
            }).on('DOMSubtreeModified', function(){
	            $(this).masonry('reloadItems').masonry();
            })
            getEvents(function(ret) {
                ret['_items'].forEach(function(item) {
	                /*Is it Websitecontent?*/
	                if (item.show_website == false){
		                return;
	                }
                    console.log(item.title_de);
                    
                    /*Picture Checker*/
                    if (item.img_banner == null){
						item.img_banner = "https://s-media-cache-ak0.pinimg.com/736x/9c/24/fd/9c24fdb71c67e31efef540efb141f96d.jpg";
                    }
                    /* Datum anpassen*/
					var datenum = new Date(item.time_start);
					
					
					/*Minuten immer Zweistellig*/
					var minutes = datenum.getMinutes();
					if (minutes < 10){
						minutes = "0" + minutes;
					}
					var month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
					
					/*Anmeldung*/
					var regstart = new Date(item.time_register_start);
					var regend = new Date(item.time_register_end);
					var heute = new Date(Date.now());
					var register = "";
					if (item.spots>=0 && regstart<=heute && regend>=heute){
						register = "Anmelden";
					}
					
                    addElement('<div class="card"><div class="card-image"><img class="img-responsive" src="'+item.img_banner+'"><date><div class="month">'+month[datenum.getMonth()]+'</div><div class="day">'+datenum.getDate()+'</div><div class="starttime">'+datenum.getHours()+':'+minutes+'</div><date-overlay></date-overlay></date><span class="card-title">'+item.title_de+' @ '+item.location+'</span></div><div class="card-content">'+item.description_de+'</div><div class="card-action"><a href="#" target="new_blank">Info</a><a href="#" target="new_blank">'+register+'</a><a href="#" target="new_blank">Im Kalender speichern</a></div></div>');
                });
            });
        }); 
//   Login
 $('#loginSubmit').on('click', function(){
	    amivcore.login($('#loginUsername').val(), $('#loginPassword').val(), function(ret) {
        if (ret == true){
			$('.welcomening').append('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">+amivcore.user+<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#">Logout</a></li><li role="separator" class="divider"></li><li><a href="https://intern.amiv.ethz.ch/wiki/">AMIV-Tools</a></li></ul></li>'); 
			
			$('.loglogbutton').hide();       
        } else {
	     		$('.welcomening').append('<p class="navbar-text navbar-right message" style="color:red;margin-right:10px;">LOGIN FAILED</p>');
	     		setTimeout(function() {
					$('.message').remove();
				}, 2000);
        }         
    });  
 });

 
 
