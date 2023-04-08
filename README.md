# gas_line_chatbot
災害情報収集先遣隊システム解説
===============

 2022/04/08

・本システム開発の経緯
-----------

[https://docs.google.com/presentation/d/160NKaE7vpZsDyoUFF6DqyacT8RdlWPsq9DJ0\_rh-FJg/edit?usp=sharing](https://www.google.com/url?q=https://docs.google.com/presentation/d/160NKaE7vpZsDyoUFF6DqyacT8RdlWPsq9DJ0_rh-FJg/edit?usp%3Dsharing&sa=D&source=editors&ust=1680937493765868&usg=AOvVaw37Ebtnq6SRZYuPxfhvB6Mt)

・システム機能
-------

災害発生後の現地調査に利用

Google Spread Sheetを準備する。Spread Sheetに本リポジトリで用意しているGoogle App Scriptを設定する.Google App ScriptのDeployメニューからDeployを行いURLを取得する.指定URLをSpreas Sheetの#propertyシートに記入する.

   Line Developer Consoleのアカウントを作成し、Lineのチャットボットの設定を行う.

          公式チャンネルを作成    Web Hook URLに上記のデプロイURLを設定する.

         Google Spread Sheet #propertyシートに Line Message APIトークンを設定する.

 調査に行くメンバーはスマートフォンにLineをインストールして作成した公式チャンネルと友達になる.

 調査を行う場所についたらLineで上記公式チャンネルとのトーク画面で情報を送信すると指定作成したGoogle Spread Sheetに送信した情報が記録されるので後方にいるメンバが災害現地の状況を把握することができる.

現地情報を投稿する場合に最初に位置情報を投稿したあとでテキスト、写真、動画等を投稿するとテキスト等の投稿が位置情報に結びついた形でデータが記録される.位置情報付きのデータはWEB地図上に点をプロットして閲覧することができる。

また位置情報付き調査情報はGeoJSONで取得できるAPIを用意しているのでGeoJSONを読める地理情報システム(QGIS等)があれば調査情報をそのシステムで利用することができる.
