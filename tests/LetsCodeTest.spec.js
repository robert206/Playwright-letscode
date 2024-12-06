// eslint-disable-next-line semi
const { strict } = require('assert');
//const {test,expect} = require('../fixture/PageObjectFixture');
import {test,expect} from '../fixture/PageObjectFixture';


test ('Input page', async ({page,homePage,inputPage}) => {
    //const expectedUrl = "https://letcode.in/edit";

    await expect(homePage.inputLink).toBeVisible();
    await homePage.inputLink.click();
    //await expect(page).toHaveURL(expectedUrl);
    //fill full name 
    await inputPage.fullName.click();
    await inputPage.fullName.fill("Robert Redford");

});