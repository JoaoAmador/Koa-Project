/*

see: https://github.com/mapbox/node-sqlite3
     https://github.com/mapbox/node-sqlite3/wiki/API

*/
const DB = {

    conn: null,

    Start:  function(dbfile){
        try {
            console.log('Connecting to DB  ' + dbfile);
            const sqlite3 = require("sqlite3").verbose();
            this.conn = new sqlite3.Database(dbfile);  // new sqlite3.Database('./db/chinook.db', sqlite3.OPEN_READWRITE, (err) => {...
        } catch(err) {
            console.error(err);
            return false;
        }
        return true;
    },

    Terminate: function(){
        if (this.conn) 
            this.conn.close( (err) => err && console.error(err));
    },

    GetRow: function(sql, params) {
        if (params === undefined) params=[];
        let dbCon = this.conn;
        return new Promise(function(resolve, reject) {
            dbCon.get(sql, params, function(err, row)  {
                if(err) {
                    console.log("Query error: " + err.message);
                    reject(err);
                }
                else 
                    resolve(row);
                
            });
        });
    },

    GetRows: function(sql, params) {
        if (params === undefined) params=[];
        let dbCon = this.conn;
        return new Promise(function(resolve, reject) {
            dbCon.all(sql, params, function(err, rows)  {
                if (err) {
                    console.log("Query error: " + err.message);
                    reject(err);
                }
                else 
                    resolve(rows);
                
            });
        });
    },


    Exec: function(sql, params) {
        if (params === undefined) params=[];
        let dbCon = this.conn;
        return new Promise(function(resolve, reject) {
            dbCon.run(sql, params, function(err)  {
                if(err) {
                    console.log("Exec error: " + err.message);
                    reject(err);
                }
                else 
                    resolve(true);
                
            });
        });
    }
};

module.exports = DB;
