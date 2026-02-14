
const { expect } = require('@playwright/test');
class LoginPage{
    constructor(page){
        this.page=page;
        this.username= page.locator('#loginEmail');
        this.password= page.locator('#loginPassword');
        
    }
    async goTo()
    {
        await this.page.goto('https://dev.app.fluent.bible');
        await expect(this.page).toHaveTitle('Sign In - Fluent')
        
    }
    
    async login(usernameValue,passwordValue)
    {
        await this.username.fill(usernameValue);
        await this.password.fill(passwordValue);
        await this.page.getByRole('button', { type: 'submit' }).click();
    }

}


module.exports={LoginPage}  