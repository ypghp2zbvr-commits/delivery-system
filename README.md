# delivery-system

ECサイトのデリバリー管理システムです。  
QAエンジニアとしてのテスト設計・自動化スキルを示すポートフォリオとして作成しました。

## 概要

果物を販売するECサイトを題材に、意図的にバグを仕込んだアプリケーションに対して、テスト設計・Playwright E2E自動化・GitHub Actions CI組み込みを進行中です。

## 使用技術

| 技術 | 用途 |
| --- | --- |
| Next.js / TypeScript | フロントエンド・APIサーバー |
| SQLite | データベース |
| Playwright | E2Eテスト自動化 |

## Status

- ✅ テスト設計書 / POM基盤 / helpers
- ✅ 会員登録機能のE2E
- 🚧 バグ検知テスト（OH-06 上書き、OC-04 境界値）、シナリオテスト
- 📋 GitHub Actions CI、`webServer`設定

## 意図的に仕込んだバグ

| No | バグ名 | 概要 |
|----|--------|------|
| 1 | 上書きバグ | 追加注文すると既存の注文履歴が消える |
| 2 | 境界値バグ | 3000円ちょうどで送料無料にならない |
| 3 | flaky test | 意図的に不安定なテストを作成し安定化させる |

## セットアップ

```bash
git clone https://github.com/あなたのユーザー名/delivery-system.git
cd delivery-system
npm install
npm run seed
npm run dev
```

ブラウザで http://localhost:3000/register を開いてください。

## ドキュメント

| ドキュメント | 内容 |
|-------------|------|
| [仕様書](docs/spec.md) | 機能仕様・バグ詳細 |
| [テスト設計書](docs/test-design.md) | テスト観点・テストケース |

## 画面構成

```
/register      会員登録
/login         ログイン
/products      商品一覧
/order-confirm 注文確認
/order-history 注文履歴
```