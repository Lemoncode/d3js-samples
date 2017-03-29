import * as Parser from "./delimitedDataParser";
import * as BubbleChart from "./bubbleChart";


function initializeChart() {
  Parser.setup("\t", "\r\n", true);
  Parser.parse("./data.txt",
    (parsedData, htmlTable) => {
      document.getElementById("id-data-table").innerHTML = htmlTable;
      BubbleChart.initialize(parsedData, "id-bubble-chart");
    },
    (message) => {
      document.getElementById("id-data-table").innerHTML = message;
    });
}

initializeChart();
