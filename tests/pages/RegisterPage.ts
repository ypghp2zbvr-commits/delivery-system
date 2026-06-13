import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
   constructor(page: Page) {
    super(page);
   }

   // 個別で入力、入力されたことを確認
    async fillName(name: string){
        await this.page.fill('input[name="name"]', name);
        await expect(this.page.locator('input=[name="name"]')).toHaveValue(name);
    }
    async fillAddress(address: string){
        await this.page.fill('input[name="address"]', address);
        await expect(this.page.locator('input=[name="address"]')).toHaveValue(address);
    }
    async fillPhone(phone: string){
        await this.page.fill('input[name="phone"]', phone);
        await expect(this.page.locator('input=[name="phone"]')).toHaveValue(phone);
    }
    async fillEmail(email: string){
        await this.page.fill('input[name="email"]', email);
        await expect(this.page.locator('input=[name="email"]')).toHaveValue(email);
    }
    async fillPassword(password: string){
        await this.page.fill('input[name="password"]', password);
        await expect(this.page.locator('input=[name="password"]')).toHaveValue(password);
    }

    // まとめて定義する。Passwordテキストボックスが表示されるまで待つ
    async fillRegistrationForm(data: {name: string, address: string, phone: string, email: string, password: string}){
        await expect(this.page.locator("input[name='password']")).toBeEnabled();
        await this.fillName(data.name);
        await this.fillAddress(data.address);
        await this.fillPhone(data.phone);
        await this.fillEmail(data.email);
        await this.fillPassword(data.password);
    };

    // 登録ボタンを押下する
    async submit(){
        await this.page.click('button:has-text("登録する")');
    }

    // エラーメッセージを返す
    errorMessage(){
        return this.page.locator('.text-red-500');
    }

    // 画面に遷移する
    async open() {
        await this.goto('/register');
    }


}