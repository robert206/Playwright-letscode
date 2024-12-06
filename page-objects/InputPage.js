import { expect, page} from '@playwright/test';

class InputPage {
    constructor(page) {
        this.page = page;
        this.fullName = page.locator('#fullName');
        this.joinInputField = page.locator('#join');
        this.getContent = page.locator('#getMe');
        this.clearField = page.locator('#clearMe');
        this.inputDisabled = page.locator('#noEdit');
        this.readOnlyField = page.locator('#dontwrite');
    } 
}

export {InputPage};
