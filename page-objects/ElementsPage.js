const {page,expect} = require('@playwright/test');

class ElementsPage {
    constructor(page) {
        this.page = page;
        this.usernameField = page.locator('[name="username"]');
        this.searchBtn = page.locator('#search');
        this.reposList = page.locator('app-gitrepos div ol li'); //repo array
        this.profileTags = page.locator('.tag.is-info');
    }

    async waitForRepos(page) {
        await page.waitForSelector("app-gitrepos div ol li",{ timeout: 5000 });
    }

    async getAllRepos() {
        let links = [];
        for (let i=0;i < await this.reposList.count();i++) {
            links[i] = await this.reposList.nth(i).innerText();
        }
        return links;
    }

    async checkProfileLabelCount(index,expectedCount) {
        const actualCount = await this.profileTags.nth(index).innerText();
        expect(expectedCount.toString()).toEqual(actualCount);
    }


    async verifyLinkOpensInNewTab(page,repoUrl) {
        //listen for a new tab pop-up and click link
        const loc = '[href="' + repoUrl + '"]';
        const [newTab] = await Promise.all([
            page.context().waitForEvent('page'), // Wait for the new tab
            page.locator(loc).click(),
        ]);

        //check if new tab was opened
        if (!newTab) {
            throw new Error('No new tab was opened!');
        }
        //wait for tab to load completely
        await newTab.waitForLoadState();
        //console.log("new tab : ", newTab.url());

        //check if url matches with expected url
        expect(newTab.url()).toBe(repoUrl);
        //check if page title contains usrname + repo name
        const title = await newTab.title();
        let partialTitle = repoUrl.split('https://github.com/')[1];
        expect(title).toContain(partialTitle);
    }


}
export {ElementsPage};