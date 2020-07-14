const { resolve } = require("path");
module.exports = {
    // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
    // This option interrupts the configuration hierarchy at this file
    // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
    root: true,

    // https://eslint.vuejs.org/user-guide/#how-to-use-custom-parser
    // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
    // `parser: "vue-eslint-parser"` is already included with any "plugin:vue/**" config and should be omitted
    parserOptions: {
        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser#configuration
        // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin#eslint
        // Needed to make the parser take into account "vue" files
        extraFileExtensions: [ ".vue" ],
        parser: "@typescript-eslint/parser",
        project: resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },

    env: {
        browser: true
    },

    // Rules order is important, please avoid shuffling them
    extends: [
        // Base ESLint recommended rules
        // "eslint:recommended",

        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
        // ESLint typescript rules
        "plugin:@typescript-eslint/recommended",
        // consider disabling this class of rules if linting takes too long
        "plugin:@typescript-eslint/recommended-requiring-type-checking",

        // Uncomment any of the lines below to choose desired strictness,
        // but leave only one uncommented!
        // See https://eslint.vuejs.org/rules/#available-rules
        "plugin:vue/essential", // Priority A: Essential (Error Prevention)
        // "plugin:vue/strongly-recommended", // Priority B: Strongly Recommended (Improving Readability)
        // "plugin:vue/recommended", // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

        "standard"

    ],

    plugins: [
        // required to apply rules which need type information
        "@typescript-eslint",

        // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
        // required to lint *.vue files
        "vue",

    ],

    globals: {
        ga: true, // Google Analytics
        cordova: true,
        __statics: true,
        process: true,
        Capacitor: true,
        chrome: true
    },

    // add your custom rules here
    rules: {
        // allow async-await
        "generator-star-spacing": "off",
        // allow paren-less arrow functions
        "arrow-parens": "off",
        "one-var": "off",

        "import/first": "off",
        "import/named": "error",
        "import/namespace": "error",
        "import/default": "error",
        "import/export": "error",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",
        "prefer-promise-reject-errors": "off",

        // TypeScript
        quotes: [ "warn", "single", { avoidEscape: true } ],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",

        // allow debugger during development only
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

        // --------------------------------------------------
        // CUSTOMIZATION
        // --------------------------------------------------
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",

        // arrays
        "array-bracket-newline": [ "error", "consistent" ],
        "array-bracket-spacing": [ "error", "always" ],
        "array-element-newline": [ "error", "consistent" ],

        // blocks
        "block-spacing": "error",

        // braces
        "brace-style": [ "error", "1tbs" ],

        // commas
        "comma-dangle": [ "error", "never" ],
        "comma-spacing": [ "error", { "before": false, "after": true }],

        "computed-property-spacing": [ "error", "never", { "enforceForClassMembers": true }],

        "consistent-this": [ "error", "self" ],

        "eol-last": [ "error", "always" ],

        "func-call-spacing": [ "error", "never" ],

        // indentation
        // "indent": [ "error", 4 ],
        "indent": [ "error", 4, {
            "SwitchCase": 1,
            // "outerIIFEBody": 1,
            // "FunctionDeclaration": { "parameters": "first" },
            // "FunctionExpression": { "body": 1, "parameters": 2 },
            // "CallExpression": { "arguments": "first" }
        }],

        "no-trailing-spaces": [ "error", {
            "skipBlankLines": true
        }],
        "no-useless-constructor": "off",
        "no-unused-vars": "off",
        
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/no-unused-vars": "warn",

        // objects
        "object-curly-newline": [ "error", {
            // "multiline": true,
            // "ImportDeclaration": "never",
            // "ExportDeclaration": "never",
            "ObjectExpression": { "multiline": true },
            "ObjectPattern": "never",
            "ImportDeclaration": "never",
            "ExportDeclaration": "never"
        }],
        "object-curly-spacing": [ "error", "always" ],

        "padded-blocks": [ "error", {
            "blocks": "never",
            "classes": "always",
            "switches": "never"
        }],

        // quotes
        "quotes": [ "error", "double" ],

        // semi colons
        "semi": [ "error", "always" ],
        "semi-spacing": [ "error", {
            "before": false,
            "after": true
        }],
        "semi-style": [ "error", "last" ],

        // spacing
        "spaced-comment": [ "error", "always" ],
        "space-before-blocks": "error",
        "space-before-function-paren": [ "error", {
            "anonymous": "always",
            "asyncArrow": "always",
            "named": "never"
        }],
        "space-infix-ops": [ "error", { "int32Hint": true }],
        "space-in-parens": [ "error", "never" ],
        "space-unary-ops": "error",
        "template-tag-spacing": [ "error", "always" ],
        "no-multi-spaces": [ "error", {
            "ignoreEOLComments": true
        }]
    }
}
