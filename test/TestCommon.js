TestCommon = function () {
  var properties = PropertiesService.getUserProperties();
  this.fileId = properties.getProperty('FILE_ID');
};

TestCommon.prototype.getFile = function () {
  return SpreadsheetApp.openById(this.fileId);
};

TestCommon.prototype.getClient = function () {
  this.client = new VisualizationAPIClient(ScriptApp.getOAuthToken(), this.fileId);
};
