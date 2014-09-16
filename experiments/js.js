
$(function() {

  // init graph container
  var $container = jQuery('#graph');

  // set colours and data
  var barcolors       = [ '#B1DEEF', '#E8A5B9', '#CF8F7E', '#FDCC99', '#F7B4A1', '#A2BAC5', '#A8A5A8', '#CF8F7E', '#DD7374'],
      highlightcolor  = '#000',
      legendlabels    = [
        'Revenue Integrity',
        'RI Process Improvement',
        'CMAP',
        'O&D',
        'POS',
        'Airfare Insight',
        'Reprice/Re-issue (ARR)',
        'Channel Shift',
        'Ancillary Sales'
      ],
      dataLow            = [12, 1, 3, 12, 28, 34, 8, 20, 80];
      dataHigh           = [24, 6, 8, 18, 46, 64, 16, 40, 120];

  // get values and total
  var index,
      labelsAndData = [],
      totalLow = 0,
      totalHigh = 0;

  for (index = 0; index < dataLow.length; ++index) {
     labelsAndData.push(legendlabels[index] + ' (L: ' + dataLow[index] + ', H: '+ dataHigh[index] +')');
     totalLow += dataLow[index];
     totalHigh += dataHigh[index];
     $('#legend').append('<li><span class="leg-cir" style="background-color: ' + barcolors[index] +'"></span>' + legendlabels[index] + '<div class="leg-val-cont"><span class="leg-val leg-val-low">' + dataLow[index] + '</span><span class="leg-val leg-val-high">' + dataHigh[index] + '</span></div></li>');
  }

  // get element details and init
  var pheight = parseInt($container.css('height')),
      pwidth  = parseInt($container.css('width')),
      radius  = pwidth < pheight ? pwidth/2.3 : pheight/2.3; // media query could go here
      bgcolor = jQuery('body').css('background-color');

  var paper = new Raphael($container[0], pwidth, pheight);

  // pie position
  var low_pos_x = pwidth/4,
      low_pos_y = pheight/2;

  // pie position
  var high_pos_x = pwidth/1.3,
      high_pos_y = pheight/2;

  // set ul
  $('#legend li').hover(function() {

    var idx = $(this).index();

      // Low pie section animation
    var low_pie = {
      cx : pieLow[0][idx].attrs.path[0][1],
      cy : pieLow[0][idx].attrs.path[0][2]
    }
    pieLow[0][idx].stop();
    pieLow[0][idx].animate({ transform: 's1.1 1.1 ' + low_pie.cx + ' ' + low_pie.cy }, 300, "bounce");
    pieLow[0][idx].animate({ 'opacity': 1 }, 200);
    pieLow[0][idx].animate({ 'stroke-width': 0 }, 500, 'bounce');

    // High pie section animation
    var high_pie = {
      cx : pieHigh[0][idx].attrs.path[0][1],
      cy : pieHigh[0][idx].attrs.path[0][2]
    }
    pieHigh[0][idx].stop();
    pieHigh[0][idx].animate({ transform: 's1.1 1.1 ' + high_pie.cx + ' ' + high_pie.cy }, 300, "bounce");
    pieHigh[0][idx].animate({ 'opacity': 1 }, 200);
    pieHigh[0][idx].animate({ 'stroke-width': 0 }, 500, 'bounce');

    // Center label data: total value
    // center_label_low.attr('text', totalLow);
    // center_label_high.attr('text', totalHigh);

    // Center label data: sevice values
    center_label_low_service.attr('text', dataLow[idx].value);
    center_label_high_service.attr('text', dataHigh[idx].value);

    // service label text
    center_label_low_service_label.attr('text', legendlabels[idx].toUpperCase());
    center_label_high_service_label.attr('text', legendlabels[idx].toUpperCase());

    donut_hole_low.attr({'stroke': pieLow[0][idx].attrs.fill, 'stroke-width': 3});
    donut_hole_high.attr({'stroke': pieHigh[0][idx].attrs.fill, 'stroke-width': 3});

  }, function() {

    var idx = $(this).index();

    // Low pie section animation
    var low_pie = {
      cx : pieLow[0][idx].attrs.path[0][1],
      cy : pieLow[0][idx].attrs.path[0][2]
    }
    pieLow[0][idx].stop();
    pieLow[0][idx].animate({ transform: 's1 1 ' + low_pie.cx + ' ' + low_pie.cy }, 300, "bounce");
    pieLow[0][idx].animate({ 'opacity': 0.7 }, 200);
    pieLow[0][idx].animate({ 'stroke': bgcolor }, 400);

    // High pie section animation
    var high_pie = {
      cx : pieHigh[0][idx].attrs.path[0][1],
      cy : pieHigh[0][idx].attrs.path[0][2]
    }
    pieHigh[0][idx].stop();
    pieHigh[0][idx].animate({ transform: 's1 1 ' + high_pie.cx + ' ' + high_pie.cy }, 300, "bounce");
    pieHigh[0][idx].animate({ 'opacity': 0.7 }, 200);
    pieHigh[0][idx].animate({ 'stroke': bgcolor }, 400);

    // Center label data: total value
    // center_label_low.attr('text', totalLow);
    // center_label_high.attr('text', totalHigh);

    // Center label data: sevice values
    center_label_low_service.attr('text', '');
    center_label_high_service.attr('text', '');

    // service label text
    center_label_low_service_label.attr('text', '');
    center_label_high_service_label.attr('text', '');

    donut_hole_low.attr({'stroke': '#C6C6C6', 'stroke-width': 3});
    donut_hole_high.attr({'stroke': '#C6C6C6', 'stroke-width': 3});

  });

  //***************************************************************************************
  // LOW PIE CHART

  // draw dark ring
  var dark_circle_low = paper.circle(low_pos_x, low_pos_y, radius*1.08);
  dark_circle_low.attr({'fill': '#CCC', 'stroke': '#C6C6C6', 'stroke-width': 3});

  // draw the piechart for low value
  var pieLow = paper.piechart(low_pos_x, low_pos_y, radius, dataLow, {
    stroke: bgcolor,
    strokewidth: 0,
    colors: barcolors,
    minPercent: .1,
    sort: false
  });

  // draw dark inner ring
  var inner_dark_circle = paper.circle(low_pos_x, low_pos_y, radius*0.6);
  inner_dark_circle.attr({'fill': '#CCC', 'stroke': '#CCC'});

  // blank circle in center to create donut hole effect
  var donut_hole_low = paper.circle(low_pos_x, low_pos_y, radius*0.52)
    .attr({'fill': bgcolor, 'stroke': '#C6C6C6', 'stroke-width': 3});

  var center_label_low_label = paper.text(low_pos_x, low_pos_y - 24, 'LOW')
  .attr({'fill': '#999', 'font-size': '14', 'font-weight': 400});

  var center_label_low = paper.text(low_pos_x, low_pos_y, totalLow)
  .attr({'fill': '#666', 'font-size': '24', 'font-weight': 800});

  var center_label_low_service_label = paper.text(low_pos_x, low_pos_y + 24, '')
  .attr({'fill': '#999', 'font-size': '10', 'font-weight': 400});

  var center_label_low_service = paper.text(low_pos_x, low_pos_y + 40, '')
  .attr({'fill': '#333', 'font-size': '20', 'font-weight': 800});


  //***************************************************************************************
  // HIGH PIE CHART

  // draw dark ring
  var dark_circle_high = paper.circle(high_pos_x, high_pos_y, radius*1.08);
  dark_circle_high.attr({'fill': '#CCC', 'stroke': '#C6C6C6', 'stroke-width': 3});

  // draw the piechart for high value
  var pieHigh = paper.piechart(high_pos_x, high_pos_y, radius, dataHigh, {
    stroke: bgcolor,
    strokewidth: 0,
    colors: barcolors,
    minPercent: .1,
    sort: false
  });

  // draw dark inner ring
  var inner_dark_circle_high = paper.circle(high_pos_x, high_pos_y, radius*0.6);
  inner_dark_circle_high.attr({'fill': '#CCC', 'stroke': '#CCC'});

  // blank circle in center to create donut hole effect
  var donut_hole_high = paper.circle(high_pos_x, high_pos_y, radius*0.52)
    .attr({'fill': bgcolor, 'stroke': '#C6C6C6', 'stroke-width': 3});

  var center_label_high_label = paper.text(high_pos_x, high_pos_y - 24, 'HIGH')
  .attr({'fill': '#999', 'font-size': '14', 'font-weight': 400});

  var center_label_high = paper.text(high_pos_x, high_pos_y, totalHigh)
  .attr({'fill': '#666', 'font-size': '24', 'font-weight': 800});

  var center_label_high_service_label = paper.text(high_pos_x, high_pos_y + 24, '')
  .attr({'fill': '#999', 'font-size': '10', 'font-weight': 400});

  var center_label_high_service = paper.text(high_pos_x, high_pos_y + 40, '')
  .attr({'fill': '#333', 'font-size': '20', 'font-weight': 800});

  // Call this to draw and update the chart
  function updateChart(newDataLow, newDataHigh){

    var newPieLow = paper.piechart(low_pos_x, low_pos_y, radius, newDataLow, {
        stroke: bgcolor,
        strokewidth: 0,
        colors: barcolors,
        minPercent: .1,
        sort: false
      });

    var newPieHigh = paper.piechart(high_pos_x, high_pos_y, radius, newDataHigh, {
        stroke: bgcolor,
        strokewidth: 0,
        colors: barcolors,
        minPercent: .1,
        sort: false
      });

    // Section redraws
    newPieLow.each(function() {
        pieLow[0][this.value.order].attr({ path: this.cover.attrs.path });
        // get new low total to print to center
        // get new service values to print to hover buttons
    });
    newPieLow.remove();

    // Section redraws
    newPieHigh.each(function() {
        pieHigh[0][this.value.order].attr({ path: this.cover.attrs.path });
        // get new low total to print to center
        // get new service values to print to hover buttons
    });
    newPieHigh.remove();

    var newTotalLow = 0,
        newTotalHigh = 0;

    // update total
    for (index = 0; index < newDataLow.length; ++index) {
      labelsAndData.push(legendlabels[index] + ' (L: ' + newDataLow[index] + ', H: '+ newDataLow[index] +')');
      newTotalLow += newDataLow[index];
      newTotalHigh += newDataHigh[index];

      var indexedLi = $('#legend li').eq(index);
      indexedLi.find('.leg-val-low').html(newDataLow[index].value);
      indexedLi.find('.leg-val-high').html(newDataHigh[index].value);
      //$('#legend').append('<li><span class="leg-cir" style="background-color: ' + barcolors[index] +'"></span>' + legendlabels[index] + '<div class="leg-val-cont"><span class="leg-val leg-val-low">' + newDataLow[index] + '</span><span class="leg-val leg-val-high">' + newDataHigh[index] + '</span></div></li>');
    }

    // Center label data: total value
    center_label_low.attr('text', newTotalLow);
    center_label_high.attr('text', newTotalHigh);
  };

  $('.rumba').on('click', function() {
    dataLow = [Math.floor((Math.random() * 160) + 1), 1, 3, Math.floor((Math.random() * 160) + 1), 28, 34, Math.floor((Math.random() * 160) + 1), 20, 0];
    dataHigh = [Math.floor((Math.random() * 220) + 1), 6, 8, Math.floor((Math.random() * 360) + 1), 48, 68, Math.floor((Math.random() * 360) + 1), 40, 0];

    updateChart(dataLow, dataHigh);
  });

});