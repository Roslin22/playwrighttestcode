const {expect,test}= require('@playwright/test');
import fs from 'fs';
const {LoginPage}=require('../PageObject/LoginPage')
const {CreateUser}=require('../PageObject/CreateUser')  

test.only('Creating new user',async ({page})=>{
  

    const usernameValue="roslinthomaspt@gmail.com"
    const passwordValue='Rt$$22@pt'

    const loginPage=new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(usernameValue,passwordValue)

        //verify the login with title
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Welcome to Fluent')).toBeVisible();    

    const CreateUser=new CreateUser(page);
    await CreateUser.AddUser();

    // Verify the user is added
    await page.locator("div[class='space-y-1'] span[class='text-text-primary mr-3'] svg").nth(2).click()
    const users=page.locator('.text-foreground.mb-4.text-3xl.font-semibold')
    console.log(await users.textContent()) 
    await expect(page.getByText('Users').first()).toBeVisible();

    // wait for dialog to be removed/hidden
    await expect(addUserDialog).toBeHidden({ timeout: 10000 });

    // then verify new user
    await expect(page.getByText(`testuser${randomNum}`)).toBeVisible();

    //Editing the USer
    page.locator('table tbody tr td', { hasText: `testuser${randomNum}` }).click();
    await page.locator('#username').fill(`updateduser${randomNum}`)
    await page.getByRole('combobox').click();
    await page.locator('span').filter({ hasText: 'Manager' }).click();
    await page.getByRole('button', { name: 'Save User' }).click();
})

test("Creating new project and assigning",async({page})=>{
    await page.goto('https://dev.app.fluent.bible');
    const username= page.locator('#username');
    const password= page.locator('#password');
    const combobtn= page.getByRole('combobox');
    const Assign = await page.getByRole('button', { name: 'Assign' })
    const exportBtn = await page.getByRole('button', { name: 'Export Project' });

    //login as manager
    await username.fill('roslinthomaspt@gmail.com')
    await password.fill('Rt$$22@pt')
    await page.getByRole('button', { type: 'submit' }).click()

    //verify the login with title
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle('Fluent')
    await expect(page.getByText('Welcome to Fluent')).toBeVisible();  

    //clicking on user menu  
    await page.locator("button[aria-label='User menu']").first().click();
    await page.locator("div[class='space-y-1'] span[class='text-text-primary mr-3'] svg").nth(1).click()
    const projects=page.locator('.text-foreground.mb-4.text-3xl.font-semibold')
    console.log(await projects.textContent())
    await expect(page.getByText('Projects').first()).toBeVisible();
    await page.getByRole('button', { name: 'Create Project' }).click();
    const randomNum = Math.floor(Math.random() * 100000);
    const projectName = `Testing_${randomNum}`;
    await page.locator("#title").fill(`Testing ${randomNum}`)

    // Selecting source languages
    await combobtn.nth(0).click();
    await page.locator('span').filter({ hasText: 'Gujarati (guj)' }).click();

    //selecting source bible
    await combobtn.nth(1).click();
    await page.locator('span').filter({ hasText: 'IRV Gujarati (IRV)' }).click();
     
    // Selecting target languages
    await combobtn.nth(2).click();
    await page.locator('span').filter({ hasText: 'Hindi (hin)' }).click();

    //selecting the books
    await page.getByRole('button', { name: 'Select book(s)' }).click();
    await page.locator('span').filter({ hasText: 'Genesis' }).click();
    await page.locator('span').filter({ hasText: 'Exodus' }).click();
    const mat= page.locator('span').filter({ hasText: 'Matthew' })
    await mat.scrollIntoViewIfNeeded();
    await mat.click();
   
    // Creating the project
    await page.getByRole('button', { name: 'Create Project' }).click();
    await expect(page.getByRole('dialog', { name: 'Create Project' })).toBeHidden();
    await expect(page.getByText(`Testing ${randomNum}`)).toBeVisible();

    // Saving project name to JSON file
    fs.writeFileSync('tests/test-data/projectData.json', JSON.stringify({ projectName }, null, 2));
    //opening the created project
    await page.locator('table tbody tr td', { hasText: `Testing ${randomNum}` }).click();
    await expect(page.getByText(`Hindi - Testing ${randomNum}`)).toBeVisible();

    //Assign button is disabled before selecting any row
    await expect(Assign).toBeDisabled();

    // Selecting first 5 rows
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < 5; i++) {
        const row = rows.nth(i);
        await row.locator('td').nth(i).click();
        
    }

    //Assign button is enabled after selecting rows
    await expect(Assign).toBeEnabled();
    await Assign.click();
    await expect(page.getByRole('dialog', { name: 'Assign User' })).toBeVisible();
    await page.getByRole('combobox').click();
    await page.locator('span').filter({ hasText: 'Roslin T' }).click();
    await page.getByRole('button', { name: 'Assign User' }).click();
    await expect(page.getByRole('dialog', { name: 'Assign User' })).toBeHidden();

    //Exporting the project
    await exportBtn.click();
    const exportDialog = page.getByRole('dialog', { name: 'Export Project' });
    await expect(exportDialog).toBeVisible();
    await page.getByRole('button', { name: 'Export' }).click();
});