const path = require("path");
const parentConfig = require(path.resolve("../../jest.config.js"));

parentConfig.defaults.setupFiles = ["./test-env/jest-env-setup.js"];
parentConfig.defaults.snapshotSerializers = ["<rootDir>/node_modules/enzyme-to-json/serializer"];

if (!parentConfig.defaults.globals) {
  parentConfig.defaults.globals = {}
}

if (!parentConfig.defaults.globals['ts-jest']) {
  parentConfig.defaults.globals['ts-jest'] = {};
}

parentConfig.defaults.globals['ts-jest'].diagnostics = {
  pathRegex: ".*.test.tsx?$"
};

module.exports = parentConfig.defaults;
