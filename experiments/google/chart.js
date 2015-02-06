google.setOnLoadCallback(drawChart);
function drawChart() {

    var data = google.visualization.arrayToDataTable([
        ['Effort', 'Amount given'],
        ['Revenue integrity',     3],
        ['Revenue Integrity Process Improvement',     0],
        ['Weight and Balance',     1],
        ['Origin and Destination',     1],
        ['Point of Sale',     0],
        ['ARR',     67],
        ['Airfare Insight',     1],
        ['Channel Shift',     0],
        ['Ancillary Sales',     1]
    ]);

    var options = {
        pieHole: 0.5,
        pieSliceTextStyle: {
            color: 'black'
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
    chart.draw(data, options);
}