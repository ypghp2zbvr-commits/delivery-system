import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderHistoryPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // 注文履歴の要素を返す
    orderHistoryItems(){
        return this.page.locator('button:has-text("キャンセル")');
    }

    // 画面に遷移する
    async open(){
        await this.goto('/order-history');
    }

    // 商品一覧に戻るボタン押下
    async backToProducts(){
        await this.page.locator('button',{hasText: '商品一覧に戻る'}).click();
    }

    // 送料を取得する
    orderShippingFee(){
        return this.page.locator('[data-testid="shipping-fee"]').first();
    }
}
