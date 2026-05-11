import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'メールアドレスとパスワードを入力してください' }, { status: 400 });
  }

  const user = db.prepare('SELECT id, name FROM users WHERE email = ? AND password = ?').get(email, password) as { id: number; name: string } | undefined;

  if (!user) {
    return NextResponse.json({ error: 'メールアドレスまたはパスワードが違います' }, { status: 401 });
  }

  return NextResponse.json({ userId: user.id, userName: user.name }, { status: 200 });
}