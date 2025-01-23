
const {test,expect} = require('../fixture/PageObjectFixture');
import users from '../data/users.json' assert { type: 'json' };


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

    console.log("Radio Buttons demo");
    console.log("------------------------------")

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

    //drag one box inside the other box
    await dragDropPage.dragBoxWithinBounds(page, dragDropPage.draggableBox, dragDropPage.container);
    const dragged = await dragDropPage.draggedSuccess;
    expect (dragged).toBeVisible();

    //multiselect using Ctrl + click in options with specified index
    await page.goto('https://letcode.in/selectable');
    const allOptions = await page.locator('#selectable');
    await page.keyboard.down('Control');

    for(const i of [0,1,3,5]) {
        await allOptions.nth(i).click();
    }

    await page.keyboard.up('Control');
    //check
   
});



test ('Slideeerrs', async ({page,homePage,dragDropPage}) => {
    await homePage.sliderLink.click();
    await expect(page).toHaveURL('https://letcode.in/slider');

    console.log("Slider Demo ");
    console.log("------------------------------")
    //counts before moving slider
    const beforeCount = await dragDropPage.getInteger(dragDropPage.wordLimit);
    //slider is moved randomly
    await dragDropPage.dragX(page,dragDropPage.sliderKnob);
    const afterCount = await dragDropPage.getInteger(dragDropPage.wordLimit); //slider value after random move

    //if slider is moved word limit number is bigger then at start
    expect(beforeCount).toBeLessThan(afterCount);

    /* click on get countries 
    and check the list of countries returned
    compare it with upper label of word limit integer returned */
    await dragDropPage.getCountriesBtn.click();
    const countries = await dragDropPage.countryList.textContent();
    const countryCount = countries.split(" - ").length;
    expect(countryCount).toBe(afterCount); //should be the same
});



//various tables manipulation
test ('Tables', async ({page,homePage,tablePage}) => {
    await homePage.tableLink.click();
    await expect(page).toHaveURL('https://letcode.in/table');

    console.log("Tables demo");
    console.log("------------------------------")

    // texts retrieved for all item prices in last column and converted to Integer
    const items = await tablePage.shoppingTablePrices;
    const totalOfItems = await tablePage.innerTextToSum(items);
    console.log('Total of all items in column calculated', totalOfItems);

    //same here but for Total sum at bottom 
    const totalDisplayed = await tablePage.shoppingTotal;
    const totalShop = await tablePage.innerTextToSum(totalDisplayed);
    console.log('Total displayed in last row:', totalShop);

    //both compared if are the same
    expect (totalOfItems).toBe(totalShop);

    /* 
    Sorting of all columns asc/desc 
    and checking if sorting works correctly by sorting programatically and comparing with table sort
    */
    const sortableHeaders = await tablePage.sortableHeaders;
    const table = await tablePage.sortTable;

    await tablePage.sortAllColumns(sortableHeaders,table);
});


test ('Forms page', async ({page,homePage,formPage}) => {
    await homePage.formsLink.click();
    await expect(page).toHaveURL('https://letcode.in/forms');
    console.log("Form with a lot of stuff :)");
    console.log("------------------------------");
    await formPage.fillForm(1);
    await formPage.submitBtn.click();
    
});


test ('Download and upload of files', async ({page,homePage,downloadPage}) => {
    await homePage.downloadLink.click();
    await expect(page).toHaveURL('https://letcode.in/file');

    await downloadPage.uploadBtn.click();
    //bypasses native file picker which cannot be used in context of playwright
    await page.setInputFiles('input[type="file"]', './data/getLogs.sh');
    await downloadPage.downloadFiles(page, downloadPage.xlsBtn,'../s1.xlsx');
    await downloadPage.downloadFiles(page, downloadPage.pdfBtn,'../s2.pdf');

    
});

