import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { name, address, phone, email, password } = await req.json();

  if (!name || !address || !phone || !email || !password) {
    return NextResponse.json({ error: '全項目を入力してください' }, { status: 400 });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 400 });
  }

  db.prepare(
    'INSERT INTO users (name, address, phone, email, password) VALUES (?, ?, ?, ?, ?)'
  ).run(name, address, phone, email, password);

  return NextResponse.json({ message: '登録成功' }, { status: 201 });
}