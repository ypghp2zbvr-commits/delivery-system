import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { createTestEmail } from "../helpers/testData";
import { deleteTestUser } from "../helpers/dbCleanup";


const testEmail = createTestEmail();

test.afterEach(async () => {
    await deleteTestUser(testEmail);
});

test('メールアドレス重複エラー', async ({ page }) => {
    // 登録
    const registerPage = new RegisterPage(page);
    await registerPage.open();
    await registerPage.fillName('Test User');
    await registerPage.fillAddress('123 Main St')
    await registerPage.fillPhone('000-555-1234')
    await registerPage.fillEmail(testEmail)
    await registerPage.fillPassword('test123')
    await registerPage.submit();
    await expect(page).toHaveURL('/login');

    // ログイン画面から登録ページへ遷移する
    const loginPage = new LoginPage(page);
    await loginPage.clickRegisterLink();
    await expect(page).toHaveURL('/register');

    // 同じ情報で再登録する
    await registerPage.fillRegistrationForm({
        name: 'Test User',
        address: '123 Main St',
        phone: '000-555-1234',
        email: testEmail,
        password: 'test123'
    });
    await registerPage.submit();
    await expect(registerPage.errorMessage()).toHaveText('このメールアドレスは既に登録されています');


})
