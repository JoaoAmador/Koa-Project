
/*

see:  https://www.npmjs.com/package/koa2-swagger-ui


https://github.com/koajs/examples

https://github.com/koajs/koa

https://github.com/koajs/examples

https://github.com/danneu/koa-skeleton

---

npm install -g nodemon

npm install koa --save
npm install sqlite3 --save

https://www.npmjs.com/package/koa-generic-session
npm i --save koa-csrf

--


nodemon server.js

nodemon -v  # 1.18.3
node -v  #  9.11.1
--
const path = require('path');
const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');
const sequelize = new Sequelize('sqlite:/home/abs/path/dbname.db')

const serve = require('koa-static');
const publicFiles = serve(path.join(__dirname, 'public'));
publicFiles._name = 'static /public';
app.use(publicFiles);

--
  random-route: true
  
*/

const path = require('path');
const Koa = require('koa');

const app =  new Koa();

const bodyParser = require('koa-bodyparser');

const serve_static = require('koa-static');
const kviews = require('koa-views');
const nunjucks = require('nunjucks');
const uuidv4 = require('uuid/v4');

const DB = require('./db');

const dbfile = path.join(__dirname, 'scott2.db');

if (DB.Start(dbfile) != true)
  process.exit(1);

app.context.db = DB.conn;



const klogger = require('koa-logger');
app.use(klogger());

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time-Ms', ms);
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`);
});


// set correlation id
app.use(async (ctx, next) => {
  const hdr = 'x-request-id';
  let id = ctx.get(hdr);
  if (!id) {
    id = uuidv4();
    ctx.set(hdr,id);
  }
  ctx.requestId = id;
  console.log(`Request-id: ${id}`);

  await next();
});

// handle responses
app.use(bodyParser());

app.use(serve_static('./static'));

nunjucks.configure(path.join(__dirname,'templates'), { autoescape: true });
app.use( kviews(path.join(__dirname, 'templates'), {
  //map: { html: 'nunjucks' }    
  extension: 'njk',  map: { njk: 'nunjucks' }
}));

const myRouter1 = require('./routes');
app.use(myRouter1.routes());

require('./routes2')(app);
require('./routes3')(app);


// cleanup 
function app_close() {
  DB.Terminate();
}

// main loop
port = process.env.PORT || process.env.VCAP_APP_PORT || process.argv[2]  || 3000;

if (!module.parent)
  app.listen(port, err => console.log('listening on port %s', port));

// to be testable
module.exports = app;