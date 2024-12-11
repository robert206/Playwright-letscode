const {page,expect} = require('@playwright/test');

class FramePage {
    constructor(page) {
        this.page = page;
        this.firstName = page.frameLocator('iframe[name="firstFr"]').locator('input[name="fname"]')
        this.lastName = page.frameLocator('iframe[name="firstFr"]').locator('input[name="lname"]');
        this.label = page.frameLocator('iframe[name="firstFr"]').locator('.title.has-text-info');
    }

    async writeEmail(page,emailString) {
        const childFr = page.frame( {name : "firstFr"}).childFrames();
        console.log("View has " + childFr.length + " frames");
        await childFr[1].locator("input[name='email']").fill(emailString);
        const emailEntered = await childFr[1].locator("input[name='email']").inputValue();
        expect (emailString).toBe(emailEntered);
    }



}
export {FramePage};
