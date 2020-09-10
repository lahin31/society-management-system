module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "import/no-named-as-default": 0,
        "import/no-named-as-default-member": 0,
        "no-shadow": "off",
        "no-else-return": "error",
        "no-empty": "error",
        "no-lonely-if": "error",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    }
};