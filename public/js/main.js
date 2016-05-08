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
                    if (item.time_start == null){
						$('.datum').remove();
					}
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
					if (item.spots>=0 && regstart<=heute && regend>=heute && item.allow_email_signup==false){
						register = "Anmelden";
						$('.eventdets').append('<div class="card-content">'+item.description_de+'</div>');
					} else if (item.spots>=0 && regstart<=heute && regend>=heute){
						console.log(amivcore.authenticated());
						console.log("yolo");
						if(amivcore.authenticated()){
							register = "Anmelden";
							$('.eventdets').append('<div class="card-content">'+item.description_de+'</div>');
							$(this).masonry('reloadItems').masonry();
						}
					}
					
                    addElement('<div class="card"><div class="card-image"><img class="img-responsive" src="'+item.img_banner+'"><date class="datum"><div class="month">'+month[datenum.getMonth()]+'</div><div class="day">'+datenum.getDate()+'</div><div class="starttime">'+datenum.getHours()+':'+minutes+'</div><date-overlay></date-overlay></date><span class="card-title">'+item.title_de+' @ '+item.location+'</span></div><div class="card-content" id="eDescription'+item.id+'">'+item.description_de+'</div><div class="card-action"><a href="#" target="new_blank" id="moreInfo" title="'+item.id+'">Info</a><a href="#" id="anmeldeSub" target="new_blank" data-toggle="modal" data-target="#anmeldeModal">'+register+'</a><a href="#" target="new_blank">Im Kalender speichern</a></div></div>');
                });
            });
        });
        
//	Card Info Enfolding
 $('#moreInfo').on('click', function(){        
	 id_event=self.title;
	 console.log(id_event);
	 amivcore.events.GET({
        id: $(this).attr('id_event')
      }, function(ret) {
        curEventData = ret;
        console.log(id_event);
        $('<div class="card-content"><p>trololo</p></div>').insertAfter('#eDescription'+'id_event');
      });
 }); 
 
 //   Eventanmeldung
 $('#anmeldeSub').on('click');       
         
//   Login
 $('#loginSubmit').on('click', function(){
	    amivcore.login($('#loginUsername').val(), $('#loginPassword').val(), function(ret) {
        if (ret == true){
			$('.welcomening').append('<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">+amivcore.user({})+<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#">Logout</a></li><li role="separator" class="divider"></li><li><a href="https://intern.amiv.ethz.ch/wiki/">AMIV-Tools</a></li></ul></li>'); 
			
			$('.loglogbutton').hide();       
        } else {
	     		$('.welcomening').append('<p class="navbar-text navbar-right message" style="color:red;margin-right:10px;">LOGIN FAILED</p>');
	     		setTimeout(function() {
					$('.message').remove();
				}, 2000);
        }         
    });  
 });

 

