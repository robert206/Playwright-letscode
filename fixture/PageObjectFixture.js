import { test as base } from '@playwright/test';

import { HomePage } from '../page-objects/HomePage.js';
import { InputPage } from '../page-objects/InputPage.js';
import { ButtonsPage } from '../page-objects/ButtonsPage.js';
import { DropdownPage} from '../page-objects/DropdownPage.js';
import { FramePage } from '../page-objects/FramePage.js';
import { AlertsPage } from '../page-objects/AlertsPage.js';
import { RadioPage } from '../page-objects/RadioPage.js';
import { ElementsPage } from '../page-objects/ElementsPage.js';
import { DragDropPage } from '../page-objects/DragDropPage.js';
import { TablePage } from '../page-objects/TablePage.js';
import { FormPage } from '../page-objects/FormPage.js';
import { DownloadPage } from '../page-objects/DownloadPage.js';
import { APIRequests } from '../page-objects/APIRequests.js';

//page.goto appends to existing baseUrl set in playwright.config.js
export const test = base.extend({
     homePage: async ({ page }, use) => {
        await page.goto('/test');
        await use(new HomePage(page));
    }, 

    /* homePage: async ({page},use) => {
        await page.goto('https://letcode.in/test/');
        await use(new HomePage(page));
    }, */

    inputPage: async ({page}, use) => {
        await use(new InputPage(page)); 
    },

    buttonsPage: async ({page},use) => {
        await use (new ButtonsPage(page));
    },

    dropdownPage: async ({page},use) => {
        await use (new DropdownPage(page));
    },

    framePage: async ({page}, use) => {
        await use (new FramePage(page));
    },
    
    alertsPage: async ({page}, use) => {
        await use (new AlertsPage(page));
    },
    
    radioPage: async ({page}, use) => {
        await use (new RadioPage(page));
    },

    elementsPage: async ({page}, use) => {
        await use (new ElementsPage(page));
    },

    dragDropPage: async ({page}, use) => {
        await use (new DragDropPage(page));
    },

    tablePage: async ({page}, use) => {
        await use (new TablePage(page));
    },

    formPage: async ({page}, use) => {
        await use (new FormPage(page));
    },
    
    downloadPage: async ({page}, use) => {
        await use (new DownloadPage(page));
    },

    apiRequests: async ({page}, use) => {
        await use (new APIRequests(page));
    }

});

export const expect = test.expect;
