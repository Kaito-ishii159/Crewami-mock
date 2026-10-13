# Crewami UI Prototype

Crewami の完成後の操作感を、人が実際に触って評価するためのスマートフォン風インタラクティブ UI モックです。

公開URL: [https://kaito-ishii159.github.io/Crewami-mock/](https://kaito-ishii159.github.io/Crewami-mock/)

> [!IMPORTANT]
> 本番 Crewami とは分離された UX 検証用リポジトリです。バックエンド、DB、本物の認証・位置情報・通知・決済は接続せず、データと状態変更は React の local state にだけ保持します。ページを再読み込みすると初期状態へ戻ります。

![Crewami desktop preview](docs/screenshots/owner-home-desktop.png)

## 起動と確認

Node.js 20.9 以上を使用します。

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。提出前の確認コマンドは次のとおりです。

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Preview Controller

デスクトップ表示ではスマートフォン枠の右側に開発・評価専用コントローラーが表示されます。本番 UI の一部ではありません。

- `Role`: ADMIN / MEMBER
- `Language`: 日本語 / English
- `Scenario`: 通常、希望収集中、シフト作成中、勤務中、欠員あり、無料体験、課金済み

スマートフォン幅では phone frame と Preview Controller が消え、390 × 844 を含む通常の全画面アプリ表示になります。

## 最初に確認する3画面

1. `ADMIN → シフト`: 4日分の日付を切り替え、スタッフ名を固定したまま24時間軸を横スクロールします。希望時間と確定時間の重なり、行タップ編集、確定解除、一括時間帯、確定状態による並び替え、公開確認まで操作できます。
2. `ADMIN → ホーム → 希望を集める`: 回答状況、個別・一括リマインド、回答用QR、新しい収集の作成と終了を操作できます。
3. `ADMIN → スタッフ`: 検索・在籍フィルター、追加、詳細、編集、時給、権限、PIN、無効化、勤怠・給与導線を操作できます。

## 実装済みの操作

### 管理者（ADMIN）

- 希望収集の作成、進捗確認、未提出者への個別・一括通知、QR回答画面
- 24時間ガント型シフト作成、4日切替、30分補助目盛り、勤務希望と確定シフトの重ね表示
- スタッフ行からの開始・終了時刻編集、確定・確定解除、状態別並び替え、公開確認と通知
- スタッフの検索、絞り込み、追加、編集、無効化、詳細、時給とPIN設定
- 今日の勤怠、履歴、詳細、修正申請の承認・差し戻し、給与概算
- 欠員募集、応募者確認、採用、再通知
- GPS共有マップ、店舗追加・編集・切替
- プラン選択・変更確認、利用席数
- 共用端末でのスタッフ選択、PIN入力、打刻結果
- 通知設定、言語変更、フィードバック

### メンバー（MEMBER）

- 勤務希望の入力、提出、確認・変更、一括入力と曜日コピー
- マイシフトと勤務詳細
- 出勤、休憩開始・終了、退勤
- 勤怠履歴、詳細、修正申請、給与概算
- 募集中シフトへの応募・取消と採用後状態
- 勤務中のGPS共有ON/OFF
- 通知設定、言語変更、フィードバック

## 表示ルール

- 権限は `ADMIN` と `MEMBER` の2種類です。
- ユーザー向け文言は日本語・英語を切り替えられます。
- シフト表は1時間ごとの主目盛りと30分ごとの補助目盛りを持ちます。
- 薄緑のストライプが勤務希望、濃緑が確定シフトです。
- 状態は `CONFIRMED` / `UNCONFIRMED` / `NO_AVAILABILITY` として管理し、色だけでなくラベルも表示します。
- 金額・プラン・位置情報・通知結果はUI確認用のサンプルです。

## 技術構成

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Lucide React
- CSS custom properties / responsive layout

## スクリーンショット

- [Desktop preview](docs/screenshots/owner-home-desktop.png)
- [Mobile 390 × 844](docs/screenshots/owner-home-mobile.png)
