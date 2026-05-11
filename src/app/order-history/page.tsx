'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total_price: number;
  shipping_fee: number;
  arrival_date: string;
  created_at: string;
  items: OrderItem[];
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
    fetch(`/api/orders?userId=${storedUserId}`)
      .then(res => res.json())
      .then(data => setOrders(data.orders));
  }, []);

  const handleCancel = async (orderId: number) => {
    if (!confirm('注文をキャンセルしますか？')) return;
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) {
      setOrders(orders.filter(order => order.id !== orderId));
    } else {
      alert('キャンセルに失敗しました');
    }
  };

      return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">注文履歴</h1>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            商品一覧に戻る
          </button>
        </div>
        {orders.length === 0 && (
          <p className="text-gray-500">注文履歴がありません</p>
        )}
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded shadow p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">注文日：{order.created_at.split('T')[0]}</p>
                <p className="text-sm text-gray-500">到着予定：{order.arrival_date}</p>
              </div>
              <button
                onClick={() => handleCancel(order.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                キャンセル
              </button>
            </div>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.name} × {item.quantity}</span>
                <span>¥{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span>送料</span>
                <span>{order.shipping_fee === 0 ? '無料' : `¥${order.shipping_fee}`}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>合計</span>
                <span>¥{order.total_price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}