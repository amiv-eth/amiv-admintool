# Admintool

# Developer Installation

```
git clone https://gitlab.ethz.ch/amiv/amiv-admintool.git
```
Install curl (e.g. for debian):
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install curl
```
Install npm:
```
npm install
```

And now, start developing:

```
npm run start
```

This will open up a local server outputting the current version of the admintools. It refreshes automatically as soon as you save changes in any `.js` file.

### File Structure:
* res (Resources)
    - favicon
    - logo
* src
    - views (reusable view components, etc for Tables and selection lists)
    - `index.js` main file
    - `*Tool.js` main file per API resource, e.g. for all user-related UIs.
