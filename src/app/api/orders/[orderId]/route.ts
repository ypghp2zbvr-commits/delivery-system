import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const orderIdNum = Number(orderId);

  if (!orderIdNum) {
    return NextResponse.json({ error: '注文IDが必要です' }, { status: 400 });
  }

  db.prepare('DELETE FROM order_items WHERE order_id = ?').run(orderIdNum);
  db.prepare('DELETE FROM orders WHERE id = ?').run(orderIdNum);

  return NextResponse.json({ message: 'キャンセル完了' }, { status: 200 });
}