TestCommon = function () {
  var properties = PropertiesService.getUserProperties();
  var FILE_ID = properties.getProperty('FILE_ID');

  this.file_ = SpreadsheetApp.openById(FILE_ID);
  this.sheet_ = this.file_.getSheetByName('sheet1');
  this.columns_ = [
    { id: 'A', label: '都道府県',       type: 'string' },
    { id: 'B', label: '人口(平成22年)', type: 'number',   pattern: '#,##0' },
    { id: 'C', label: '人口(平成27年)', type: 'number',   pattern: '#,##0' },
    { id: 'D', label: '人口増加率',     type: 'number',   pattern: '0.00%' },
    { id: 'E', label: 'データなし',     type: 'string' },
    { id: 'F', label: '更新日',         type: 'datetime', pattern: 'yyyy/MM/dd H:mm:ss' }
  ];

  this.client = new VisualizationAPIClient(ScriptApp.getOAuthToken(), this.file_.getId());
};

TestCommon.prototype.getFile = function () {
  return this.file_;
};

TestCommon.prototype.getSheet = function () {
  return this.sheet_;
};

TestCommon.prototype.getColumns = function () {
  return this.columns_;
};

TestCommon.prototype.getClient = function () {
  return this.client;
};
