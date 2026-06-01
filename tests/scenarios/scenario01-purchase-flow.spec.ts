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

test('購入フローのテスト', async ({ page }) => {
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
    
    // 注文の確認、送料の確認
    const orderconfirmPage = new OrderConfirmPage(page);
    const shippingFee = await orderconfirmPage.getShippingFee();
    expect(shippingFee).toBe('¥300');
    const totalPrice = await orderconfirmPage.getTotalPrice();
    expect(totalPrice).toBe('¥3,100');
    await orderconfirmPage.submit();
    await expect(page).toHaveURL('/order-history');

    // 注文履歴の確認
    const orderhistoryPage = new OrderHistoryPage(page);
    const orderHistoryCount = await orderhistoryPage.getOrderHistoryCount();
    expect(orderHistoryCount).toBe(1);

});