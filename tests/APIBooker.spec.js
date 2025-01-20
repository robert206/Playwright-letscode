const {test,expect} = require('../fixture/PageObjectFixture');


//scratch this
test ('Get challenges', async ({request,apiRequests}) => {
    let response  = await apiRequests.getRequest(request,'/challenges');
    //assert that header x-challenger was accepted correctly
    expect (response.headers()['x-challenger']).not.toContain('UNKNOWN CHALLENGER');
    const body = await response.json();
    console.log(body);
    expect (body.challenges.length).toBeGreaterThan(58);
    expect (body).toHaveProperty('challenges'); 
    
});


test ('POST', async ({request,apiRequests}) => {
    let response  = await apiRequests.getRequest(request,'/challenges');
    //assert that header x-challenger was accepted correctly
    expect (response.headers()['x-challenger']).not.toContain('UNKNOWN CHALLENGER');
    const body = await response.json();
    console.log(body);
    expect (body.challenges.length).toBeGreaterThan(58);
    expect (body).toHaveProperty('challenges'); 
    
});