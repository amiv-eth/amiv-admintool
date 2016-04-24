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
    log: function(msg, type, timeout) {
        timeout = timeout || 5000;
        tools.alertNum++;
        $('.alertCont').append('<div id="alertBox' + tools.alertNum + '" class="alert ' + tools.alertType[type] + ' alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + msg + '</div>');
        setTimeout(function() {
            $('#alertBox' + tools.alertNum).alert('close');
        }, timeout);
        console.log(msg);
    },

    // Modal function
    modalFunc: {
        init: 0,
    },
    modal: function(attr) {
        attr = attr || {};
        if (attr.success !== undefined && typeof(attr.success) == 'function')
            tools.modalFunc.success = attr.success;
        if (attr.cancel !== undefined && typeof(attr.cancel) == 'function')
            tools.modalFunc.cancel = attr.cancel;
        if (!tools.modalFunc.init) {
            $('.modalCont .modal-footer .btn-primary').click(function() {
                $('.modalCont').off('hide.bs.modal').modal('hide');
                tools.modalFunc.success();
            });
            $('.modalCont').on('hide.bs.modal', tools.modalFunc.cancel);
            tools.modalFunc.init = 1;
        }
        $('.modalCont .modal-title').html(attr.head);
        $('.modalCont .modal-body').html(attr.body);
        $('.modalCont .modal-footer .btn-primary').html(attr.button);
        $('.modalCont').modal('show');
    },

    // Ajax loading gunction and getting the tools
    curTool: '',
    getTool: function(tool) {
        //Setting home if no other tool is selected
        if (window.location.hash == '' || window.location.hash == null)
            window.location.hash = 'home';
        // If tool is specfied, get it
        var nextTool = (tool && typeof tool != 'object') ? tool : window.location.hash.slice(1);
        if (tools.curTool == nextTool)
            return;
        tools.curTool = nextTool;
        window.location.hash = tools.curTool;
        $('#wheel-logo').css('transform', 'rotate(360deg)');
        $('#main-content').fadeOut(100, function() {
            // Reset Custom menu
            tools.ui.menu();
            $.ajax({
                url: 'tools/' + tools.curTool + '.tool',
                dataType: 'html',
                error: function() {
                    tools.log('Tool not found', 'e');
                }
            }).done(function(data) {
                $('#main-content').html(data);
                tools.ui.resizeTool();
                $('#main-content').fadeIn(250, function() {
                    $('#wheel-logo').css('transform', 'rotate(0deg)');
                });
            });
        });
    },

    // UI Stuff
    ui: {
        //Toggle the sidemenu
        toggleSideMenu: function() {
            $('.wrapper-main').toggleClass('toggled');
        },
        login: function() {
            $('.loginPanel').css({
                'top': '-100%'
            });
        },
        logout: function() {
            $('.loginPanel').css({
                'top': '0%'
            });
        },
        resizeTool: function() {
            $('tools-full-height').height($(window).height() - $('.navbar-main').height());
        },
        menuId: 0,
        menu: function(attr) {
            var custMenu = $('.cust-menu');
            custMenu.html('');
            for (var cur in attr) {
                tools.ui.menuId++;
                if (attr[cur].link == '' || attr[cur].link === undefined)
                    attr[cur].link = 'javascript:void(0);';
                custMenu.append('<li><a href="' + attr[cur].link + '" id="cust-menu-link-' + tools.ui.menuId + '">' + cur + '</a></li>');
                if (typeof(attr[cur].callback) == 'function')
                    $('#cust-menu-link-' + tools.ui.menuId).on('click', attr[cur].callback);
            }

        }
    },

    // Memory to store stuff
    memStore: function(type, name, val) {
        window[type].setItem(name, val);
    },
    memGet: function(type, name) {
        return window[type].getItem(name);
    },
    mem: {
        local: {
            set: function(name, val) {
                tools.memStore('localStorage', tools.curTool + name, val);
            },
            get: function(name) {
                return tools.memGet('localStorage', tools.curTool + name);
            },
        },
        session: {
            set: function(name, val) {
                tools.memStore('sessionStorage', tools.curTool + name, val);
            },
            get: function(name) {
                return tools.memGet('sessionStorage', tools.curTool + name);
            },
        }
    }
}

/*
	Initialization of page
*/

//Binding tool change whenever the hash is changed
window.onhashchange = tools.getTool;

// Login function
function loginFunc() {
    $('.loginPanel input').attr('readonly', 1);
    amivcore.login($('#loginUsername').val(), $('#loginPassword').val(), function(ret) {
        if (ret !== true)
            tools.log('Wrong Credentials', 'w');
        $('.loginPanel input').removeAttr('readonly');
    });
}

// Binding the buttons
$('.toggleSidebarBtn').click(tools.ui.toggleSideMenu);
$('.loginAction').click(loginFunc);
$('.logoutAction').click(amivcore.logout);
$('.loginPanel').keypress(function(e) {
    if (e.which == 13) {
        e.preventDefault();
        loginFunc();
    }
})

amivcore.on('ready', function() {
    tools.getTool();
});
amivcore.on('login', function() {
    tools.ui.login();
});
amivcore.on('logout', function() {
    tools.ui.logout();
});
