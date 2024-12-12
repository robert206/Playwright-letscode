const {expect} = require('@playwright/test');


class RadioPage {
    constructor(page) {
        this.page = page;
        this.firstGroup = page.locator('.control .radio [name="answer"]');
        this.secondGroup = page.locator('.control .radio [name="one"]');
        this.thirdGroup = page.locator('[name*="bug"]');
        this.fourthGroup = page.locator('label.radio [name="foobar"]');
        this.fifthGroup = page.locator(' input[type="radio"][name="plan"]')// one of them is disabled
        this.checkbox1 = page.locator('label.checkbox:has-text("Remember me") input[type="checkbox"]');
    }


    async iterateAll (grpRadio) {
        const count = await grpRadio.count();
        console.log('Group ' + grpRadio+ 'has ' + count + " radio btns");

        for (let i = 0; i < count; i++) { 
            await grpRadio.nth(i).click(); // Select each 
            await expect(grpRadio.nth(i)).toBeChecked();
            await this.onlyOneIsChecked(grpRadio);
        }
    }

    async onlyOneIsChecked (grpRadio) {
        let noOfChecked = 0;
        for (let i=0;i < await grpRadio.count();i++) {
            if ( await grpRadio.nth(i).isChecked() ) {
                noOfChecked++;
            }
        }
        //console.log('Checked:' + noOfChecked);
        expect(noOfChecked).toBe(1);
    }

    //traverses all radio btns from array of btns and checks if at least one is disabled
    async areThereDisabledRadioBtns (grpRadio) {
        let noOfDisabled = 0;
        for (let i=0; i < await grpRadio.count();i++) {
            let radioBtn = grpRadio.nth(i);
            if ( await radioBtn.isDisabled()) {
                noOfDisabled++;
                const labelText = await radioBtn.locator('..').innerText();
                console.log('Disabled btn: ' + labelText);
            }
        }
        expect(noOfDisabled).toBeGreaterThan(0)
    }

}

export {RadioPage};