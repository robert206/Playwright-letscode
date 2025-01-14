import users from '../data/users.json' assert { type: 'json' };
import { DropdownPage } from './DropdownPage';
import { expect } from '@playwright/test';

class FormPage {
    constructor(page) {
        this.page = page;
        this.gender = page.locator('label > [name="gender"]'); //list of radio gender btns
        this.firstName = page.locator('#firstname');
        this.lastName = page.locator('#lasttname');
        this.email = page.locator('#email');

        this.submitBtn = page.locator('[type="submit"]');
        this.countrySelectors = page.locator('div.select > select');
        this.phoneNr = page.locator('#Phno');
        this.address1 = page.locator('#Addl1');
        this.address2 = page.locator('#Addl2');
        this.state = page.locator('#state');
        this.postCode = page.locator('#postalcode');
        this.dob = page.locator('#Date'); //element of type "<input type="date" so the actual fill input that is send must be in ISO format
        this.tocAgree = page.locator('.checkbox input[type="checkbox"]');
    }

    async fillTextField (element, data) {
        await element.fill(data);
    }


    //fills form reading from json for user with index 'index'
    async fillForm(index) {
        const dPage = new DropdownPage(this.page);
        /* country dropdowns  */
        const countryCode = await this.countrySelectors.nth(0);
        const country = await this.countrySelectors.nth(1);
        await countryCode.waitFor({ state: 'visible' });
        await country.waitFor({ state: 'visible' });

        /* gender pick by value from json select the correct radio btn ,simplfied select */
        const sexJson = users[index].gender;
        switch(sexJson) {
            case "Male":
                await this.gender.nth(0).click();
                break;
            case "Female":
                await this.gender.nth(1).click();
                break;
            default:
                console.log("Unless you are true hermaphrodite you picked non-existent gender");
                break;
        }

        await this.fillTextField(this.firstName,users[index].name);
        await this.fillTextField(this.lastName,users[index].surname);
        await this.fillTextField(this.email,users[index].email); //add at the end of field
        await dPage.selectSingleOption(countryCode,users[index].countryCode,users[index].countryCode); //reuse the dropdown page function that selects and asserts expected value
        await this.fillTextField(this.phoneNr,users[index].phoneNr);
        await this.fillTextField(this.address1,users[index].address1);
        await this.fillTextField(this.address2,users[index].address2);
        await this.fillTextField(this.state,users[index].state);
        await this.fillTextField(this.postCode,users[index].postCode);
        await dPage.selectSingleOption(country,users[index].country,users[index].country);
        /* element of type "<input type="date" meaning the fill must send in ISO format 
        YYYY-MM-DD actually and not in WYSIWUG, otherwise you get Malformed value error 
        */
        await this.fillTextField(this.dob,users[index].dob);  
        //toc
        await this.tocAgree.click();
        await expect(this.tocAgree).toBeChecked(); //toBeChecked assert can be used both on radio btns or checkboxes    
    }

    
}

export {FormPage};
