import db from './db';

const products = [
  { name: 'りんご', price: 200 },
  { name: 'バナナ', price: 150 },
  { name: 'みかん', price: 100 },
  { name: 'ぶどう', price: 500 },
  { name: 'いちご', price: 400 },
  { name: 'メロン', price: 1500 },
  { name: 'スイカ', price: 2000 },
  { name: 'もも', price: 600 },
  { name: 'なし', price: 300 },
  { name: 'キウイ', price: 250 },
  { name: 'マンゴー', price: 800 },
  { name: 'パイナップル', price: 700 },
];

const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

if (existingProducts.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  products.forEach(p => insert.run(p.name, p.price));
  console.log('シードデータを挿入しました');
} else {
  console.log('シードデータは既に存在します');
}