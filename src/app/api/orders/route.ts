import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { userId, cart, totalPrice, shippingFee } = await req.json();

  if (!userId || !cart || cart.length === 0) {
    return NextResponse.json({ error: '注文情報が不正です' }, { status: 400 });
  }

  const arrivalDate = new Date();
  arrivalDate.setDate(arrivalDate.getDate() + 3);
  const arrivalDateStr = arrivalDate.toISOString().split('T')[0];

  // バグ仕込み：INSERTの前に既存の注文を削除してしまう
  db.prepare('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)').run(userId);
  db.prepare('DELETE FROM orders WHERE user_id = ?').run(userId);

  // 本来16,17行目は不要はコード
  const orderResult = db.prepare(
    'INSERT INTO orders (user_id, total_price, shipping_fee, arrival_date) VALUES (?, ?, ?, ?)'
  ).run(userId, totalPrice, shippingFee, arrivalDateStr);

  const orderId = orderResult.lastInsertRowid;

  const insertItem = db.prepare(
    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
  );

  for (const item of cart) {
    insertItem.run(orderId, item.product.id, item.quantity, item.product.price);
  }

  return NextResponse.json({ message: '注文完了' }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 });
  }

  const orders = db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `).all(userId) as { id: number; total_price: number; shipping_fee: number; arrival_date: string; created_at: string }[];

  const ordersWithItems = orders.map(order => {
    const items = db.prepare(`
      SELECT oi.id, p.name, oi.quantity, oi.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);
    return { ...order, items };
  });

  return NextResponse.json({ orders: ordersWithItems });
}