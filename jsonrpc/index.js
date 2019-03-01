/*
see: https://github.com/Bitclimb/koa-jsonrpc

https://www.jsonrpc.org/specification

id
    An identifier established by the Client that MUST contain a String, Number, or NULL value if included. 
    If it is not included it is assumed to be a notification. The value SHOULD normally not be Null
    and Numbers SHOULD NOT contain fractional parts

params
    A Structured value that holds the parameter values to be used during the invocation of the method. 
    This member MAY be omitted. 

*/

const jsonResp = require('./RpcResponse');
const jsonError = require('./RpcError');
const crypto = require('crypto');
const InvalidParamsError = require('./RpcInvalidError');
const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

class koaJsonRpc {
  constructor (opts) {
    this.limit = '1mb';
    this.registry = Object.create(null);
    if (opts) {
      this.limit = opts.limit || this.limit;
      this.auth = opts.auth;
    }
    if (this.auth && (!hasOwnProperty(this.auth, 'username') || !hasOwnProperty(this.auth, 'password'))) {
      throw new Error('Invalid options parameters!');
    }
    if (this.auth) {
      this.token = crypto.createHmac('sha256', this.auth.password).update(this.auth.username).digest('hex');
      console.log("Using JSON-RPC Authorization: Token %s",this.token);
    }
  }
  use (name, func) {
    this.registry[name] = func;
  }
  
  async handle (body,hdrAuth) {
      let result;
      
      if (this.token) {
        /*
        In the Client do:
        const token = crypto.createHmac('sha256', 'mypass').update('myuser').digest('hex');
        req.setHeader('Authorization', `Token ${HexStringToken}`)

        ex:
        $ curl -X POST -H "Content-Type:application/json"  -d '{ "jsonrpc": "2.0", \
          "id": 123,"method":"sum","params":[4,5,6] }' \
           -H "Authorization: Token a0b47cfe0ae50bc538d9555ea0ca468a6c0437a7c2724ac3c69c5624d0a91a8e" \
            http://localhost:3000/jrpc -i
        */
        const headerToken = hdrAuth.split(' ').pop();  // const headerToken = ctx.get('authorization').split(' ').pop();
        if (headerToken !== this.token) {
          return jsonResp(null, jsonError.Unauthorized());
        }
      }
      
      if (!hasOwnProperty(body, 'jsonrpc'))
        return jsonResp(null, jsonError.ParseError());
      
      /*
      const parse = require('co-body');
      try {
        body = await parse.json(ctx, { limit: this.limit });
      } catch (err) {
        const errBody = jsonResp(null, jsonError.ParseError());
        ctx.body = errBody;
        return;
      }
      */

      if (body.jsonrpc !== '2.0' || !hasOwnProperty(body, 'method') || !hasOwnProperty(body, 'id') ) {
        return jsonResp(body.id || null, jsonError.InvalidRequest());
      }
      if (!this.registry[body.method]) {
        return jsonResp(body.id, jsonError.MethodNotFound());
      }
      try {
        result = await this.registry[body.method](body.params);

      } catch (e) {
        if (e instanceof InvalidParamsError) {
          return jsonResp(body.id, jsonError.InvalidParams(e.message));
        }
        console.log('jsonError.InternalError:',e);
        return  jsonResp(body.id, jsonError.InternalError(e));
      }
      return jsonResp(body.id, null, result);
  };

}

module.exports = (...args) => new koaJsonRpc(...args);

module.exports.InvalidParamsError = InvalidParamsError;
