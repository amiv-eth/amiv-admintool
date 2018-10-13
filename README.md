# Admintool

# Developer Installation

```
npm install
```

And now, start developing:

```
npm run start
```

*Warning*: For installation on Ubuntu 16.04 (and possibly similar), you need to install nodejs from the repos source.
1. Remove nodejs if you already have it (ONLY IF YOU REALLY WANT!):
```
sudo apt remove nodejs
```
2. Add nodejs10 from repo (download): `curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -`
3. Install: `sudo apt install -y nodejs`
4. Clean-up and install the packages for amiv-admintools
```
rm -rf node_modules/
npm install
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
