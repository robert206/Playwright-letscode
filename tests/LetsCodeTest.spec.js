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


test ('Dropdowns page', async ({page,homePage,dropdownPage}) => {
    await homePage.dropdownsLink.click();
    await expect(page).toHaveURL('https://letcode.in/dropdowns');

    //dropdown fruits
    await dropdownPage.selectSingleOption(dropdownPage.fruits,1,'Apple');
    //select multiple options
    const heroes = ['Ant-Man', 'Hellboy', 'Marvelman'];
    await dropdownPage.multiSelectOption(dropdownPage.superHeroes,heroes);
    //verify that all were selected
    const selectedHeroes = await dropdownPage.superHeroes.locator('option:checked').allTextContents();
    expect(selectedHeroes).toEqual(heroes);

    //select last option and print all options
    const lastOptionValue = await dropdownPage.lang.locator('option').nth(-1).getAttribute('value');
    //await dropdown.selectOption(lastOptionValue);
    await dropdownPage.lang.selectOption(lastOptionValue)
    const lastOptionText = await dropdownPage.lang.locator('option:checked').textContent()
    expect(lastOptionText).toBe('C#');
    const options = await dropdownPage.lang.locator('option').allInnerTexts();// get all options of dropdown
    console.log(options);
  
});


test ('Frame page', async ({page,homePage,framePage}) => {
    console.log('Executing tests for Frame page');
    console.log('**********************************');
    await homePage.frameLink.click();
    await expect(page).toHaveURL('https://letcode.in/frame');
    await framePage.firstName.click();
    await framePage.firstName.fill('Robert');
    await framePage.lastName.click();
    await framePage.lastName.fill('Leskovsek');
    const text =  await framePage.label.textContent();
    expect(text).toBe('You have entered Robert Leskovsek');
    console.log(text);

    //email field is inside the child frame, 2nd frame to be exact
    //also notice the page.frame function ..so a diff način to find frames
    const email = 'robert.drek@drek.net';
    await framePage.writeEmail(page,email);
    
});

//diff types of alerts
test ('Simple Alert', async ({page,homePage,alertsPage}) => {
    await homePage.alertsLink.click();
    await expect(page).toHaveURL('https://letcode.in/alert');

    //notice diff order of steps , first we do listener for events and then actual click on btn that triggers alert
    console.log("Simple Alert");
    console.log("------------------------------");
    await alertsPage.alertListener(page,'accept',''); //function takes either "dismiss" or accept"
    await alertsPage.simpleAlert.click();
});

//confirm alert
test ('Confirm Alert', async ({page,homePage,alertsPage}) => {
    await homePage.alertsLink.click();
    await expect(page).toHaveURL('https://letcode.in/alert');

    //notice diff order of steps , first we do listener for events and then actual click on btn that triggers alert
    console.log("Confirm Alert");
    console.log("------------------------------");
    await alertsPage.alertListener(page,'dismiss',''); //function takes either "dismiss" or accept"
    await alertsPage.confirmAlert.click();
});

//prompt alert
test ('Prompt Alert', async ({page,homePage,alertsPage}) => {
    await homePage.alertsLink.click();
    await expect(page).toHaveURL('https://letcode.in/alert');

    //notice diff order of steps , first we do listener for events and then actual click on btn that triggers alert
    console.log("Prompt Alert");
    console.log("------------------------------");
    await alertsPage.alertListener(page,'accept','Robert'); //function takes either "dismiss" or accept"
    await alertsPage.promptAlert.click();
});


test ('Modern Alert', async ({page,homePage,alertsPage}) => {
    await homePage.alertsLink.click();
    await expect(page).toHaveURL('https://letcode.in/alert');

    //notice diff order of steps , first we do listener for events and then actual click on btn that triggers alert
    console.log("Modern Alert");
    console.log("------------------------------");
    await alertsPage.modernAlert.click();
    await expect(alertsPage.modernAlertMsg).toBeVisible();
    await alertsPage.closeModernAlert.click();
});


//radio btns
test ('Radio Buttons demo', async ({page,homePage,radioPage}) => {
    await homePage.radioLink.click();
    await expect(page).toHaveURL('https://letcode.in/radio');

    /* iterate through groups of radio btn options 
    and check that at any given time only one from the group is selected..
    using some functions i wrote in RadioPage class */
    await radioPage.iterateAll(radioPage.firstGroup);
    await radioPage.iterateAll(radioPage.secondGroup);
    
    //this one will always fail as both are selected -bug
    //await radioPage.iterateAll(radioPage.thirdGroup);

    //find one that is already checked on page
    for (let i= 0;i < await radioPage.fourthGroup.count();i++) {
        let radioButton = await radioPage.fourthGroup.nth(i);
        if (await radioButton.isChecked()) {
            let label = await radioButton.locator('..'); // Get the parent label
            let text = await label.innerText(); // Extract text
            console.log('Selected button is: '+ text);
            break;
        }
    }

    //find disabled button
    await radioPage.areThereDisabledRadioBtns(radioPage.fifthGroup);
    //is checkbox checked 
    const isChecked = await radioPage.checkbox1.isChecked();
    expect(isChecked).toBeTruthy();
});


test ('Elements page github', async ({page,homePage,elementsPage}) => {
    await homePage.elementsLink.click();
    await expect(page).toHaveURL('https://letcode.in/elements');

    await elementsPage.usernameField.fill('Robert206');
    await elementsPage.searchBtn.click();
    //assert if number of public repos is correct
    await elementsPage.checkProfileLabelCount(0,5);
    //assert public gist
    await elementsPage.checkProfileLabelCount(1,0);
    //assert followers
    await elementsPage.checkProfileLabelCount(2,0);

    //wait for repos to load -custom function
    await elementsPage.waitForRepos(page);    
    expect(await elementsPage.reposList.count()).toBeGreaterThan(0);

    //just list them for fun sake
    const repos = await elementsPage.getAllRepos();
    console.log(repos);

    /*
    click on each repo link and verify that it is opened in new tab
    also verifies if new tab title vsebuje correct link name
    */
    for (const repo of repos) {
        await elementsPage.verifyLinkOpensInNewTab(page,repo);
    }

});

//Drag and drop
test ('Drag And Drop', async ({page,homePage,dragDropPage}) => {
    await homePage.dragDropLink.click();
    await expect(page).toHaveURL('https://letcode.in/draggable');

    await dragDropPage.dragBoxWithinBoundaries();

    // Optionally verify the box's final position is within the container
    const box = await dragDropPage.draggableBox.boundingBox();
    const container = await dragDropPage.container.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(container.x);
    expect(box.y).toBeGreaterThanOrEqual(container.y);
    expect(box.x + box.width).toBeLessThanOrEqual(container.x + container.width);
    expect(box.y + box.height).toBeLessThanOrEqual(container.y + container.height);

});

