module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "env": {
      "browser": true,
    },
    "rules": {
        "no-console": 0,
        "class-methods-use-this": 0,
        "prefer-destructuring": 1,
        "no-underscore-dangle": 0,
        "linebreak-style": 0,
        "import/no-unresolved": [ "error", { "ignore": [ 'networkConfig' ] } ], // hack until resolving import properly
    }
};
