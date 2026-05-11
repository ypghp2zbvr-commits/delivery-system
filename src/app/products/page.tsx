'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PER_PAGE = 10;

  useEffect(() => {
    fetch(`/api/products?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setTotal(data.total);
      });
  }, [page]);

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities({ ...quantities, [productId]: value });
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const handleOrder = () => {
    if (cart.length === 0) return alert('商品を選択してください');
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/order-confirm');
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">商品一覧</h1>
          <button
            onClick={() => router.push('/order-history')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            注文履歴へ
          </button>
        </div>
        <div className="bg-white rounded shadow overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">商品名</th>
                <th className="p-4 text-left">価格</th>
                <th className="p-4 text-left">数量</th>
                <th className="p-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">¥{product.price.toLocaleString()}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min={1}
                      defaultValue={1}
                      onChange={e => handleQuantityChange(product.id, Number(e.target.value))}
                      className="border rounded px-2 py-1 w-20"
                    />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      カートに追加
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="bg-white rounded shadow p-4 mb-6">
            <h2 className="font-bold mb-2">カート</h2>
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between py-1">
                <span>{item.product.name} × {item.quantity}</span>
                <span>¥{(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleOrder}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-bold"
        >
          注文確認へ
        </button>
      </div>
    </div>
  );
}