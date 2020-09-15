function TestRunner() { // eslint-disable-line no-unused-vars
  if ((typeof GasTap) === 'undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/zixia/gast/master/src/gas-tap-lib.js').getContentText());
  } // Class GasTap is ready for use now!

  var test = new GasTap();
  var common = new TestCommon();

  try {
    /***** Test cases ******************************/
    testCreate_(test, common);
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

  test('create() - 正常系', function (t) {
    t.throws(function () { return new VisualizationAPIClient(); }, '"token"を指定していない場合はエラー');
    t.throws(function () { return new VisualizationAPIClient(token); }, '"fileId"を指定していない場合はエラー');
  });
}
