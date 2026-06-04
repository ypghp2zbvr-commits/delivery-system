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

test('注文履歴累積確認', async ({ page }) => {
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

    // 商品選択して注文確認へ
    const productsPage = new ProductsPage(page);
    await productsPage.fillQuantity('いちご',2);
    await productsPage.clickAddToCart('いちご');
    await productsPage.fillQuantity('スイカ',1);
    await productsPage.clickAddToCart('スイカ');
    await productsPage.orderConfirm();
    await expect(page).toHaveURL('/order-confirm');
    
    // 注文の確認(1回目)
    const orderconfirmPage = new OrderConfirmPage(page);
    await orderconfirmPage.submit();
    await expect(page).toHaveURL('/order-history');

    // 注文履歴の確認
    const orderhistoryPage = new OrderHistoryPage(page);
    await expect(orderhistoryPage.orderHistoryItems()).toHaveCount(1);

    // 商品一覧画面に戻る
    await orderhistoryPage.backToProducts();
    await expect(page).toHaveURL('/products');

    // 商品選択して注文確認へ(2回目)
    await productsPage.fillQuantity('メロン',1);
    await productsPage.clickAddToCart('メロン');
    await productsPage.orderConfirm();
    await expect(page).toHaveURL('/order-confirm');

    // 注文するボタンを押下し、注文履歴画面に遷移する
    await orderconfirmPage.submit();
    await expect(page).toHaveURL('/order-history');

    // 注文履歴に2つデータが存在していることを確認する
    await expect(orderhistoryPage.orderHistoryItems()).toHaveCount(2);

});