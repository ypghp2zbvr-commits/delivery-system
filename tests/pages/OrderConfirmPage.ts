import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // 送料の表示を取得する
    async getShippingFee(){
        const row = this.page.locator('div', { hasText: '送料' });
        const fee = await row.locator('span').nth(1).textContent();
        return fee;
    }

    // 合計金額の表示を取得する
    async getTotalPrice(){
        const totalRow = this.page.locator('div', { hasText: '合計' });
        const total = await totalRow.locator('span').nth(1).textContent();
        return total;
    }

    // 注文するボタンを押下
    async submit(){
        await this.page.click('button:has-text("注文する")');
    }
    
    // 画面に遷移する
    async open(){
        await this.goto('/order-confirm');
    }

}

