const {expect,request} = require('@playwright/test');

class APIRequests {
    constructor (baseUrl) {
        this.baseUrl = 'https://restful-booker.herokuapp.com';
    }

    // get booking token needed for PUT and DELETE requests
    async getToken (request, endpoint) {
      const URL = this.baseUrl + endpoint;

      const response = await request.post(URL, {
        data: {
          "username" : "admin",
          "password" : "password123"
      },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect (response.status()).toBe(200);
      const respBody = await response.json();
      const token = respBody.token; // return token from body with key "token"
  
      return token;
    }


   /*  // universal get for some other site
    async getRequest (request, endpoint) {
        const URL = this.baseUrl + endpoint;
        const ch = await this.getChallengeToken (request);

        let head = {'X-Challenger': `${ch}`}; // set header X-Challenge
        let response = await request.get(URL,{'headers' : head});

        expect (response.status()).toBe(200);

        return response;
    } 


    //this x-challengerhash is required for all consecutive request-generated one is saved for 10min but we will request it everytime
    async getChallengeToken (request) {
        const URI = "https://apichallenges.herokuapp.com/challenger";
        const response =  await request.post(URI);
        const challenge = response.headers()['x-challenger'];
        if (response.status() !== 201) {
            throw new Error('Challenger header retrieval error.');
        }
        return challenge;
    }
    */


}
export {APIRequests};
