// eslint-disable-next-line semi

const {test,expect} = require('../fixture/PageObjectFixture');
//import {test,expect} from '../fixture/PageObjectFixture';


test ('Input page', async ({page,homePage,inputPage}) => {
    const expectedUrl = "https://letcode.in/edit";

    await expect(homePage.inputLink).toBeVisible();
    await homePage.inputLink.click();
    await expect(page).toHaveURL(expectedUrl);
    //fill full name 
    await inputPage.fullName.click();
    await inputPage.fullName.fill("Robert Redford");
    //check if entered full name value is korekto 
    await expect(inputPage.fullName).toHaveValue('Robert Redford');
    //append to existing text in field
    await inputPage.joinInputField.click();
    await inputPage.joinInputField.type(" is old and full of freckless");
    await expect(inputPage.joinInputField).toHaveValue("I am good is old and full of freckless");
    
    //assert that field has value
    await expect(inputPage.getContent).toHaveValue('ortonikc');
    //clear field 
    await inputPage.clearField.fill('');
    await expect(inputPage.clearField).toHaveValue('');
    //disabled field
    await expect(page.locator('#noEdit')).toBeDisabled();
    //read only field-check attribute value
    await expect(inputPage.readOnlyField).toHaveAttribute('readonly', '');

});


test ('Buttons page', async ({page,homePage,buttonsPage}) => {
    await homePage.buttonsLink.click();
    //go home and back 
    await buttonsPage.homeBtn.click();
    const expectedUrl = 'https://letcode.in/';
    await expect(page).toHaveURL(expectedUrl);
    await page.goBack({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL('https://letcode.in/buttons');
    //get buttons x,y ,width and height demo
    await buttonsPage.getButtonCoordinates();
   
    //get color of button which is not in dom 
    const color = await buttonsPage.colorBtn.evaluate((element) => {
        return getComputedStyle(element).backgroundColor; // Get the text color
    });
    console.log(`Button's text color is: ${color}`);

    //disable btn check 
    await expect(buttonsPage.disabledBtn).toBeDisabled();

    //hold btn to change state
    await buttonsPage.clickAndHoldBtn(page);
});



