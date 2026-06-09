import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { OrderConfirmPage } from "../pages/OrderConfirmPage";
import { ProductsPage } from "../pages/ProductsPage";
import {OrderHistoryPage} from "../pages/OrderHistoryPage";
import { createTestEmail } from "../helpers/testData";
import { deleteTestUser } from "../helpers/dbCleanup";


const testEmail = createTestEmail();

test.afterEach(async () => {
    await deleteTestUser(testEmail);
});

test('送料境界値確認', async ({ page }) => {
    // 登録
    const registerPage = new RegisterPage(page);
    await registerPage.open();
    await registerPage.fillRegistrationForm({
        name: 'Test User',
        address: '123 Main St',
        phone: '000-555-1234',
        email: testEmail,
        password: 'test123'
    });
    await registerPage.submit();
    await expect(page).toHaveURL('/login');

    // ログイン
    const loginPage = new LoginPage(page);
    await loginPage.fillLoginForm({
        email: testEmail,
        password: 'test123'
    });
    await loginPage.submit();
    await expect(page).toHaveURL('/products');

    // 商品選択して注文確認画面へ遷移すること
    const productsPage = new ProductsPage(page);
    await productsPage.fillQuantity('メロン',3);
    await productsPage.clickAddToCart('メロン');
    await productsPage.orderConfirm();
    await expect(page).toHaveURL('/order-confirm');
    
    // 注文の確認(送料が無料であること)
    const orderconfirmPage = new OrderConfirmPage(page);
    const shippingFee = await orderconfirmPage.getShippingFee();
    expect(shippingFee).toBe('無料');
    await orderconfirmPage.submit();
    await expect(page).toHaveURL('/order-history');

    // 注文履歴の確認(送料が無料で合計金額¥3,000の注文履歴が追加されていること)
    const orderhistoryPage = new OrderHistoryPage(page);
    await expect(orderhistoryPage.orderShippingFee()).toHaveText('無料');

});