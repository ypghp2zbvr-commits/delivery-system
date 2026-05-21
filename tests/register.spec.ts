import { test, expect } from "@playwright/test";
import { RegisterPage } from "./pages/RegisterPage";
import { createTestEmail } from "./helpers/testData";
import { deleteTestUser } from "./helpers/dbCleanup";

const testEmail = createTestEmail();

test('登録ページテスト', async ({ page }) => {
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
});

test.afterEach(async () => {
    await deleteTestUser(testEmail);
});