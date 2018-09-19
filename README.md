# AppFormer.js


Getting started
--
#### 1. Installing
```
npm install appformer-js
```


#### 2. Creating decorators

**NOTE:** Check if you have `verdaccio` installed with `which verdaccio`. If you don't have it, run `npm install -g verdaccio`.

[Verdaccio]() is a local npm registry. AppFormer.js uses it to publish its generated RPC/POJO modules that were created during the build of your Java project.


#### 3. Using the Development Console
//TODO


Development
--

#### Building the project


**NOTE:** Make sure that you have [npm]() installed.

```bash
npm install --prefix core && \
npm run build:prod --prefix core && \

npm install --prefix decorators && \
npm run build:prod --prefix decorators && \

npm install --prefix dev-console && \
npm run build:prod --prefix dev-console && \

npm install --prefix showcase-components && \
npm run build:prod --prefix showcase-components && \

npm install --prefix showcase && \
npm run build:prod --prefix showcase && \

echo "Done."
```
#### Other
- Use `npm start --prefix showcase` to start the Showcase application
- Use `npm test --prefix [module]` to run the unit tests
- Use `npm run build:dev --prefix [module]` to build the module using the development configuration
