function TestRunner() { // eslint-disable-line no-unused-vars
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText());
  } // Class GasTap is ready for use now!

  var test = new GasTap();
  var common = new TestCommon();

  try {
    /***** Test cases ******************************/
    testCreate_(test, common);
    testGetDataJson_(test, common);
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

function testGetDataJson_(test, common) {
  var client = common.getClient();
  var sheet = common.getSheet();
  var columns = common.getColumns();

  test('getDataJson() - query指定なし', function (t) {
    var result = JSON.parse(client.getDataJson(sheet.getSheetId()));
    t.equal(result.status, 'ok', '"status"が正しいこと');
    t.deepEqual(result.table.cols, columns, '"table.cols"が正しいこと');
    t.equal(result.table.rows.length, 47, '取得したデータの件数が正しいこと');
  });

  test('getDataJson() - query指定あり', function (t) {
    var query = 'SELECT * WHERE C >= 5000000 ORDER BY C';
    var result = JSON.parse(client.getDataJson(sheet.getSheetId(), query, 1));
    t.equal(result.status, 'ok', '"status"が正しいこと');
    t.deepEqual(result.table.cols, columns, '"table.cols"が正しいこと');
    t.equal(result.table.rows.length, 9, '取得したデータの件数が正しいこと');
  });

  test('getDataJson() - 異常系', function (t) {
    t.throws(function () { client.getDataJson(); }, '"sheetId"を指定していない場合はエラー');
  });
}
