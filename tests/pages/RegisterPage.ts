// RegisterPage.ts  自分で出力(サジェスト機能とさっき出力したコードとWebサイトの内容参考に作成)
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
   constructor(page: Page) {
    super(page);
   }

   // まずは個別で定義する
    async fillName(name: string){
        await this.page.fill('input[name="name"]', name);
    }
    async fillAddress(address: string){
        await this.page.fill('input[name="address"]', address);
    }
    async fillPhone(phone: string){
        await this.page.fill('input[name="phone"]', phone);
    }
    async fillEmail(email: string){
        await this.page.fill('input[name="email"]', email);
    }
    async fillPassword(password: string){
        await this.page.fill('input[name="password"]', password);
    }

    // ここでまとめて定義する
    async fillRegistrationForm(data: {name: string, address: string, phone: string, email: string, password: string}){
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

    // エラーメッセージを取得する
    async getErrorMessage(){
        return await this.page.textContent('.text-red-500');
    }

    // 画面に遷移する
    async open() {
        await super.goto('/register');
    }
    
}

