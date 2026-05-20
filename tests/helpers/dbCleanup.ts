export function createTestEmail() : string {
    const testEmail = `test_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
    return testEmail;
}