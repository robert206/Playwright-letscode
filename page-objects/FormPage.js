
class FormPage {
    constructor(page) {
        this.page = page;
        this.gender = page.locator('[type="radio"][name="gender"]');
        this.firstName = page.locator('#firstname');
        this.lastName = page.locator('#lastname');
        this.email = page.locator('#email');
    }
}

export {FormPage};
