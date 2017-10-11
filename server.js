const express = require('express');
const Renderer = require('vue-server-renderer');
const bundle = require('./target/vue-ssr-server-bundle.json');

const app = express();
const renderer = Renderer.createBundleRenderer(bundle);

app.get('/', (req, res, next) => {
  const context = {};
  renderer.renderToString(context, (err, str) => {
    if (err) return next(err);
    res.end(str);
  });
});

app.listen(3000);
