"use strict"

const koa = require('koa');
const app = koa();

app.name = 'SERVER BOX 1';
console.log(app.name, app.env);


app.use( function *(next) {
  // console.log('first middleware');
  // const start = new Date;
  yield next;

  // const ms = new Date - start;
  // this.set('X-Response-Time', ms + 'ms');
});

app.use(function *(next) {
  console.log('second middleware');
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log(`${this.method} ${this.url} - ${ms}`);
});

app.use(function *() {
  console.log('third middleware');
  this.body = 'Hello World';
});

app.listen(3000);

// app.context: extend this with objects for the lifetime of the application, rather than the request/response


