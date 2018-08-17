const {defaults} = require('jest-config');

module.exports = {
    moduleDirectories: [...defaults.moduleDirectories, 'src'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js?|jsx?|ts?|tsx?)$',
    transform: {
        '^.+\\.(js?|jsx?)$': 'babel-jest',
        '^.+\\.(ts?|tsx?)$': 'ts-jest'
    }
};
