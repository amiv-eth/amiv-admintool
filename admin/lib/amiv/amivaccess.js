(function(window) {
  'use strict';
  // Library NameSpace
  var lns = 'amivaccess'

  function libgen() {
    // Lib to returned
    var lib = {};
		
		// Core
    var core = {
	    // Important vars n' stuff
	    lib: {
	      api_url: 'https://amiv-apidev.vsos.ethz.ch',
	      spec_url: 'lib/amiv/spec.json',
	      authenticated: false,
	      ready: false,
	      req_time_out: 5000,
	      ready_interval: 50,
	      show_errors: true,
	    },

    return lib;
  }

  if (typeof(window[lns]) === 'undefined') {
    window[lns] = libgen();
  } else {
    console.log(lns+' already defined, please solve conflict');
  }

})(window);
