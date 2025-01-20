const {page,expect} = require('@playwright/test');

class TablePage {

    constructor(page) {
        this.page = page;
        this.shoppingTablePrices = page.locator('table#shopping tr td:nth-child(2)');
        this.shoppingTotal = page.locator('tfoot td:nth-child(2)');
        this.tableCheckboxes = page.locator('input[type="checkbox"][value=""]');
        this.sortableHeaders = page.locator('thead th.mat-sort-header');
        this.sortTable = page.locator('tr.ng-star-inserted td');

        //table 2 
        this.sortableHeaders2 = page.locator('tr th.sorting');

        //advanced table
        this.tableRows = page.locator('#advancedtable > tbody > tr'); //actual table rows selector ,resolves all rows displayed
        this.rowsPerTable = page.locator('select[name="advancedtable_length"]'); // rows perPage selector
        this.rowsPerPage = page.locator('select[name="advancedtable_length"] > option');  // resolves to all dropdown options, used to traverse list
    

        this.searchField = page.locator('input[type="search"]'); // Search field
        this.table2Headers = page.locator('thead > tr > th'); // all table headers for sorting

    }


    async checkNumberOfRowsPerPage () {
        const noOfOptions = await this.rowsPerPage.count();
        console.log("No of options in rows per page :",noOfOptions);
        for (let i=0; i < noOfOptions; i++) {
            //click on every possible option of rows per page 5,10,25
            let rperPage = parseInt(await this.rowsPerTable.nth(i).textContent(),10);
            await this.rowsPerTable.selectOption(await this.rowsPerPage.nth(i).textContent());
            console.log("rows per page converted", rperPage);
        }
    }

    //takes element locator,checks if it resolves to more then one element and fetches its inner text and calcs sum of all 
    async innerTextToSum (element) {
        let totalSumInt = 0;
        if (await element.count() > 1) {
            const allText = await element.allTextContents();
            totalSumInt = allText.map(price => parseInt(price, 10)).reduce((sum, price) => sum + price, 0);
        }
        else {
            const allText = await element.textContent();
            totalSumInt = parseInt(allText.trim(), 10);
        }
        return totalSumInt;
    }



    //retrieves column data for specificed column index 
    async getColumnData (table, columnIndex) {
        const tableContent = await table.allInnerTexts();
        let data = [];
        for (let i = columnIndex; i < tableContent.length;i=i+6) {
            data.push(tableContent[i]);
        }
        return data;
    }



    //sort all data in all directions asc/desc, params : elements of sort column headers and actual table data
    async sortAllColumns (sortHeaders,table) {
        for (let i= 0;i < await sortHeaders.count();i++) {
            let actual = [];
            let expected = [];        
                for(let direction = 0; direction < 2; direction++ ) {
                    await sortHeaders.nth(i).click();
                    actual = await this.getColumnData(table,i);
                    if (direction === 0) { //asc
                        expected = (await this.getColumnData(table,i)).sort();
                    }
                    else { //desc
                        expected = (await this.getColumnData(table,i)).sort().reverse();
                    }
                    console.log("Column actual:\n",actual);
                    console.log("Column expected:\n",expected);
                    //soft assert as third will fail 
                    expect.soft(actual).toEqual(expected);
                }
            }
    }


    async checkRowsPerTable (table,resultsPerPageElement) {
        const rowsPerPage = await resultsPerPageElement.allTextContents();
        for ( let row in rowsPerPage) {
            let actual = await table.count();
            console.log(actual);
            console.log (row);
        }
    }
}

export {TablePage};