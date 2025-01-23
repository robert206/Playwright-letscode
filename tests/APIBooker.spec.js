const {test,expect,request} = require('../fixture/PageObjectFixture');
const { faker } = require('@faker-js/faker'); // faker for faking all kinds of data



//scratch this
test ('Get challenges', async ({request, apiRequests}) => {
    let response  = await apiRequests.getRequest(request,'/challenges');
    //assert that header x-challenger was accepted correctly
    expect (response.headers()['x-challenger']).not.toContain('UNKNOWN CHALLENGER');
    const body = await response.json();
    console.log(body);
    expect (body.challenges.length).toBeGreaterThan(58);
    expect (body).toHaveProperty('challenges'); 
    
});


test('Get Bookings', async ({request, apiRequests }) => {
    const token = await apiRequests.getToken(request,'/auth');

    //get bookings id's based on params
    let resp = await apiRequests.getBookingIds (request,'/booking', { firstname: 'Susan', lastname: 'Wilson'});
    // assert headers returned in request
    let contentLength = resp.headers()['content-length'];
    expect(contentLength).toBeDefined();
    expect(Number(contentLength)).not.toBe(0);
  
  });

// get all booking byids level 
  test('Get Bookings by Ids', async ({request, apiRequests }) => {
    //get ALL bookings 
    let resp = await apiRequests.getBookingIds (request, '/booking');
    const idS = await resp.json();
    expect(Array.isArray(idS)).toBeTruthy();
    expect (await idS.length).toBeGreaterThan(0);// assert array length  
    
    const rIndex = Math.floor(Math.random() * idS.length) + 1;
    //get random Booking from response
    let id = idS[rIndex].bookingid;
    // endpoint is actually like /booking/24 (index number of ids)
    resp = await apiRequests.getBookingIds (request,'/booking/' + `${id}`);
    const booking = await resp.json();
    
    //lets assert some of those values ,check if they are not empty
    expect (booking.firstname).toBeTruthy();
    expect (booking.lastname).toBeTruthy();
    expect (booking.totalprice).toBeTruthy();
    expect (booking.bookingdates).toBeTruthy();
  });


  // Create booking 
  test('Create booking using faker and check if data received is correct', async ({request, apiRequests }) => {
    const reqBody = await apiRequests.generateBookingBody();

    //creates booking and saves response into file
    const resp = await apiRequests.createBooking (request,'/booking',reqBody);

    //example of simply asserting values received in json directly
    expect (resp.bookingid).toBeTruthy();
    expect (resp.booking.firstname).toBe(reqBody.firstname);
    expect (resp.booking.lastname).toBe(reqBody.lastname);
    expect (resp.booking.totalprice).toBe(reqBody.totalprice);
    expect (resp.booking.bookingdates.checkin).toBe(reqBody.bookingdates.checkin);
    expect (resp.booking.bookingdates.checkout).toBe(reqBody.bookingdates.checkout);
    expect (resp.booking.additionalneeds).toBe(reqBody.additionalneeds);
  });


  test('Update booking', async ({request, apiRequests }) => {
    // create a booking and get its ID
    let bodyPost = await apiRequests.generateBookingBody();
    const response = await apiRequests.createBooking (request,'/booking',bodyPost);
    const id = response.bookingid;
    console.log("Update booking :");
    console.log("-------------------");
    console.log("id of updated booking: " + id);

    // //get token that is needed for 
    // const token = await apiRequests.getToken(request,'/auth');

    // //update booking
    const bodyPut = await apiRequests.generateBookingBody();
    console.log("Updated with body :");
    console.log(bodyPut);
    const respUpdate = await apiRequests.updateBooking(request,'/booking/',id,bodyPut);
    //console.log(await respUpdate.json());
    
  });




