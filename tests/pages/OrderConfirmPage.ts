import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // 送料の表示を取得する
    async getShippingFee(){
        return await this.page.locator('[data-testid="shipping-fee"]').textContent();
    }

    // 合計金額の表示を取得する
    async getTotalPrice(){
        return await this.page.locator('[data-testid="total-price"]').textContent();
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

