# Crewami UI Prototype

Crewami の完成イメージと操作感を、人が実際に触って評価するためのスマートフォン風 UI プロトタイプです。

**Live prototype:** <https://kaito-ishii159.github.io/Crewami-mock/>

> [!IMPORTANT]
> このリポジトリは本番 Crewami とは別の UX 検証用モックです。バックエンド、DB、本物の認証・位置情報・通知・決済はなく、表示データと状態変更はすべてブラウザ内の固定データです。

![Crewami desktop preview](docs/screenshots/owner-home-desktop.png)

## 起動方法

Node.js 20.9 以上を使用します。

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Preview Controller

PC 表示ではスマートフォン枠の右側に開発・評価専用の Preview Controller が表示されます。本番 UI の一部ではありません。

- `Role`: OWNER / MANAGER / MEMBER を切り替え
- `Language`: 日本語 / English を切り替え
- `Scenario`: 通常、シフト募集、シフト作成、欠員、勤務、休憩、未課金、無料体験、課金済みを切り替え

スマートフォン幅では phone frame と Preview Controller が消え、通常の全画面アプリとして表示されます。

## 実装画面

### OWNER / MANAGER

- ホーム（希望収集 → シフト作成 → 公開の進行状況）
- 店舗切替
- シフト希望収集、未提出者通知、回答用 QR モーダル
- 登録不要のシフト希望提出
- モバイル向けシフト作成、必要人数・不足数表示
- 公開確認、スタッフ表示プレビュー、公開完了
- 今日の勤怠、修正申請バッジ
- 欠員募集、応募者採用、募集完了
- GPS 共有スタッフのモック地図
- スタッフ一覧・詳細
- 店舗一覧
- サブスクリプション、無料体験、利用席数
- 共用端末打刻モード
- 設定、フィードバック

### MEMBER

- ホーム、今日／次回の勤務
- マイシフト
- 出勤、休憩開始／終了、退勤完了
- 勤怠履歴、給与概算、修正申請入口
- 欠員募集への応募／取消、採用後状態
- 本人操作による GPS 共有 ON / OFF
- ロールに合わせた設定、フィードバック

## 主な操作導線

OWNER はホームの進行カードから `希望を集める → シフトを組む → 公開前の確認 → 公開` を続けて操作できます。MEMBER は `今日の勤務 → 出勤 → 休憩 → 退勤`、または `募集中のシフト → 応募` を操作できます。

ページ再読み込みで状態が初期化される、local state のみのプロトタイプです。料金は UI 確認用の仮設定で、実際のプラン価格ではありません。

## スクリーンショット

- [Desktop preview](docs/screenshots/owner-home-desktop.png)
- [Mobile 390 × 844](docs/screenshots/owner-home-mobile.png)

## 技術構成

- Next.js 16 App Router
- React 19
- TypeScript (strict)
- Lucide React
- CSS custom properties / responsive layout

