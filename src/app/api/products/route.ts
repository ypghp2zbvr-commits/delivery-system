import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const products = db.prepare('SELECT * FROM products LIMIT ? OFFSET ?').all(perPage, offset);
  const total = (db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;

  return NextResponse.json({ products, total });
}