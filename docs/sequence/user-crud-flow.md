### ユーザー情報登録フロー
ユーザーが新規登録後に自身や子どもの情報を初期設定する際の流れです。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Browser as ブラウザ
    participant Supabase as サーバー

    note over Browser:プロフィール登録画面
    User->>Browser: 親の情報(step1)を入力し「つぎへ」ボタンをクリック
    activate Browser
    Browser->>Browser: 入力値バリデーション
    Browser->>Browser: step2に切り替わる
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: 子どもの情報(step2)を入力し「保存してはじめる」
    activate Browser
    Browser->>Browser: 入力値バリデーション
    
    opt プロフィール画像がある
        Browser->>Supabase: 画像をアップロード
        activate Supabase
        Supabase-->>Browser: 画像のURL
        deactivate Supabase
    end

    Browser->>Supabase: ユーザー情報登録処理
    activate Supabase
    note left of Supabase:ユーザー名<br/>プロフィール画像URL
    note left of Supabase:子どもの名前<br/>子どもの誕生日<br/>アレルギー情報
    Supabase-->>Browser: 成功
    deactivate Supabase
    
    Browser->>Browser: ホーム画面へ遷移
    note over Browser:ホーム画面
    Browser-->>User: 画面確認
    deactivate Browser
```

### ユーザー情報更新フロー（メールアドレス、パスワード以外）
ユーザーがメールアドレスやパスワード以外の自身や子どもの情報を更新する際の流れです。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Browser as ブラウザ
    participant Supabase as サーバー

    note over Browser:マイページ画面
    User->>Browser: 「編集」ボタンをクリック
    activate Browser
    Browser->>Browser: 編集モードに切り替わる
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: プロフィール情報を入力し「保存」ボタンをクリック
    activate Browser

    Browser->>Browser: 入力値バリデーション

    opt プロフィール画像がある
        Browser->>Supabase: 画像をアップロード
        activate Supabase
        Supabase-->>Browser: 画像のURL
        deactivate Supabase
    end    
    
    Browser->>Supabase: ユーザー情報更新処理
    activate Supabase
    note left of Supabase:ユーザー名<br/>プロフィール画像URL
    note left of Supabase:子どもの名前<br/>子どもの誕生日<br/>アレルギー情報
    Supabase-->>Browser: 成功
    deactivate Supabase
    
    Browser->>Browser: 通常モードに切り替わる
    Browser-->>User: 画面確認
    deactivate Browser
```

### ユーザー情報更新フロー（メールアドレス）
ユーザーがメールアドレスを変更する際の流れです。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Browser as ブラウザ
    participant Supabase as サーバー

    note over Browser:マイページ画面
    User->>Browser: 「編集」ボタンをクリック
    activate Browser
    Browser->>Browser: 編集モードに切り替わる
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: メールアドレスの「変更する」ボタンをクリック
    activate Browser
    Browser->>Browser: メールアドレス変更画面に遷移
    note over Browser:メールアドレス変更画面
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: 新しいメールアドレスを入力し「変更する」ボタンをクリック
    activate Browser
    Browser->>Browser: 入力値バリデーション
    
    Browser->>Supabase: 更新処理
    activate Supabase
    note right of Browser:メールアドレス
    Supabase-->>User:確認メール送信
    User->>Supabase:メール記載のURLにアクセス
    Supabase-->>Browser: 成功
    deactivate Supabase
    Browser->>Browser:ログイン画面に遷移 
    note over Browser:ログイン画面
    
    Browser-->>User: 画面確認
    deactivate Browser
```

### ユーザー情報更新フロー（パスワード）
ユーザーがパスワードを変更する際の流れです。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Browser as ブラウザ
    participant Supabase as サーバー

    note over Browser:マイページ画面
    User->>Browser: 「編集」ボタンをクリック
    activate Browser
    Browser->>Browser: 編集モードに切り替わる
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: パスワードの「変更する」ボタンをクリック
    activate Browser
    Browser->>Browser: パスワード変更画面に遷移
    note over Browser:パスワード変更画面
    Browser-->>User: 画面確認
    deactivate Browser
    
    User->>Browser: 新しいパスワードを入力し「変更する」ボタンをクリック
    activate Browser
    Browser->>Browser: 入力値バリデーション
    
    Browser->>Supabase: 更新処理
    activate Supabase
    note right of Browser:パスワード
    Supabase-->>Browser: 成功
    deactivate Supabase
    
    Browser->>Browser: ログイン画面に遷移
    note over Browser:ログイン画面
    Browser-->>User: 画面確認
    deactivate Browser
```
