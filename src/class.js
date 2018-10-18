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

    VisualizationAPIClient.prototype.getData = function (sheetName, query, options) {
      var params = options || {};
      if (sheetName) params['sheet'] = sheetName;
      if (query) params['tq'] = encodeURIComponent(query);

      return this.fetch_(this.createUrlParam_(params));
    };

    VisualizationAPIClient.prototype.getDataObject = function (sheetName, query, options) {
      var params = options || {};
      if (sheetName) params['sheet'] = sheetName;
      if (query) params['tq'] = encodeURIComponent(query);

      var parsedContent = JSON.parse(this.fetch_(this.createUrlParam_(params)));
      var resultObject = [];
      for (var r = 0; r < parsedContent.table.rows.length; r++) {
        var row = {};
        for (var c = 0; c < parsedContent.table.cols.length; c++) {
          //ヘッダ行のラベルがない場合はスキップ
          if (parsedContent.table.cols[c].label == '') {
            continue;
          }
          //値がnullの場合は、空文字を設定
          if (parsedContent.table.rows[r].c[c] == null) {
            row[parsedContent.table.cols[c].label] = '';
            continue;
          }

          switch (parsedContent.table.cols[c].type) {
          case 'date':
          case 'timeofday':
          case 'datetime':
            row[parsedContent.table.cols[c].label] = parsedContent.table.rows[r].c[c].f;
            break;

          default:
            row[parsedContent.table.cols[c].label] = parsedContent.table.rows[r].c[c].v;
            break;
          }
        }
        resultObject.push(row);
      }
      return resultObject;
    };

    VisualizationAPIClient.prototype.getDataArray = function (sheetName, query, options) {
      var params = options || {};
      if (sheetName) params['sheet'] = sheetName;
      if (query) params['tq'] = encodeURIComponent(query);

      var parsedContent = JSON.parse(this.fetch_(this.createUrlParam_(params)));
      var resultArray = [];
      for (var r = 0; r < parsedContent.table.rows.length; r++) {
        var row = [];
        for (var c = 0; c < parsedContent.table.cols.length; c++) {
          //ヘッダ行のラベルがない場合はスキップ
          if (parsedContent.table.cols[c].label == '') {
            continue;
          }
          //値がnullの場合は、空文字を設定
          if (parsedContent.table.rows[r].c[c] == null) {
            row.push('');
            continue;
          }

          switch (parsedContent.table.cols[c].type) {
          case 'date':
          case 'timeofday':
          case 'datetime':
            row.push(parsedContent.table.rows[r].c[c].f);
            break;

          default:
            row.push(parsedContent.table.rows[r].c[c].v);
            break;
          }
        }
        resultArray.push(row);
      }
      return resultArray;
    };

    VisualizationAPIClient.prototype.createUrlParam_ = function (options) {
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
