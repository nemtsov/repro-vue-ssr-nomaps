# Issue

This issue is about rendering a component on the server (SSR) and using asynchronous / lazy-loaded components. When there's an error in a lazy-loaded component, `renderToString` is not called with an error, but instead the error gets logged to the console and (most importantly) source-maps are not used, making the error very difficult to debug.


## Repro:

1. `npm start`
2. curl -i http://localhost:3000

If you look at the `src/entry-server.js`, you'll notice:

```
import App from './App.vue';
// const App = () => import('./App.vue');
```

Importing `App` synchronously, and then running `npm start` and the curl, we see the following output:

**SYNCHRONOUS:**
```
# STDOUT/STDERR
[Vue warn]: Error in data(): "ReferenceError: a is not defined"

found in

---> <App> at src/App.vue
       <Root>

# HTTP OUTPUT
HTTP/1.1 500 Internal Server Error
X-Powered-By: Express
Date: Wed, 11 Oct 2017 18:41:32 GMT
Connection: keep-alive
Content-Length: 789

ReferenceError: a is not defined
    at module.exports.__webpack_exports__.a (src/bad.js:5:0)
    at module.exports.__webpack_exports__.a (src/first.js:4:0)
    at VueComponent.data (src/App.vue:14:0)
    at getData (node_modules/vue/dist/vue.runtime.esm.js:3226:0)
    at initData (node_modules/vue/dist/vue.runtime.esm.js:3185:0)
    at initState (node_modules/vue/dist/vue.runtime.esm.js:3116:0)
    at VueComponent.Vue._init (node_modules/vue/dist/vue.runtime.esm.js:4287:0)
    at new VueComponent (node_modules/vue/dist/vue.runtime.esm.js:4459:0)
    at createComponentInstanceForVnode (/wd/vue-ssr-nomaps/node_modules/vue-server-renderer/build.js:6836:10)
    at renderComponentInner (/wd/vue-ssr-nomaps/node_modules/vue-server-renderer/build.js:7012:40)
```

This is what I expect. Notice that:
  1. The status code is `500` (meaning `renderToString` was called with an `err`)
  2. The stack trace uses source maps to clearly show where the error is coming from


----

On the other hand, importing `App` asynchronously (uncommenting `import('./App.vue')`), and then running `npm start` and the curl, we see the following output:


**ASYNC:**
```
# STDOUT/STDERR
[Vue warn]: Error in data(): "ReferenceError: a is not defined"

found in

---> <App> at src/App.vue
       <Root>
[vue-server-renderer] error when rendering async component:

ReferenceError: a is not defined
    at exports.modules.__webpack_exports__.a (0.server-bundle.js:182:3)
    at exports.modules.__webpack_exports__.a (0.server-bundle.js:211:71)
    at VueComponent.data (0.server-bundle.js:167:73)
    at getData (server-bundle.js:3347:17)
    at initData (server-bundle.js:3306:7)
    at initState (server-bundle.js:3237:5)
    at VueComponent.Vue._init (server-bundle.js:4408:5)
    at new VueComponent (server-bundle.js:4580:12)
    at createComponentInstanceForVnode (/wd/vue-ssr-nomaps/node_modules/vue-server-renderer/build.js:6836:10)
    at renderComponentInner (/wd/vue-ssr-nomaps/node_modules/vue-server-renderer/build.js:7012:40)


# HTTP OUTPUT
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Wed, 11 Oct 2017 18:42:06 GMT
Connection: keep-alive
Content-Length: 7

<!---->
```

Notice that:
  1. The status code is `200` (meaning `renderToString` was called *not* with an `err`)
  2. The stack trace does not use source maps and is very difficult to debug
