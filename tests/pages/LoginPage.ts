import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }


    // アドレスとパスワードを入力する
    async fillEmail(email: string){
        await this.page.fill('input[name="email"]',email);
    }
    async fillPassword(password: string){
        await this.page.fill('input[name="password"]', password);
    }

    // まとめて入力
    async fillLoginForm(data: {email: string, password: string}){
        await this.fillEmail(data.email);
        await this.fillPassword(data.password);
    }

    // ログインボタン押下
    async submit(){
        await this.page.click('button:has-text("ログイン")');
    }

    // エラーメッセージを取得する
    async getErrorMessage(){
        return await this.page.textContent('.text-red-500');
    }
    
    // 画面に遷移する
    async open() {
        await this.goto('/login');
    }

}