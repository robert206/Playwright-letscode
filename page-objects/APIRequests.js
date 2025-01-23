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

        // GET
        const response = await request.get(url);
        //expect (response.status()).toBe(200);
    
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

    
    // Update booking PUT
    async updateBooking (request, endpoint, id, body) {
        const token = await this.getToken(request,'/auth');
        const URL = this.baseUrl + endpoint + id;
        //send PUT
        const response = await request.put(URL, {
            data: body,
            headers: { 'Content-Type': 'application/json', 'Cookie': `token=${token}` },
        });
        expect (response.status()).toBe(200);
        return response;     
    }

    
    // partial PATCH update
    async partialUpdateBooking (request, endpoint, id ,body) {
        const token = await this.getToken(request,'/auth');
        const URL = this.baseUrl + endpoint + id;
        //send PATCH
        const response = await request.patch(URL, {
            data: body,
            headers: { 'Content-Type': 'application/json', 'Cookie': `token=${token}` },
        });
        expect (response.status()).toBe(200);
        return response;
    }


    //DELETE booking (works only with Authorization header and not token)
    async deleteBooking (request, endpoint, id, authHash ) {
        //const authHash = 'Basic YWRtaW46cGFzc3dvcmQxMjM='; //
        const URL = this.baseUrl + endpoint + id;
        //send DELETE
        const response = await request.delete(URL, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `${authHash}` },
        });
        expect (response.status()).toBe(201);
        return response;
    }


}
export {APIRequests};
