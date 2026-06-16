import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { createTestEmail } from "../helpers/testData";
import { deleteTestUser } from "../helpers/dbCleanup";
import { createTestUser } from "../helpers/testData";

const testEmail = createTestEmail();

test.afterEach(async () => {
    await deleteTestUser(testEmail);
});

test('メールアドレス重複エラー', async ({ page }) => {
    // DBにメールアドレスを登録する
    createTestUser(testEmail);

    // 既にDB登録済みデータで登録する
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
    await expect(registerPage.errorMessage()).toHaveText('このメールアドレスは既に登録されています');

})
