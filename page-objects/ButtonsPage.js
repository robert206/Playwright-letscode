const {expect} = require('@playwright/test');

class ButtonsPage {
    constructor(page) {
        this.page = page;
        this.homeBtn = page.locator('#home');
        this.locationBtn = page.locator('#position');
        this.colorBtn = page.locator('#color');
        this.widthHeightBtn = page.locator('#property');
        this.disabledBtn = page.locator('button.button.is-info');
        //this.holdBtn = page.locator('button.button.is-primary:has-text("Button Hold!")'); // hard one to make unique so lets dajmo v funkcijo
        
    } 

    async clickAndHoldBtn (page) {
        const beforeBtn= page.locator('button.button.is-primary:has-text("Button Hold!")');
        await beforeBtn.click(); //additional click so page scrolls down and btn is in view 
        const boundingBox = await beforeBtn.boundingBox();

        if (boundingBox) {
            await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
            await page.mouse.down(); // click down
            await page.waitForTimeout(3000); // Hold pressed for 2 seconds 
            await page.mouse.up(); // spusti
        }
        //check if now label has changed or on this case new unique element with text
        const afterBtn = page.locator('button.button.is-primary:has-text("Button has been long pressed")');
        await expect(afterBtn).toBeVisible();
    }

    async getButtonCoordinates() {
        const boundingBox = await this.locationBtn.boundingBox();
        if (boundingBox) {
            const { x, y, width, height} = boundingBox;
            console.log(`Button's coordinates are: x = ${x}, y = ${y}`);
            console.log(`Button's width and height are: width = ${width}, height = ${height}`);
        } 
        else {
            console.log('Button not found or not visible.');
        }
    }

}

export {ButtonsPage};