/**
 * Google Visualization API Clientのインスタンスを作成する
 * @param {string} token 【必須】APIアクセストークン
 * @param {string} fileId 【必須】スプレッドシートのID
 * @return {Object} Google Visualization API Clientのインスタンス
 */
function create(token, fileId) { //eslint-disable-line no-unused-vars
  return new VisualizationAPIClient(token, fileId);
}

/**
 * スプレッドシートのデータをJSON形式で取得する
 * @param {number} sheetId 【必須】シートID
 * @param {string} query 【任意】クエリ
 * @param {number} headers 【任意】ヘッダーの行数
 * @param {string} range 【任意】データの範囲 ex.A1:B10、A:B、1:2 etc
 * @return {string} 処理結果
 */
function getRawData(sheetId, query, headers, range) { //eslint-disable-line no-unused-vars
  throw new Error('このメソッドは直接呼び出せません。createメソッドで取得したインスタンスより呼び出してください。');
}

/**
 * スプレッドシートのデータをObject形式で取得する
 * @param {number} sheetId 【必須】シートID
 * @param {string} query 【任意】クエリ
 * @param {number} headers 【任意】ヘッダーの行数
 * @param {string} range 【任意】データの範囲 ex.A1:B10、A:B、1:2 etc
 * @return {Object} 処理結果
 */
function getDataConvertedObject(sheetId, query, headers, range) { //eslint-disable-line no-unused-vars
  throw new Error('このメソッドは直接呼び出せません。createメソッドで取得したインスタンスより呼び出してください。');
}

/**
 * スプレッドシートのデータを二次元配列形式で取得する
 * @param {number} sheetId 【必須】シートID
 * @param {string} query 【任意】クエリ
 * @param {number} headers 【任意】ヘッダーの行数
 * @param {string} range 【任意】データの範囲 ex.A1:B10、A:B、1:2 etc
 * @return {Array} 処理結果
 */
function getDataConvertedArray(sheetId, query, headers, range) { //eslint-disable-line no-unused-vars
  throw new Error('このメソッドは直接呼び出せません。createメソッドで取得したインスタンスより呼び出してください。');
}
