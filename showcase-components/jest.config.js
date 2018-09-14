const { defaults } = require("jest-config");

module.exports = {
  moduleDirectories: [...defaults.moduleDirectories, "src"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  testRegex: "/__tests__/.*\\.test\\.(jsx?|tsx?)$",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest"
  }
};
