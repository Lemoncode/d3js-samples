import * as Parser from "./delimitedDataParser";
import * as BubbleChart from "./bubbleChart";


function initializeChart() {
  Parser.setup("\t", "\r\n", true);
  Parser.parse("./data.txt",
    (parsedData, htmlTable) => {
      document.getElementById("id-data-table").innerHTML = 
      `<h2 class="flex-item">Data Source</h2>
      ${htmlTable}`;
      BubbleChart.initialize(parsedData, "id-bubble-chart");
      BubbleChart.draw();
      window.addEventListener("resize", BubbleChart.draw);
    },
    (message) => {
      document.getElementById("id-data-table").innerHTML = message;
    });
}

initializeChart();
