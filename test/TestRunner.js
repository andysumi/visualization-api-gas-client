function TestRunner() { // eslint-disable-line no-unused-vars
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText());
  } // Class GasTap is ready for use now!

  var test = new GasTap();
  var common = new TestCommon();

  try {
    /***** Test cases ******************************/
    testCreate_(test, common);
    testGetRawData_(test, common);
    testGetDataConvertedObject_(test, common);
    testGetDataConvertedArray_(test, common);
    /***********************************************/
  } catch (err) {
    test('Exception occurred', function f(assert) {
      Logger.log(err);
      assert.fail(err);
    });
  }

  test.finish();

  return {
    successd: test.totalSucceed(),
    failed: test.totalFailed(),
    skipped: test.totalSkipped(),
    log: Logger.getLog()
  };
}

function testCreate_(test, common) {
  var token = ScriptApp.getOAuthToken();
  var fileId = common.getFile().getId();

  test('create() - 正常系', function (t) {
    var result = new VisualizationAPIClient(token, fileId);
    t.equal(result.apiUrl, Utilities.formatString('https://docs.google.com/spreadsheets/d/%s/gviz/tq?', fileId), '"apiUrl"が正しいこと');
    t.deepEqual(result.headers, { Authorization: 'Bearer ' + token }, '"headers"が正しいこと');
  });

  test('create() - 異常系', function (t) {
    t.throws(function () { return new VisualizationAPIClient(); }, '"token"を指定していない場合はエラー');
    t.throws(function () { return new VisualizationAPIClient(token); }, '"fileId"を指定していない場合はエラー');
  });
}

function testGetRawData_(test, common) {
  var client = common.getClient();
  var sheet = common.getSheet();
  var columns = common.getColumns();

  test('getRawData() - query指定なし', function (t) {
    var result = JSON.parse(client.getRawData(sheet.getSheetId()));
    t.equal(result.status, 'ok', '"status"が正しいこと');
    t.deepEqual(result.table.cols, columns, '"table.cols"が正しいこと');
    t.equal(result.table.rows.length, 47, '取得したデータの件数が正しいこと');
  });

  test('getRawData() - query指定あり', function (t) {
    var query = 'SELECT * WHERE C >= 5000000 ORDER BY C';
    var result = JSON.parse(client.getRawData(sheet.getSheetId(), query, 1));
    t.equal(result.status, 'ok', '"status"が正しいこと');
    t.deepEqual(result.table.cols, columns, '"table.cols"が正しいこと');
    t.equal(result.table.rows.length, 9, '取得したデータの件数が正しいこと');
  });

  test('getRawData() - 異常系', function (t) {
    t.throws(function () { client.getRawData(); }, '"sheetId"を指定していない場合はエラー');
  });
}

function testGetDataConvertedObject_(test, common) {
  var client = common.getClient();
  var sheet = common.getSheet();
  var columns = common.getColumns();

  test('getDataConvertedObject() - query指定なし', function (t) {
    var result = client.getDataConvertedObject(sheet.getSheetId());
    t.equal(result.length, 47, '取得したデータの件数が正しいこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[0].label), '"都道府県"を含むこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[1].label), '"人口(平成22年)"を含むこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[2].label), '"人口(平成27年)"を含むこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[3].label), '"人口増加率"を含むこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[4].label), '"データなし"を含むこと');
    t.ok(Object.prototype.hasOwnProperty.call(result[0], columns[4].label), '"更新日"を含むこと');
  });

  test('getDataConvertedObject() - query指定あり', function (t) {
    var query = 'SELECT * WHERE A = \'北海道\'';
    var result = client.getDataConvertedObject(sheet.getSheetId(), query, 1);
    t.equal(result.length, 1, '取得したデータの件数が正しいこと');
    t.equal(result[0][columns[0].label], '北海道', '"都道府県"が正しいこと');
    t.equal(result[0][columns[1].label], 5506000, '"人口(平成22年)"が正しいこと');
    t.equal(result[0][columns[2].label], 5382000, '"人口(平成27年)"が正しいこと');
    t.equal(result[0][columns[3].label], -0.022520886305848142, '"人口増加率"が正しいこと');
    t.equal(result[0][columns[4].label], null, '"データなし"が正しいこと');
    t.equal(result[0][columns[5].label], '2020/09/15 0:00:00', '"更新日"が正しいこと');
  });

  test('getDataConvertedObject() - 異常系', function (t) {
    t.throws(function () { client.getDataConvertedObject(); }, '"sheetId"を指定していない場合はエラー');
  });
}

function testGetDataConvertedArray_(test, common) {
  var client = common.getClient();
  var sheet = common.getSheet();
  var columns = common.getColumns();

  test('getDataConvertedArray() - query指定なし', function (t) {
    var result = client.getDataConvertedArray(sheet.getSheetId());
    t.equal(result.length, 47, '取得したデータの件数が正しいこと');
    t.equal(result[0].length, columns.length, 'ヘッダーの項目数が正しいこと');
  });

  test('getDataConvertedArray() - query指定あり', function (t) {
    var query = 'SELECT * WHERE F >= datetime \'2020-09-16 00:00:00\'';
    var result = client.getDataConvertedArray(sheet.getSheetId(), query, 1);
    t.equal(result.length, 1, '取得したデータの件数が正しいこと');
    t.equal(result[0][0], '沖縄', '"都道府県"が正しいこと');
    t.equal(result[0][1], 1393000, '"人口(平成22年)"が正しいこと');
    t.equal(result[0][2], 1434000, '"人口(平成27年)"が正しいこと');
    t.equal(result[0][3], 0.02943287867910982, '"人口増加率"が正しいこと');
    t.equal(result[0][4], null, '"データなし"が正しいこと');
    t.equal(result[0][5], '2020/09/16 7:47:40', '"更新日"が正しいこと');
  });

  test('getDataConvertedArray() - 異常系', function (t) {
    t.throws(function () { client.getDataConvertedArray(); }, '"sheetId"を指定していない場合はエラー');
  });
}
