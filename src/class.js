(function (global) {
  var VisualizationAPIClient = (function () {

    function VisualizationAPIClient(token, fileId) {
      this.apiUrl = Utilities.formatString('https://docs.google.com/spreadsheets/d/%s/gviz/tq?',fileId);
      this.headers = {
        Authorization: 'Bearer ' + token
      };

      if (!token) throw new Error('"token"は必須です');
      if (!fileId) throw new Error('"fileId"は必須です');
    }

    VisualizationAPIClient.prototype.getData = function (sheetName, options) {
      var params = [];
      options['sheet'] = sheetName;
      for (var key in options) {
        params.push(Utilities.formatString('%s=%s', key, options[key]));
      }
      return this.fetch_(params.join('&'));
    };

    VisualizationAPIClient.prototype.fetch_ = function (endPoint) {
      var url = this.apiUrl + endPoint;
      var response = UrlFetchApp.fetch(url, {
        method: 'get',
        muteHttpExceptions: true,
        contentType: 'application/json',
        headers: this.headers
      });

      var contents = response.getContentText();
      var result = contents.match(/google.visualization.Query.setResponse\((.*)\);/);
      if (result == null) {
        throw new Error(contents);
      }

      return result[1];
    };

    return VisualizationAPIClient;
  })();

  return global.VisualizationAPIClient = VisualizationAPIClient;
})(this);
