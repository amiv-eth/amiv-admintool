# Frontend

## Software

### Admintool:
* ```ubuntu /14.04.1```
* ```nginx /1.4.6```

### Website:
* undef.

# Admintool
### Dependecies:
* ```jQuery /2.2.2```
* ```bootstrap /3.3.6```
* ```amivaccess /1.0```

### Library ```tools```:
The JS library ```tools``` is the backbone of the single tools. It enables the tool itself to take actions, such as store data, spawn alert boxes, load new tools and more.

#### log(msg, type, timeout)
######Displays an alert box to the user.
* ```msg /text,HTML``` The message or html to be displayed in the alert box
* ```type /('s', 'i', 'w', 'e')``` Specifies the type of message. Displays different colors for each type.
	* s: success
	* i: information
	* w: warning
	* e: error
* ```timeout (optional)/int``` Number of milliseconds that the message will be displayed. If not specified the default time is 5s, or 5000ms.
##### Example:
* ``` tools.log('User updated!', 's'); ``` Creates a green alert box with the message specified that will disappear after 5000ms.
* ``` tools.log('Error!', 'e', 10000); ``` Creates a gred alert box with the message specified that will disappear after 10s.

#### tools.getTool(tool)
###### Loads the specified tool. If no tool is specified the tool in the navigaton bar (hashtag) will be choesn.
* ```tool (optional)/text``` Specifies the tool.
##### Example:
* ``` tools.getTool('home'); ``` Will get the /res/tools/```home```.tool and loads it into the site.

#### toggleSideMenu()
###### Toggles the sidebar
##### Example:
* ```tools.toggleSideMenu();``` Toggles the sidebar

#### mem.local & mem.session
######The mem element can store data for the tools, used for multiple cases. There are 2 tyoes of storage: ```local``` hast no expiration and ```session``` is stored until you close the window or tab. Every tool has separated storage, so you don't need to worry about conflicting with other tools. The subfunctions are the same, a so only ```session``` wil be demonstraded here. local works identically.

#### set(name, value)
######Sets and stores a value. If the value already exists it will be overwritten!
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