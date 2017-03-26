import * as Parser from "./delimitedDataParser";
import * as BubbleChart from "./bubbleChart";


function initializeChart() {
  Parser.setup("\t", "\r\n", true);
  Parser.parse("./data.txt",
    (parsedData, htmlTable) => {
      document.getElementById("dataTable").innerHTML = htmlTable;
      BubbleChart.initialize(parsedData, "bubbleChart");
    },
    (message) => {
      document.getElementById("dataTable").innerHTML = message;
    });
}

initializeChart();
