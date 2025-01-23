import template from '../data/template_booking.json';
const {expect} = require('@playwright/test');
const {faker } = require('@faker-js/faker'); // faker for faking realistic data in json bodies of requests
const fs = require('fs');



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


    /* get booking ids either 
    ** we request all if no params are given
    ** or string of params is passed (first,last name, id ..)
    */
    async getBookingIds (request, endpoint, queryParams = {}) {
        // Create the query string from the queryParams object
        const queryString = new URLSearchParams(queryParams).toString(); 
        const url = queryString ? `${this.baseUrl + endpoint }?${queryString}` : this.baseUrl + endpoint;
        console.log("Get request on following url :" + url );

        // GET
        const response = await request.get(url);
        expect (response.status()).toBe(200);
    
        return response;
    }


    //generates body of booking request using faker
    async generateBookingBody () {
        const body = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            totalprice: faker.number.int({ min: 100, max: 1000 }),
            depositpaid: faker.datatype.boolean(),
            bookingdates: {
                checkin: faker.date.future(1).toISOString().split('T')[0],
                checkout: faker.date.future(2.10).toISOString().split('T')[0],
            },
            additionalneeds: faker.commerce.productName(),
        };
        return body;
    }


    // POST request with generated data body  usingfaker 
    async createBooking (request, endpoint, body) {
        const URL = this.baseUrl + endpoint;      
          
        // Send POST request
        const response = await request.post(URL, {
            data: body,
            headers: { 'Content-Type': 'application/json' },
        });
        expect (response.status()).toBe(200);
      
        const responseBody = await response.json();

        //write it to file just for because i can :) and perhaps maybe ill use it later to assert using that file
        try {
            fs.appendFileSync('./data/generated_Bookings.json', JSON.stringify(responseBody,null,2) + ', \n', 'utf8');
          } catch (err) {
            console.error('Failed to append to file:', err);
          }
      
        return responseBody;
    }

    
    // Update booking
    async updateBooking (request, endpoint, id, body) {
        const token = await this.getToken(request,'/auth');
        const URL = this.baseUrl + endpoint + id;
        //send PUT
        const response = await request.put(URL, {
            data: body,
            headers: { 'Content-Type': 'application/json', 'Cookie': `token=${token}` },
        });
        return response;     
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
