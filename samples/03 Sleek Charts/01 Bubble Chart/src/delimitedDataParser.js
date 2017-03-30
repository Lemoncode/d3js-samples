/**
 * DISCLAIMER: Yes, you may think, why did this guy implement a parser from
 * scratch when D3 ships wide variety of parsers? Well, the answer is very
 * straightforward: I did not realize until I had the parser finished.
 * TIP: Read documentation before start coding :) Check d3-dsv documentation
 * https://github.com/d3/d3-dsv
 * Anyway, this helped me to do some JS exercise.
 */


/**
 * Module setup variables.
 * @private
 */
let delim = ",";
let lineDelim = "\r\n";
let returnHtmlTable = false;

/**
 * Convert parsed data into a string representing an HTML Table. For testing purposes only.
 * @private
 * @param {array} data        {Object array containing parsed data.}
 * @param {array} fieldNames  {Name of the data fields (headers).}
 * @return {void}
 */
function parseDataToHtmlTable(data, fieldNames) {
  return "<table>" + "<tr>" + fieldNames.reduce((headerAcc, currHeader) => {
    return headerAcc + "<th>" + currHeader + "</th>";
  }, "") + "<tr>" + data.reduce((recordAcc, currentRecord) => {
    return recordAcc + "<tr>" + Object.values(currentRecord).reduce((itemAcc, value) => {
      return itemAcc + "<td>" + value.toLocaleString() + "</td>";
    }, "") + "</tr>";
  }, "") + "</table>";
}

/**
 * It does the real parsing.
 * @private
 * @param  {string} data          {Input data read from url.}
 * @param  {type} successCallback {Callback in case of success.}
 * @param  {type} failCallback    {Callback in case of fail.}
 * @return {void}
 */
function parseData(data, successCallback, failCallback) {
  let lines = data.split(lineDelim);

  // Expect at least, one header and one record.
  if (lines.length >= 2) {

    // Get header items. Those will be our field names.
    const fieldNames = lines.shift().split(delim);
    const numFields = fieldNames.length;
    const propertyNames = fieldNames.map((fieldName) => {
      const propertyName = fieldName.replace(/\s+/g, "");
      return propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    });

    if (numFields > 0) {
      const parsedData = lines.map((line) => {
        return line.split(delim).reduce((record, currentItem, index) => {
          const number = Number.parseFloat(currentItem);
          record[propertyNames[index]] = number ? number : currentItem;
          return record;
        }, {});
      });

      if (returnHtmlTable) {
        successCallback(parsedData, parseDataToHtmlTable(parsedData, fieldNames));
      } else {
        successCallback(parsedData);
      }
      return;
    }
  }

  failCallback("Unexpected format");
}

/**
 * Parse delimited data using native AJAX request.
 * @public
 * @param  {string} url                {Data input URL to be parsed.}
 * @param  {function} successCallback  {Callback in case of success.}
 * @param  {function} failCallback     {Callback in case of fail.}
 * @return {void}
 */
function parse(url, successCallback, failCallback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200) {
      parseData(xhr.responseText, successCallback, failCallback);
    } else if (failCallback) {
      failCallback(`Data request failed with reason: ${xhr.statusText}`);
    }
  };
  xhr.open("GET", url);
  xhr.send(null);
}

/**
* Configure data parser.
* @public
* @param  {string} delimiter [",""]         {OPTIONAL: data delimiter string. Default: ','.}
* @param  {string} lineDelimiter ["\r\n"]   {OPTIONAL: line delimiter string. Default: '\r\n'.}
* @param  {boolean} printTable = [false]    {OPTIONAL: True if you want to print data into HTML table
  and pass it through successCallback. For tests purposes only.}
* @return {void}
*/
function setup(delimiter = delim, lineDelimiter = lineDelim, printTable = returnHtmlTable) {
  delim = delimiter;
  lineDelim = lineDelimiter;
  returnHtmlTable = printTable;
}

export {
  parse,
  setup
};
