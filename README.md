[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp) ![Deploy development](https://github.com/andysumi/visualization-api-gas-client/workflows/Deploy%20development/badge.svg) ![Deploy production](https://github.com/andysumi/visualization-api-gas-client/workflows/Deploy%20production/badge.svg)

# visualization-api-gas-client

Google Apps Script用のGoogle Visualization APIライブラリ

## スクリプトID

`1yJaboMV6hviJ6pJKoBqY4dW1X629li4Qd4CjSxIFp_amTulCZcvTdCZ6`

## コードサンプル

```js
function myFunction() {
  var file = SpreadsheetApp.getActiveSpreadsheet();
  var client = VisualizationAPIClient.create(ScriptApp.getOAuthToken(), file.getId());
  var query = 'SELECT * WHERE A = \'hoge\'';
  var data = client.getRawData(file.getSheetByName('sheet1').getSheetId(), query, 1, 'A:D');
  Logger.log(data);
}
```

## リファレンス

- [Google Visualization API Reference](https://developers.google.com/chart/interactive/docs/reference)
- [Google Spreadsheets Reference](https://developers.google.com/chart/interactive/docs/spreadsheets)
- [Query Language Reference](https://developers.google.com/chart/interactive/docs/querylanguage)
