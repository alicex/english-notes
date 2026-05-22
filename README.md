# english-notes

日本語の単語や文章を翻訳して一覧で見れる家庭内アプリ。

## Setup

```bash
npm install
npm run dev
```

```
english-notes/
├── app/
│   └── pages/
│       ├── index.vue
│       │   └── 翻訳登録画面
│       │       ・日本語入力
│       │       ・カテゴリ選択
│       │       ・翻訳API呼び出し
│       │       ・翻訳結果表示
│       │
│       └── notes/
│           └── index.vue
│               └── 登録済み一覧画面
│                   ・Notionから一覧取得
│                   ・英語/日本語表示
│                   ・カテゴリ表示
│
├── server/
│   ├── api/
│   │   ├── translate.post.ts
│   │   │   └── 翻訳登録API
│   │   │       ・入力チェック
│   │   │       ・Google Apps Script翻訳
│   │   │       ・Notion DB保存
│   │   │
│   │   └── notes.get.ts
│   │       └── 一覧取得API
│   │           ・Notion DB取得
│   │           ・画面用データ整形
│   │
│   └── middleware/
│       └── basic-auth.ts
│           └── Basic認証
│               ・ID/PW認証
│               ・未認証アクセス制御
│
├── .env
│   └── 環境変数
│       ・Notion APIキー
│       ・翻訳API URL
│       ・Basic認証情報
│
├── nuxt.config.ts
│   └── Nuxt設定
│       ・runtimeConfig設定
│
├── package.json
│   └── パッケージ管理
│
└── tsconfig.json
    └── TypeScript設定
```

---

- https://script.google.com/
- https://vercel.com/
- https://www.notion.so/developers/
