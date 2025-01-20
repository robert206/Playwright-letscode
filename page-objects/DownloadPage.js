
class DownloadPage {
    constructor(page) {
        this.page = page;
        this.uploadBtn = page.locator('span.file-icon');
        this.xlsBtn = page.locator('#xls');
        this.pdfBtn = page.locator('#pdf');
    }


    async downloadFiles( page, element, pathSave) {
        const [download] = await Promise.all([
            page.waitForEvent('download'), // Wait for the download to start
            await element.click()
          ]);
        
            // Save the downloaded file to a specific location
            await download.saveAs(pathSave);
    }
}
export {DownloadPage};