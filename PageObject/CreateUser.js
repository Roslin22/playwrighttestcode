
class CreateUser{
    constructor(page){
        this.page=page;
        this.userMenu=page.locator("button[aria-label='User menu']").first()
        this.usersOption=page.locator("div[class='space-y-1'] span[class='text-text-primary mr-3'] svg").nth(2)
        this.addUserBtn=page.getByRole('button', { name: 'Add User' })
        this.emailInput=page.locator("#email")
        this.usernameInput=page.locator("#username")
        this.firstNameInput=page.locator("#firstName")
        this.lastNameInput=page.locator("#lastName")
        this.roleDropdown=page.getByRole('combobox')
        this.addUserDialog=page.getByRole('dialog', { name: 'Add User' })
    }
    async AddUser(){
        await this.userMenu.click();
        await this.usersOption.click();
        await this.addUserBtn.click();
        const randomNum = Math.floor(Math.random() * 100000);
        await this.emailInput.fill(`test${randomNum}@gmail.com`);
        await this.usernameInput.fill(`testuser${randomNum}`);
        await this.firstNameInput.fill(`Test${randomNum}`);
        await this.lastNameInput.fill(`User${randomNum}`);
        await this.roleDropdown.click();
        await this.page.locator('span').filter({ hasText: 'Translator'  }).click();
        await this.page.getByRole('button', { name: 'Add User' }).click();
    }
}
module.exports={CreateUser}