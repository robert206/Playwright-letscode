const {page,expect} = require('@playwright/test');

class ElementsPage {
    constructor(page) {
        this.page = page;
        this.usernameField = page.locator('[name="username"]');
        this.searchBtn = page.locator('#search');
        this.reposList = page.locator('app-gitrepos div ol li');
    }

    async waitForRepos(page) {
        await page.waitForSelector("app-gitrepos div ol li",{ timeout: 5000 });
    }

    async listAllRepos() {
        let links = [];
        for (let i=0;i < await this.reposList.count();i++) {
            links[i] = await this.reposList.nth(i).innerText();
        }
        return links;
    }

    async verifyLinkOpensInNewTab(expectedURLPart, expectedTitle) {
        // Listen for a new tab (popup) and click the link
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'), // Wait for the new tab
            this.link.click(), // Click the link
        ]);

        // Ensure the new tab is opened
        if (!newTab) {
            throw new Error('No new tab was opened!');
        }

        // Wait for the new tab to load
        await newTab.waitForLoadState();

        // Validate the new tab's URL
        const newTabURL = newTab.url();
        console.log('New Tab URL:', newTabURL);
        if (!newTabURL.includes(expectedURLPart)) {
            throw new Error(`New tab URL does not contain expected part: ${expectedURLPart}`);
        }

        // Validate the new tab's title
        const title = await newTab.title();
        console.log('New Tab Title:', title);
        if (title !== expectedTitle) {
            throw new Error(`New tab title does not match expected title: ${expectedTitle}`);
        }

        console.log('New tab verification successful!');
    }



}
export {ElementsPage};