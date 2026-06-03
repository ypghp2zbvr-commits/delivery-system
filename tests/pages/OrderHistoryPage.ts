import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderHistoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // 注文履歴の件数を取得する
    async getOrderHistoryCount(){
        const count = await this.page.locator('button:has-text("キャンセル")').count();
        return count;
    }

    // 画面に遷移する
    async open(){
        await this.goto('/order-history');
    }

    // 商品一覧に戻るボタン押下
    async backToProducts(){
        await this.page.locator('button',{hasText: '商品一覧に戻る'}).click();
    }

}
