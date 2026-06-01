import db from "@/lib/db";

export function deleteTestUser(email: string) {
    // emailからuser_idを取得
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: number } | undefined;
    if (!user) return;
    db.prepare('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)').run(user.id);
    db.prepare('DELETE FROM orders WHERE user_id = ?').run(user.id);
    db.prepare('DELETE FROM users WHERE email = ?').run(email);
}