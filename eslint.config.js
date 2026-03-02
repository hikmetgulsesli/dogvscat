export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                fetch: 'readonly',
                document: 'readonly',
                window: 'readonly',
                setTimeout: 'readonly',
            }
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-restricted-syntax': [
                'error',
                {
                    selector: 'ImportDeclaration[source.value=/^\\.\\.?\\/.*(?<!\\.js)$/]',
                    message: 'Relative imports must end with .js extension for Node.js ESM compatibility.',
                },
            ],
        }
    }
];
