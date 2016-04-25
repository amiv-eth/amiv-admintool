# Admintool
### Software:
* ```ubuntu /14.04.1```
* ```nginx /1.4.6```

### Dependecies:
* ```jQuery /2.2.2```
* ```bootstrap /3.3.6```
* ```amivaccess /1.0```

### File Structure:
* admin (Admintool)
	* lib (Libraries)
		* bootstrap
		* jquery
		* amiv (amivcore)
		* cust (custom files)
			* main.js (our js file)
			* main.css (our css file)
	* res (Resources)
		* bg (big pictures and backgrounds)
		* favicon
		* fonts
		* logo
	* tools (tools)
		* main.tool
		* users.tool
		* ...
* public (Website)

## Library ```tools```:
The JS library ```tools``` is the backbone of the single tools. It enables the tool itself to take actions, such as store data, customize the menu, spawn alert boxes, load new tools and more.

### log(msg, type, timeout)
###### Displays an alert box to the user.
* ```msg /text,HTML``` The message or html to be displayed in the alert box
* ```type /('s', 'i', 'w', 'e')``` Specifies the type of message. Displays different colors for each type.
	* s: success
	* i: information
	* w: warning
	* e: error
* ```timeout /int (optional)``` Number of milliseconds that the message will be displayed. If not specified the default time is 5s, or 5000ms.

##### Example:
* ``` tools.log('User updated!', 's'); ``` Creates a green alert box with the message specified that will disappear after 5000ms.
* ``` tools.log('Error!', 'e', 10000); ``` Creates a gred alert box with the message specified that will disappear after 10s.

### modal(data)
###### Spwans a BS modal. To close a modal without a button just call ```tools.modalClose()```
* ```data /js object``` Object containning the infos
	* ```head /text, HTML (optional)``` Sets the modal title.
	* ```body /text, HTML (optional)``` Sets the modal body.
	* ```button /object (optional)``` Buttons in the footer. (Multiple allowed!! :D)
		* ```type /string (optional)``` Type of boostrap button
			* primary
			* success
			* info
			* warning
			* danger
			* link
		* ```close /bool (optional)``` Close modal on click 
		* ```callback /function (optional)``` Callback for the button
	* ```cancel /function (optional)``` Function called on cancel or modal is closed.

##### Example:
```javascript
tools.modal(); 
//Creates an empty modal.

tools.modal({
	head: 'Download Flash Player!!',
	body: 'Your browser needs this super important plugin',
	button: {
		'DOWNLOAD!':{
			type: 'success',
			close: true,
			callback: function(){
				some.nasty.virusdownload.now();
			}
		},
	},	
	cancel: function(){
		console.log('No Virus for you -.-');
	}
});
// Makes a modal to download stuff
```
### getTool(tool)
###### Loads the specified tool. If no tool is specified the tool in the navigaton bar (hashtag) will be chosen.
* ```tool /text (optional)``` Specifies the tool.

##### Example:
* ``` tools.getTool('home'); ``` Will get the /res/tools/```home```.tool and loads it into the site.

### ui
###### The ```ui``` element allows you to access ui components (menu) and take actions (login, logout, toggleSideMenu).

#### toggleSideMenu()
##### Example:
* ```tools.ui.toggleSideMenu();``` Toggles the sidebar.

#### menu(object)
###### Allows a tool to access the top menu and have custom links and callbacks.
* ```object /js object``` Menu structured element from which the menu is generated.
	* ```link /link (optional)``` HTTP link or hash. If left empty the link is disabled.
	* ```callback /function (optional)``` The function that is called if the link is pressed.

##### Example:
```javascript
tools.ui.menu({
	'Foo':{}
});
// Creates a single link element named 'Foo' without a href or callback

tools.ui.menu({
	'Foo':{
		link:'google.com'
	}
});
// Creates a link named 'Foo' without a callback, but is linked to google.com

tools.ui.menu({
	'Foo':{
		callback: function (){
			console.log('I was pressed!!');
		}
	}
});
// Creates a link 'Foo' and calles the function once the link is called

tools.ui.menu({
	'Foo':{
		link: '#trololo',
		callback: function (){
			console.log('I was pressed!!');
		}
	}
});
// Creates a link 'Foo' and calles the function once the link is called and the user gets redirected to #trololo.
```


### mem.local & mem.session
###### The mem element can store data for the tools, used for multiple cases. There are 2 tyoes of storage: ```local``` hast no expiration and ```session``` is stored until you close the window or tab. Every tool has separated storage, so you don't need to worry about conflicting with other tools. The subfunctions are the same, a so only ```session``` wil be demonstraded here. local works identically.

#### set(name, value)
###### Sets and stores a value. If the value already exists it will be overwritten!
* ```name /text``` Name of the 'variable'.
*  ```value /any``` The data to be stored. Can be any valid JS data, object, etc.

##### Example:
* ```tools.mem.session.set('currentUser', 'Sir Anon');``` Stores 'Sir Anon' in 'currentUser'.
* ```tools.mem.session.set('someData', {'car':'tesla'});``` Stores the object in 'someData'.

#### get(name)
###### Returnes the assosiated value. If there is no data it will return ```null```.
* ```name /text``` Name of the 'variable'.

##### Example:
* ```tools.mem.session.get('currentUser'); > 'Sir Anon'``` Retrieves 'currentUser'.
* ```tools.mem.session.set('someData'); > {'car':'tesla'}``` Retrieves 'someData'.
* ```tools.mem.session.set('nopeFoo'); > null``` No data stored unter 'nopeFoo', so returns ```null```.


# Website