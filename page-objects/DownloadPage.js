
class DownloadPage {
    constructor(page) {
        this.page = page;
        this.uploadBtn = page.locator('span.file-icon');
        this.xlsBtn = page.locator('#xls');
        this.pdfBtn = page.locator('#pdf');
    }
}
export {DownloadPage};