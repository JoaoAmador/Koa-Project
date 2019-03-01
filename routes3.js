const Router = require('koa-router');
const DB = require('./db');

const router = new Router();

router.prefix("/api");


router.get('/getTable', async (ctx) => {
    let ob1;
    try {
        let rows = await DB.GetRows("SELECT tipo,id,descricao from LOV");
        if (!rows) throw new Error("not found");
        ob1 = rows;
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});

router.get('/getPagesTable', async (ctx) => {
    let ob1;
    try {
        let rows = await DB.GetRows("SELECT tipo,id,campo as text,campo as value from HeadersTable");
        if (!rows) throw new Error("not found");
        ob1 = rows;
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});

router.get('/getContentTable', async (ctx) => {
    let ob1;
    try {
      // let rows = await DB.GetRows("SELECT tipo,id,campo, valores as text from HeadersTable WHERE tipo = ? AND campo = ?", ['produtos', 'Produto']);
      let rows = await DB.GetRows("SELECT tipo,id,campo, valores as text from HeadersTable");
        if (!rows) throw new Error("not found");
        ob1 = rows;
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});

router.get('/getTeste', async (ctx) => {
    let ob1;
    try {
      //  let rows = await DB.GetRows("SELECT tipo,id,campo, valores as text from HeadersTable WHERE tipo = ? AND campo = ?", ['produtos', 'Produto']);
      let rows = await DB.GetRows("SELECT tipo,id,campo, valores as text from Tabelas");
        if (!rows) throw new Error("not found");
        ob1 = rows;
    } catch (err) {
        console.log(err);
        ob1 = {
            status: 'error',
            message: 'Bad Query. ' + err
        };
    }
    ctx.body = ob1;
});



// Respostas

router.post('/primeiraResposta', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);
    
    let sql  = `INSERT INTO respostas (id, pagina1) VALUES ('${uniq}', '${bNew}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq};//dname: ctx.request.body.DNAME, deptno: 'newId' };
});

router.post('/primeiraRespostacomID', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);
   
   
    //let sql  = "UPDATE respostas SET pagina1 = ('${bNew}') WHERE id = ?, ['${uniq}']";
    let sql = `UPDATE respostas SET pagina1 = '${bNew}' WHERE id = '${uniq}'`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq};//{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});


router.post('/segundaResposta', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql  = `INSERT INTO respostas (id, pagina2) VALUES ('${uniq}', '${bNew}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
     ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});
   
router.post('/segundaRespostacomID', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql = `UPDATE respostas SET pagina2 = '${bNew}' WHERE id = '${uniq}'`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
     ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});

router.post('/terceiraResposta', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql  = `INSERT INTO respostas (id, pagina3) VALUES ('${uniq}', '${bNew}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
   ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});
   
router.post('/terceiraRespostacomID', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql = `UPDATE respostas SET pagina3 = '${bNew}' WHERE id = '${uniq}'`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
   ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});

router.post('/quartaResposta', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql  = `INSERT INTO respostas (id, pagina4) VALUES ('${uniq}', '${bNew}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});
   
router.post('/quartaRespostacomID', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql = `UPDATE respostas SET pagina4 = '${bNew}' WHERE id = '${uniq}'`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});

router.post('/quintaResposta', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql  = `INSERT INTO respostas (id, pagina5) VALUES ('${uniq}', '${bNew}')`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});
   
router.post('/quintaRespostacomID', async (ctx) => {
    console.log('create DEPT: %s' , JSON.stringify(ctx.request.body));
    let uniq = ctx.request.body.id;
    delete ctx.request.body.id; 
    let bNew = JSON.stringify(ctx.request.body);

    let sql = `UPDATE respostas SET pagina5 = '${bNew}' WHERE id = '${uniq}'`;
    try {
        let r = await DB.Exec(sql);
        if (r != null) console.log("Inserted new dept.");
    }  catch (err) {
        console.log(err);
    }
    ctx.body = {id: uniq}; //{ dname: ctx.request.body.DNAME, deptno: 'newId' };
});

module.exports = function (app) {
    app.use(router.routes());
    //app.use(router.allowedMethods());
};