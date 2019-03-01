/*

https://mochajs.org/#asynchronous-code

mocha --reporters

mocha --reporter spec test\test2.js

*/

const expect = require('chai').expect;

async function add(a, b) {
    return Promise.resolve(a + b)
}

describe('Simple tests G2', function() {
    it('# call a promise func', async () => {
        let n = await add(2,3)
        expect(n).to.equal(5)
    })
    
    it('# 3 + 3 is 6', async function() {
        const p = await add(3, 3)
        expect(p).to.be.above(4) 
    })
})

