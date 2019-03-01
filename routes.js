/*
 * Sleep for N milliseconds.
 
exports.sleepMs = function(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

*/
const crypto = require('crypto');
const Router = require('koa-router');
const DB = require('./db');

const router = new Router();

router.get('/', async (ctx) => {
    const d1 = new Date();
    const secret = ctx.request.query.sk || 'my secret-' + crypto.randomBytes(4).toString('hex');
    const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
    console.log(hash);
    ctx.body = { 
        Koa:  d1.getTime(), 
        Date: d1.toISOString(),
        sk: secret,
        hmac: hash
    };
});

router.get('/health', async (ctx) => {
    let stat = {
        app: 'OK',
        redis: false
    };
    ctx.body = stat;
});


router.get('/db1', async (ctx) => {
    let ob1 = {}; //{  version: ctx.version };

    try {
        await new Promise((resolve, reject) => {
            //ctx.db.all(
            DB.conn.all("SELECT DEPTNO, DNAME, LOC  FROM DEPT",[], (err, rows) => {
                if (err) return rejet(err);
                
                if (rows.length > 0) {
                    row = rows[0];
                    console.log("first row: %d; %s; %s",row.DEPTNO,row.DNAME,row.LOC);
                }
                ob1 = rows;
                resolve(); 
            });
        });
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});

router.get('/db1/:id', async (ctx) => {
    let ob1 = {}; 
    let id = ctx.params.id;

    try {
        let row = await DB.GetRow("SELECT DEPTNO, DNAME, LOC  FROM DEPT WHERE DEPTNO = ?",[id]);
        if (!row) throw new Error("not found:" + id);
        console.log("row: %d; %s; %s",row.DEPTNO,row.DNAME,row.LOC);
        ob1 = row;

        /*
        await new Promise((resolve, reject) => {
            DB.conn.get("SELECT DEPTNO, DNAME, LOC  FROM DEPT WHERE DEPTNO = ?",[id],
                        (err, row) => {
                if (err)  return rejet(err);
                if (!row) return reject(new Error("not found:" + id));


                console.log("row: %d; %s; %s",row.DEPTNO,row.DNAME,row.LOC);
                
                ob1 = row;
                resolve(); 
            });
        });
        */
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});

/*
    $ curl -X POST -H "Content-Type: application/json" -d '{"DEPTNO":90,"DNAME":"ACTING","LOC":"LX"}' http://localhost:3000/db1
*/
router.post('/db1', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let bNew = ctx.request.body;
    let sql  = `INSERT INTO Dept (DEPTNO, DNAME, LOC ) VALUES ('${bNew.DEPTNO}','${bNew.DNAME}','${bNew.LOC}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = bNew; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});



router.get('/chart2', async (ctx) => {
    await ctx.render('chart2', {  time1: '2018-09-12 10:12:13', gname: 'Joe Chart' });
});

router.get('/hello', async (ctx) => {
    await ctx.render('hello', { messages: [ 'ola','olé','FIM'], username: 'Joe' });
});

router.get('/api/users', async (ctx) => {
    ctx.body = [
        {
          "email": "mary@google.com", 
          "id": 1, 
          "name": "Mary"
        }, 
        {
          "email": "joa@yahoo.com", 
          "id": 2, 
          "name": "Joana"
        }, 
        {
          "email": "joe.doe@sapo.pt", 
          "id": 3, 
          "name": "Joe"
        }, 
        {
          "email": "averel.doe@sapo.pt", 
          "id": 4, 
          "name": "Averel"
        }, 
        {
          "email": "john.doe@sapo.pt", 
          "id": 5, 
          "name": "John"
        }
      ];
});

router.post('/api/uppercase',async function(ctx) {
    const body = ctx.request.body;
    if (!body.name) 
        ctx.throw(400, '.name required');
    ctx.body = { name: body.name.toUpperCase() };
});

function genTok(user,pass) {
    let error = null;
    if (!user || user.length < 1)
        error = "Missing 'user'";
    if (!pass || pass.length < 1)
        error = "Missing 'pass'";
    if (!error) {
        let token = crypto.createHmac('sha256', pass).update(user).digest('hex');
        console.log("Generating Authorization Token for (%s:%s)=%s",user,pass,token);
        return { result: token };
    } else
        return { error: error};
}

router.post('/api/genRpcTok', function(ctx) {
    const body = ctx.request.body;
    ctx.body = genTok(body.user,body.pass);
});

// http://localhost:3000/api/genRpcTok?user=joe&pass=123
router.get('/api/genRpcTok', function(ctx) {
    ctx.body = genTok(ctx.request.query.user,ctx.request.query.pass);
});

router.get('/form1', async (ctx) => {
    await ctx.render('form1');
});

router.post('/form1', async (ctx) => {
    // console.log(ctx.request.body);
    const f  = ctx.request.body;
    const qrc = f.qrCode || '1234';
    const urlQR = 'https://chart.googleapis.com/chart?cht=qr&chs=177x177&chld=L%7C2&chl=' +  encodeURIComponent(qrc);
    console.log('QR url:',urlQR);
    await ctx.render('submitted_form1', { name: f.name, email: f.email, comments: f.comments, date1: f.date1, qrCode: qrc, QR: urlQR });
});



module.exports = router;

