const {expect} = require('@playwright/test');

class AlertsPage {
    constructor(page) {
        this.page = page;
        this.simpleAlert = page.locator('#accept');
        this.confirmAlert = page.locator('#confirm');
        this.promptAlert = page.locator('#prompt');
        this.modernAlert = page.locator('#modern');
    }

    async alertListener (page,action) {
        page.on('dialog', async (dialog) => {
            console.log(`Alert message: ${dialog.message()}`);
            console.log(`Alert type: ${dialog.type()}`);
            console.log(`Default Value: ${dialog.defaultValue()}`);
            if (action == "dismiss") {
                await dialog.dismiss();
            } 
            else {
                await dialog.accept();
            }
        });
    }
}

export {AlertsPage};