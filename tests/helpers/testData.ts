import db from "@/lib/db";

export function createTestEmail() : string {
    const testEmail = `test_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
    return testEmail;
}

export function createTestUser(email: string) {
    db.prepare('INSERT INTO users (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)')
      .run('Test User', '123 Main St', '000-555-1234', email, 'test123');
}