class HomePage {
    constructor(page) {
        this.page = page;
        this.inputLink = page.locator('[href="/edit"]');
        this.buttonsLink = page.locator('[href="/buttons"]');
        this.dropdownsLink = page.locator('[href="/dropdowns"]');
        this.alertsLink = page.locator('[href="/alert"]');
        this.frameLink = page.locator('[href="/frame"]');
    } 
}

export {HomePage};