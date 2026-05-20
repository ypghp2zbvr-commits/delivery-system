import db from "@/lib/db";

export function deleteTestUser(email: string) {
    db.prepare('DELETE FROM users WHERE email = ?').run(email);
}
