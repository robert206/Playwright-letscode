const {page,expect} = require('@playwright/test');


class DragDropPage {

    constructor(page) {
        this.page = page;
        this.container = page.locator('.example-boundary');
        this.draggableBox = page.locator('#sample-box');
    }

    async dragBoxWithinBoundaries() {
        // Get the bounding box of the container
        const containerBox = await this.container.boundingBox();
        if (!containerBox) throw new Error('Container not found');

        // Get the bounding box of the draggable box
        const box = await this.draggableBox.boundingBox();
        if (!box) throw new Error('Draggable box not found');

        // Calculate the target position to drag
        const targetX = Math.min(
            Math.max(box.x, containerBox.x), 
            containerBox.x + containerBox.width - box.width
        );
        const targetY = Math.min(
            Math.max(box.y, containerBox.y), 
            containerBox.y + containerBox.height - box.height
        );

        // Drag the box to the target position
        await this.page.mouse.down();
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); // Start at the box center
        //await this.page.mouse.down();
        await this.page.mouse.move(targetX + box.width / 2, targetY + box.height / 2); // Drag within boundaries
        await this.page.mouse.up();
    }

}

export {DragDropPage};