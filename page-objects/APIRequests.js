const {expect, page} = require('@playwright/test');

class APIRequests {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://apichallenges.herokuapp.com';
    }

    async makePOST (url, body = {}, headers = {}) {
        // Create an API request context
        const apiContext = await request.newContext();
      
        try {
          // Perform the POST request
          const response = await apiContext.post(url, {
            headers: {
              'Content-Type': 'application/json', // Default header
              ...headers, // Merge with any custom headers
            },
            data: body, // Attach the body
          });
      
          // Parse the response based on content type
          const contentType = response.headers()['content-type'];
          const responseBody = contentType && contentType.includes('application/json')
            ? await response.json()
            : await response.text();
      
          // Return the response details
          return {
            status: response.status(),
            headers: response.headers(),
            body: responseBody,
          };
        } catch (error) {
          console.error('Error making POST request:', error);
          throw error; // Re-throw the error to handle it elsewhere
        } finally {
          // Dispose of the API context
          await apiContext.dispose();
        }
      }

    // universal get
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
   


}
export {APIRequests};
