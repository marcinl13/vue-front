export function serverGet(
  _url,
  _data,
  _headers,
  _dataType = "json",
  _type = "GET"
) {
  var result = null;
  $.ajax({
    url: _url,
    type: _type,
    data: _data,
    headers: _headers,
    dataType: _dataType,
    async: false,
    success: function(data) {
      result = data;
    }
  });
  return result;
}
