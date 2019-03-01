
/*

*/

const Router = require('koa-router');
const DB = require('./db');

const router = new Router();
//router.prefix("/api");

router.get('/vue2', async (ctx) => {
    await ctx.render('tvue', { username: 'The VUER 2'});
});


const JsonRpc = require('./jsonrpc');
const options = {
    limit: '2mb', // optional, defaults to 1mb
    /*
    auth: { // optional, will require authorization header
        username: 'myuser',
        password: 'mypass'
    }
     */
};
const jrpc2 = JsonRpc(options);

jrpc2.use('sum', async function sum(params) {
    return params.reduce((prev, curr) => prev + curr,  0);
});

jrpc2.use('ping', async function ping(params) {
    if (params == undefined || params.length < 1) params=['NA'];
    return 'Pong!' + params[0];
});

jrpc2.use('bad', async function bad() {
    throw new Error('I am Bad');
});


/*
if ctx.request.method !== 'POST' ...

curl -X POST -H "Content-Type:application/json" \
     -H "Authorization: Token a0b47cfe0ae50bc538d9555ea0ca468a6c0437a7c2724ac3c69c5624d0a91a8e" \
     -d '{ "jsonrpc": "2.0", "id":"123","method":"sum","params":[4,5,6] }'   http://localhost:3000/jrpc -i
*/
router.post('/jrpc', async (ctx) => {
    let body;
    try {
        body = ctx.request.body;
    } catch(err) {
        console.log("JSON-RPC parse error: " + err);
        ctx.body = {
            id: null,
            jsonrpc:'2.0',
            error: {code: -32700, message: "Parse error"}
        };
        return;
    }
    const hdr = ctx.get('authorization');
    if (hdr)
        console.log("received json-rpc authz header: %s",hdr);
    ctx.body = await jrpc2.handle(body,hdr);
});

    // GET http://localhost:3000/jrpc?json={ "jsonrpc": "2.0", "id":"123","method":"sum","params":[4,5,6] }
    // GET http://localhost:3000/jrpc?json={%20%22jsonrpc%22:%20%222.0%22,%20%22id%22:%22123%22,%22method%22:%22sum%22,%22params%22:[4,5,6]%20}
router.get('/jrpc', async (ctx) => {
    if (!ctx.query.json)
        ctx.throw(404,'Bad JSON-RPC Call');
    let body = JSON.parse(ctx.query.json);
    const hdr = ctx.get('authorization');
    if (hdr)
        console.log("received json-rpc authz header: %s",hdr);
    ctx.body = await jrpc2.handle(body,hdr);
});

module.exports = function (app) {
    app.use(router.routes());
    //app.use(router.allowedMethods());
};
