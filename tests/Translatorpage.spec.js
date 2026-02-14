const {test,expect}= require('@playwright/test');
import fs from 'fs';

test.only('Opening project',async ({page})=>{
    await page.goto('https://dev.app.fluent.bible');
    const username= page.locator('#username');
    const password= page.locator('#password');

    //login as translator
    await username.fill('Roslin.Thomas@bridgeconn.com')
    await password.fill('Rt$$22@pt')
    await page.getByRole('button', { type: 'submit' }).click()

    //verify the login with title
    await expect(page).toHaveTitle('Fluent')
    await page.waitForLoadState('networkidle');
    
    // Navigating to the saved project
    const data = JSON.parse(fs.readFileSync('tests/test-data/projectData.json', 'utf-8'));
    const projectName = data.projectName.replace('_', ' ');

    // Locating the created project and opening it
    const tableRow = page.locator('table tbody tr', { hasText: projectName });
    const bookCell = tableRow.locator('td').nth(1);
    const bookName = (await bookCell.innerText()).trim();
    console.log(`Book Name: ${bookName}`);

    //Clicking the row to open the project
    await tableRow.click();
    await page.waitForLoadState('networkidle');
    // Verifying that the correct book page is opened
    await expect(page.locator('.text-3xl.font-bold')).toContainText(`${bookName}`);

    //Drafting the Verse
    const verseCount = await page.locator("textarea[placeholder='Enter translation...']").count();

    // Filling in translations for each verse
    for (let verseNum = 1; verseNum <= verseCount; verseNum++) {
    const verse = page.locator(`[aria-label='Translation for verse ${verseNum}']`);
    await verse.fill(`This is testing verse number ${verseNum}`);
    await expect(verse).toHaveValue(`This is testing verse number ${verseNum}`);
    // Navigating to the next verse if not the last one
    if (verseNum < verseCount) {
    const nextVerse = page.getByRole('button', { name: 'Next Verse' });
    await expect(nextVerse).toBeVisible();
    await nextVerse.click();
    }
  }

    // Resource selection
    await page.locator('body > div:nth-child(1) > div:nth-child(1) > main:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2)').click()
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Translation Notes (uW)' }).click();
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: 'English' }).click();
    //Locating the resource and opening all the  links
    const links= page.locator('h3.flex')
    const linkCount=await links.count();
    for(let i=0;i<linkCount;i++){
        const link=links.nth(i);
        link.scrollIntoViewIfNeeded();
        link.click();
    }
    // Submitting the drafting page
    const submitDraft= page.getByRole('button', { name: 'Submit' })
    submitDraft.isEnabled();
    await submitDraft.click();
    
    await expect(page.getByText('Translator Dashboard')).toBeVisible();
    await page.getByRole('button',{name:'My History'}).click();
  //  const historyRow = page.locator('table tbody tr', {  hasText: `${projectName} ${bookName}`});
  //  await expect(historyRow).toBeVisible();

})

