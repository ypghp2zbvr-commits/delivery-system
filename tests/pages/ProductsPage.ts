import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // 商品名で数量を入力する
    async fillQuantity(productName: string, quantity: number) {
        const row = this.page.locator('tr', { hasText: productName });
        await row.locator('input[type="number"]').fill(quantity.toString());
    }

    // 商品名で「カートに追加」ボタンを押下する
    async clickAddToCart(productName: string) {
        const row = this.page.locator('tr', { hasText: productName });
        await row.locator('button', { hasText: 'カートに追加' }).click();
    }

    // 注文確認へボタンを押下する
    async orderConfirm() {
        await this.page.locator('button', {hasText: '注文確認へ' }).click();
    }

    // products page　を開く
    async open() {
        await this.goto('/products');
    }
}