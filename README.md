# 契約書編集ツール

本リポジトリは、Word 形式（.docx）の開発委託契約書を自動で編集する Python スクリプト一式を提供します。

## 構成

* `docs/` … 変換対象となる契約書ファイル（`.docx`）を格納するディレクトリ
* `contract.yaml` … 契約当事者（甲・乙）の情報を YAML 形式で保持（今回のスクリプトでは **個人（甲）のみ** 利用）
* `update_contracts.py` … 契約書の当事者情報を一括置換するメインスクリプト
* `inspect_docx.py` … 置換後に内容を抜粋表示して確認する補助スクリプト
* `requirements.txt` … 必要な Python 依存ライブラリ

## 事前準備

```bash
# Python 仮想環境を作成・有効化（任意）
python3 -m venv venv
source venv/bin/activate

# 依存ライブラリをインストール
pip install -r requirements.txt
```

## 使い方

1. `docs/` 配下に編集対象の Word ファイル（`.docx`）を配置して下さい。
2. 必要に応じて `contract.yaml` の値を変更します。
   * `individual.name`: 甲に記載する個人名
   * `individual.address`: 甲に記載する住所
   * 乙（会社側）の情報も追加で管理しておきたい場合は `contract.yaml` に追記して下さい（`update_contracts.py` 側での読み込み処理は要改修）。
3. スクリプトを実行して契約書を更新します。

```bash
python update_contracts.py
```

実行後、同名ファイルが上書き保存され、置換が完了します。

4. 編集結果を確認するには：

```bash
python inspect_docx.py
```

`甲：` 行や `●●` プレースホルダが正しく置換されたことを CLI で確認できます。

## スクリプトの動作概要

`update_contracts.py` は以下を行います。

1. `.docx` 内の全パラグラフと表セルを走査して、
   * 文字列 `●●` を `contract.yaml` で指定した個人名（例: 岸谷 祥平）に置換
2. `甲：` で始まる段落を検出し、同じ段落を住所に、次の段落を名前に書き換え
3. 変更を保存

`inspect_docx.py` は `.docx` を開き、置換対象になりそうな行のみを抽出して表示します。

## 注意事項

* `.docx` のレイアウトや段落構成がテンプレートと大きく異なる場合、意図通りに置換できない可能性があります。その際は `update_contracts.py` を調整して下さい。
* 大量ファイルを扱う場合は、バックアップを取ってから実行することを推奨します。

## ライセンス

MIT License など、必要に応じて追記して下さい。 