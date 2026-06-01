'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  product: { id: number; name: string; price: number };
  quantity: number;
};

export default function OrderConfirmPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedUserId = localStorage.getItem('userId');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedUserId) setUserId(storedUserId);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // バグ仕込み：3000円以上で送料無料のはずが3000円ちょうどで送料がかかる
  const shippingFee = subtotal > 3000 ? 0 : 300;

  const total = subtotal + shippingFee;

  const handleOrder = async () => {
    if (!userId) return alert('ログインしてください');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, cart, totalPrice: total, shippingFee }),
    });

    if (res.ok) {
      localStorage.removeItem('cart');
      router.push('/order-history');
    } else {
      alert('注文に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">注文確認</h1>
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="font-bold mb-4">注文商品</h2>
          {cart.map(item => (
            <div key={item.product.id} className="flex justify-between py-2 border-b">
              <span>{item.product.name} × {item.quantity}</span>
              <span>¥{(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>小計</span>
              <span>¥{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>送料</span>
              <span data-testid="shipping-fee">{shippingFee === 0 ? '無料' : `¥${shippingFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>合計</span>
              <span data-testid="total-price">¥{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleOrder}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold"
        >
          注文する
        </button>
      </div>
    </div>
  );
}