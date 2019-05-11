module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "env": {
      "browser": true,
    },
    "rules": {
        "no-console": 1,
        "class-methods-use-this": 0,
        "prefer-destructuring": 1,
        "no-underscore-dangle": 0,
        "linebreak-style": 0,
        "import/no-unresolved": [ "error", { "ignore": [ 'networkConfig' ] } ], // hack until resolving import properly
        "object-curly-newline": [ "error", {
            ObjectExpression: { multiline: true, consistent: true },
            ObjectPattern: { multiline: true, consistent: true },
            ImportDeclaration: { minProperties: 7, consistent: true },
            ExportDeclaration: { minProperties: 7, consistent: true },
        }],
        "max-len": [ "error", { "code": 100, ignorePattern: ".*<svg.+>" }],
    }
};
