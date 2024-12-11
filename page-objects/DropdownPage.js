const {expect} = require('@playwright/test');

class DropdownPage {

    constructor(page) {
        this.page = page;
        this.fruits = page.locator('#fruits');
        this.superHeroes = page.locator('#superheros'); // multiselect possible
        this.lang = page.locator('#lang');
        this.countries = page.locator('#country');
    }

    async multiSelectOption (selector,options) {
        await selector.selectOption(options);
    }

    //select dropdown element based on option that can be string or index
    async selectSingleOption (dropdown,option,expectedValue) {
        await dropdown.waitFor(); //wait if field is dynamic probably boljse da vedno to das za ziher

        if (typeof option === 'number' && Number.isInteger(option)) {
            // Select option by index
            await dropdown.selectOption({ index: option });
        } 
        else if (typeof option === 'string') {
            // Select option by string (label)
            await dropdown.selectOption(option);
        } 

        //assert
        const selectedValueText = await dropdown.locator('option:checked').textContent(); //save selected text
        expect(selectedValueText).toBe(expectedValue);
    }


}

export {DropdownPage};