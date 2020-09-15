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

    VisualizationAPIClient.prototype.getRawData = function (sheetId, query, headers, range) {
      if (sheetId === undefined) throw new Error('"sheetId"は必須です');

      var params = {};
      if (sheetId) params['gid']     = sheetId;
      if (query)   params['tq']      = encodeURIComponent(query);
      if (headers) params['headers'] = headers;
      if (range)   params['range']   = range;

      return this.fetch_(this.buildUrlParam_(params));
    };

    VisualizationAPIClient.prototype.getDataConvertedObject = function (sheetId, query, headers, range) {
      if (sheetId === undefined) throw new Error('"sheetId"は必須です');

      var params = {};
      if (sheetId) params['gid'] = sheetId;
      if (query) params['tq'] = encodeURIComponent(query);
      if (headers) params['headers'] = headers;
      if (range) params['range'] = range;

      var parsedContents = JSON.parse(this.fetch_(this.buildUrlParam_(params)));
      return parsedContents.table.rows.map(function (row) {
        var temp = {};
        row.c.forEach(function (column, index) {
          var label = this[index]['label'] || this[index]['id'];
          switch (this[index]['type']) {
          case 'date':
          case 'timeofday':
          case 'datetime':
            temp[label] = column.f;
            break;
          default:
            temp[label] = column.v;
            break;
          }
        }, this);
        return temp;
      }, parsedContents.table.cols);
    };

    VisualizationAPIClient.prototype.getDataConvertedArray = function (sheetId, query, headers, range) {
      if (sheetId === undefined) throw new Error('"sheetId"は必須です');

      var params = {};
      if (sheetId) params['gid'] = sheetId;
      if (query) params['tq'] = encodeURIComponent(query);
      if (headers) params['headers'] = headers;
      if (range) params['range'] = range;

      var parsedContents = JSON.parse(this.fetch_(this.buildUrlParam_(params)));
      return parsedContents.table.rows.map(function (row) {
        return row.c.map(function (column, index) {
          switch (this[index]['type']) {
          case 'date':
          case 'timeofday':
          case 'datetime':
            return column.f;
          default:
            return column.v;
          }
        }, this);
      }, parsedContents.table.cols);
    };

    VisualizationAPIClient.prototype.buildUrlParam_ = function (options) {
      var params = [];
      for (var key in options) {
        params.push(Utilities.formatString('%s=%s', key, options[key]));
      }

      return params.join('&');
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
