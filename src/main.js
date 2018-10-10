/**
 * Google Visualization API Clientのインスタンスを作成する
 * @param {String} token 【必須】APIアクセストークン
 * @param {Integer} fileId 【任意】スプレッドシートのID
 * @return {VisualizationAPIClient} Google Visualization API Clientのインスタンス
 */
function create(token, fileId) { //eslint-disable-line no-unused-vars
  return new VisualizationAPIClient(token, fileId);
}

/**
 * スプレッドシートのデータをJSON形式で取得する
 * @param {String} sheetName 【必須】シート名
 * @param {Object} options 【任意】オプション
 * @return {String} 処理結果
 */
function getData(sheetName, options) { //eslint-disable-line no-unused-vars
  throw new Error('このメソッドは直接呼び出せません。createメソッドで取得したインスタンスより呼び出してください。');
}
