const {page,expect} = require('@playwright/test');


class DragDropPage {

    constructor(page) {
        this.page = page;
        this.container = page.locator('.example-boundary');
        this.draggableBox = page.locator('#sample-box');
        this.draggedSuccess = page.locator('[style*="transform"]');
        this.draggableBox2 = page.locator('#draggable');
        this.droppableBox2 = page.locator('#droppable');
        this.dropedMsg = page.locator('#droppable > p');

        // sliders page
        this.sliderKnob = page.locator('#generate');
        this.wordLimit = page.locator('h1.subtitle.has-text-info');
        this.getCountriesBtn = page.locator('button.button.is-primary');
        this.countryList = page.locator('p.has-text-primary-light');

    }


    /* There are several option to drag&drop elements .But I found this one to be most reliable.
    First option is to use mouse.hover() & mouse.down /up combos but  couldnt get it to work here
    Second option is to use .dragTo method but also pretty much hit & miss shit
    And third one uses boundingBox..below
    Note that in this case Steps are mandatory for this to work
    */
        async dragBoxWithinBounds (page,src,dest) {
            // Get the bounding box of destination box
            const containerBox = await dest.boundingBox();
            if (!containerBox) throw new Error('Destination box not found');
            // box that will be actually dragged
            const box = await src.boundingBox();
            if (!box) throw new Error('Draggable box not found');
    
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {steps: 20}); // start at center of box that we will drag
            await page.mouse.down();
            await page.mouse.move(containerBox.x + containerBox.width / 2 , containerBox.y + containerBox.height / 2 , {steps: 20}); // Drag within boundaries
            await page.mouse.up();
        }

        //drag horizontal slider or any element down the x -axis randomly
        async dragX (page,slider) {
            const dragged = await slider.boundingBox();
            if (!dragged || isNaN(dragged.x) || isNaN(dragged.y)) {
                throw new Error('err: Dragged one invalid coordinates for dragging.', dragged.x , dragged.y);
            }

            const randOffset = Math.floor(Math.random() * (dragged.width - 170)) + 5;
            const startX = dragged.x + dragged.width /2;
            const startY = dragged.y + dragged.height /2;


            //await src.click()
            await page.mouse.move(startX , startY);
            await page.mouse.down();
            await page.mouse.move(startX + randOffset, dragged.y);
            await page.mouse.up();
        }


        //get the integer inside the inner string of elementa
        async getInteger (element) {
            const string = await element.textContent();
            const tmp = string.match(/\d+/);
            if (!tmp) {
                throw new Error('err: String does not contain any fecking integer');
            }
            let number;
            if (tmp) {
                number = parseInt(tmp[0], 10); // convert to decimal int
            } 
            else {
                console.log('No number found in the string.');
            }
            return number;
        }

}

export {DragDropPage};