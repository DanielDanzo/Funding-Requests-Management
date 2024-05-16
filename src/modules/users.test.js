const getUser  = require('./math.js');
// const { describe, it, test, expect}  = require("jest");


describe('User retrieval test', ()=>{
    it('Should return correct user email',()=>{
        const email = 'sempapadaniel123@gmail.com';
        const userEmail = getUser().Email;
        expect(userEmail).tobe(email);
    });
});