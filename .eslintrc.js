module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: [
        'standard'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
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
        "indent": [ "error", 4 ],
        // "indent": [ "error", 4, {
        //     "SwitchCase": 1,
        //     "outerIIFEBody": 1,
        //     "FunctionDeclaration": { "parameters": "first" },
        //     "FunctionExpression": { "body": 1, "parameters": 2 },
        //     "CallExpression": { "arguments": "first" }
        // }],

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
        "template-tag-spacing": [ "error", "always" ]
    }
}
