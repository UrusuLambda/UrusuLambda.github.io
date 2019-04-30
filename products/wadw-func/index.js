$(document).ready(function(){

	var chart = new CanvasJS.Chart("chartContainer", {
		title: {
		    text: "House Median Price"
		},
		axisX: {
		    valueFormatString: "MMM YYYY"
		},
		axisY2: {
		    title: "Median List Price",
		    prefix: "$",
		    suffix: "K"
		},
		toolTip: {
		    shared: true
		},
		legend: {
		    cursor: "pointer",
		    verticalAlign: "top",
		    horizontalAlign: "center",
		    dockInsidePlotArea: true,
		    itemclick: toogleDataSeries
		},
		data: [{
			type:"line",
			axisYType: "secondary",
			name: "San Fransisco",
			showInLegend: true,
			markerSize: 0,
			yValueFormatString: "$#,###k",
			dataPoints: [
	{ x: new Date(2014, 00, 01), y: 850 },
	{ x: new Date(2014, 01, 01), y: 889 },
	{ x: new Date(2014, 02, 01), y: 890 },
	{ x: new Date(2014, 03, 01), y: 899 },
	{ x: new Date(2014, 04, 01), y: 903 },
	{ x: new Date(2014, 05, 01), y: 925 },
	{ x: new Date(2014, 06, 01), y: 899 },
	{ x: new Date(2014, 07, 01), y: 875 },
	{ x: new Date(2014, 08, 01), y: 927 },
	{ x: new Date(2014, 09, 01), y: 949 },
	{ x: new Date(2014, 10, 01), y: 946 },
	{ x: new Date(2014, 11, 01), y: 927 },
	{ x: new Date(2015, 00, 01), y: 950 },
	{ x: new Date(2015, 01, 01), y: 998 },
	{ x: new Date(2015, 02, 01), y: 998 },
	{ x: new Date(2015, 03, 01), y: 1050 },
	{ x: new Date(2015, 04, 01), y: 1050 },
	{ x: new Date(2015, 05, 01), y: 999 },
	{ x: new Date(2015, 06, 01), y: 998 },
	{ x: new Date(2015, 07, 01), y: 998 },
	{ x: new Date(2015, 08, 01), y: 1050 },
	{ x: new Date(2015, 09, 01), y: 1070 },
	{ x: new Date(2015, 10, 01), y: 1050 },
	{ x: new Date(2015, 11, 01), y: 1050 },
	{ x: new Date(2016, 00, 01), y: 995 },
	{ x: new Date(2016, 01, 01), y: 1090 },
	{ x: new Date(2016, 02, 01), y: 1100 },
	{ x: new Date(2016, 03, 01), y: 1150 },
	{ x: new Date(2016, 04, 01), y: 1150 },
	{ x: new Date(2016, 05, 01), y: 1150 },
	{ x: new Date(2016, 06, 01), y: 1100 },
	{ x: new Date(2016, 07, 01), y: 1100 },
	{ x: new Date(2016, 08, 01), y: 1150 },
	{ x: new Date(2016, 09, 01), y: 1170 },
	{ x: new Date(2016, 10, 01), y: 1150 },
	{ x: new Date(2016, 11, 01), y: 1150 },
	{ x: new Date(2017, 00, 01), y: 1150 },
	{ x: new Date(2017, 01, 01), y: 1200 },
	{ x: new Date(2017, 02, 01), y: 1200 },
	{ x: new Date(2017, 03, 01), y: 1200 },
	{ x: new Date(2017, 04, 01), y: 1190 },
	{ x: new Date(2017, 05, 01), y: 1170 }
]
		    },
	{
	    type: "line",
	    axisYType: "secondary",
	    name: "Manhattan",
	    showInLegend: true,
	    markerSize: 0,
	    yValueFormatString: "$#,###k",
	    dataPoints: [
	{ x: new Date(2014, 00, 01), y: 1200 },
	{ x: new Date(2014, 01, 01), y: 1200 },
	{ x: new Date(2014, 02, 01), y: 1190 },
	{ x: new Date(2014, 03, 01), y: 1180 },
	{ x: new Date(2014, 04, 01), y: 1250 },
	{ x: new Date(2014, 05, 01), y: 1270 },
	{ x: new Date(2014, 06, 01), y: 1300 },
	{ x: new Date(2014, 07, 01), y: 1300 },
	{ x: new Date(2014, 08, 01), y: 1358 },
	{ x: new Date(2014, 09, 01), y: 1410 },
	{ x: new Date(2014, 10, 01), y: 1480 },
	{ x: new Date(2014, 11, 01), y: 1500 },
	{ x: new Date(2015, 00, 01), y: 1500 },
	{ x: new Date(2015, 01, 01), y: 1550 },
	{ x: new Date(2015, 02, 01), y: 1550 },
	{ x: new Date(2015, 03, 01), y: 1590 },
	{ x: new Date(2015, 04, 01), y: 1600 },
	{ x: new Date(2015, 05, 01), y: 1590 },
	{ x: new Date(2015, 06, 01), y: 1590 },
	{ x: new Date(2015, 07, 01), y: 1620 },
	{ x: new Date(2015, 08, 01), y: 1670 },
	{ x: new Date(2015, 09, 01), y: 1720 },
	{ x: new Date(2015, 10, 01), y: 1750 },
	{ x: new Date(2015, 11, 01), y: 1820 },
	{ x: new Date(2016, 00, 01), y: 2000 },
	{ x: new Date(2016, 01, 01), y: 1920 },
	{ x: new Date(2016, 02, 01), y: 1750 },
	{ x: new Date(2016, 03, 01), y: 1850 },
	{ x: new Date(2016, 04, 01), y: 1750 },
	{ x: new Date(2016, 05, 01), y: 1730 },
	{ x: new Date(2016, 06, 01), y: 1700 },
	{ x: new Date(2016, 07, 01), y: 1730 },
	{ x: new Date(2016, 08, 01), y: 1720 },
	{ x: new Date(2016, 09, 01), y: 1740 },
	{ x: new Date(2016, 10, 01), y: 1750 },
	{ x: new Date(2016, 11, 01), y: 1750 },
	{ x: new Date(2017, 00, 01), y: 1750 },
	{ x: new Date(2017, 01, 01), y: 1770 },
	{ x: new Date(2017, 02, 01), y: 1750 },
	{ x: new Date(2017, 03, 01), y: 1750 },
	{ x: new Date(2017, 04, 01), y: 1730 },
	{ x: new Date(2017, 05, 01), y: 1730 }
]
	},
	{
	    type: "line",
	    axisYType: "secondary",
	    name: "Seatle",
	    showInLegend: true,
	    markerSize: 0,
	    yValueFormatString: "$#,###k",
	    dataPoints: [
	{ x: new Date(2014, 00, 01), y: 409 },
	{ x: new Date(2014, 01, 01), y: 415 },
	{ x: new Date(2014, 02, 01), y: 419 },
	{ x: new Date(2014, 03, 01), y: 429 },
	{ x: new Date(2014, 04, 01), y: 429 },
	{ x: new Date(2014, 05, 01), y: 450 },
	{ x: new Date(2014, 06, 01), y: 450 },
	{ x: new Date(2014, 07, 01), y: 445 },
	{ x: new Date(2014, 08, 01), y: 450 },
	{ x: new Date(2014, 09, 01), y: 450 },
	{ x: new Date(2014, 10, 01), y: 440 },
	{ x: new Date(2014, 11, 01), y: 429 },
	{ x: new Date(2015, 00, 01), y: 435 },
	{ x: new Date(2015, 01, 01), y: 450 },
	{ x: new Date(2015, 02, 01), y: 475 },
	{ x: new Date(2015, 03, 01), y: 475 },
	{ x: new Date(2015, 04, 01), y: 475 },
	{ x: new Date(2015, 05, 01), y: 489 },
	{ x: new Date(2015, 06, 01), y: 495 },
	{ x: new Date(2015, 07, 01), y: 495 },
	{ x: new Date(2015, 08, 01), y: 500 },
	{ x: new Date(2015, 09, 01), y: 508 },
	{ x: new Date(2015, 10, 01), y: 520 },
	{ x: new Date(2015, 11, 01), y: 525 },
	{ x: new Date(2016, 00, 01), y: 525 },
	{ x: new Date(2016, 01, 01), y: 529 },
	{ x: new Date(2016, 02, 01), y: 549 },
	{ x: new Date(2016, 03, 01), y: 550 },
	{ x: new Date(2016, 04, 01), y: 568 },
	{ x: new Date(2016, 05, 01), y: 575 },
	{ x: new Date(2016, 06, 01), y: 579 },
	{ x: new Date(2016, 07, 01), y: 575 },
	{ x: new Date(2016, 08, 01), y: 585 },
	{ x: new Date(2016, 09, 01), y: 589 },
	{ x: new Date(2016, 10, 01), y: 595 },
	{ x: new Date(2016, 11, 01), y: 595 },
	{ x: new Date(2017, 00, 01), y: 595 },
	{ x: new Date(2017, 01, 01), y: 600 },
	{ x: new Date(2017, 02, 01), y: 624 },
	{ x: new Date(2017, 03, 01), y: 635 },
	{ x: new Date(2017, 04, 01), y: 650 },
	{ x: new Date(2017, 05, 01), y: 675 }
]
	},
	{
	    type: "line",
	    axisYType: "secondary",
	    name: "Los Angeles",
	    showInLegend: true,
	    markerSize: 0,
	    yValueFormatString: "$#,###k",
	    dataPoints: [
	{ x: new Date(2014, 06, 01), y: 589 },
	{ x: new Date(2014, 07, 01), y: 579 },
	{ x: new Date(2014, 08, 01), y: 579 },
	{ x: new Date(2014, 09, 01), y: 579 },
	{ x: new Date(2014, 10, 01), y: 569 },
	{ x: new Date(2014, 11, 01), y: 525 },
	{ x: new Date(2015, 00, 01), y: 535 },
	{ x: new Date(2015, 01, 01), y: 575 },
	{ x: new Date(2015, 02, 01), y: 599 },
	{ x: new Date(2015, 03, 01), y: 619 },
	{ x: new Date(2015, 04, 01), y: 639 },
	{ x: new Date(2015, 05, 01), y: 648 },
	{ x: new Date(2015, 06, 01), y: 640 },
	{ x: new Date(2015, 07, 01), y: 645 },
	{ x: new Date(2015, 08, 01), y: 648 },
	{ x: new Date(2015, 09, 01), y: 649 },
	{ x: new Date(2015, 10, 01), y: 649 },
	{ x: new Date(2015, 11, 01), y: 649 },
	{ x: new Date(2016, 00, 01), y: 650 },
	{ x: new Date(2016, 01, 01), y: 665 },
	{ x: new Date(2016, 02, 01), y: 675 },
	{ x: new Date(2016, 03, 01), y: 695 },
	{ x: new Date(2016, 04, 01), y: 690 },
	{ x: new Date(2016, 05, 01), y: 699 },
	{ x: new Date(2016, 06, 01), y: 699 },
	{ x: new Date(2016, 07, 01), y: 699 },
	{ x: new Date(2016, 08, 01), y: 699 },
	{ x: new Date(2016, 09, 01), y: 699 },
	{ x: new Date(2016, 10, 01), y: 709 },
	{ x: new Date(2016, 11, 01), y: 699 },
	{ x: new Date(2017, 00, 01), y: 700 },
	{ x: new Date(2017, 01, 01), y: 700 },
	{ x: new Date(2017, 02, 01), y: 724 },
	{ x: new Date(2017, 03, 01), y: 739 },
	{ x: new Date(2017, 04, 01), y: 749 },
	{ x: new Date(2017, 05, 01), y: 740 }
			 ]
	}
		    ]
	    });
	chart.render();
	
	function toogleDataSeries(e){
	    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	    } else{
		e.dataSeries.visible = true;
	    }
	    chart.render();
	}
	
    });
    
	  // Themes begin
	/*
	  am4core.useTheme(am4themes_animated);
	  // Themes end
	
	    
	  // Add data
	  
	  var chartData1 = [{
		  "pay":  new Date(2018, 6, 20),
		  "value": 50
	      }, {
		  "pay":  new Date(2018, 7, 20),
		  "value": 50
	      }, {
		  "pay":  new Date(2018, 8, 20),
		  "value": 50
	      }, {
		  "pay":  new Date(2018, 9, 20),
		  "value": 80
	      }, {
		  "pay": new Date(2018, 10, 20),
		  "value": 100
	      }, {
		  "pay":  new Date(2018, 11, 20),
		  "value": 120
	      }];
	  
	  var chartData2 = [{
		  "pay":  new Date(2018, 6, 20),
		  "value": 150
	      }, {
		  "pay":  new Date(2018, 7, 20),
		  "value": 90
	      }, {
		  "pay":  new Date(2018, 8, 20),
		  "value": 150
	      }, {
		  "pay":  new Date(2018, 9, 20),
		  "value": 20
	      }, {
		  "pay":  new Date(2018, 10, 20),
		  "value": 20
	      }, {
		  "pay":  new Date(2018, 11, 20),
		  "value": 100
	      }];

	  var chart = AmCharts.makeChart( "chartdiv", {
		  "type": "stock",
		  "theme": "light",
		  "dataSets": [ {
			  "title": "first data set",
			  "fieldMappings": [ {
				  "fromField": "value",
				  "toField": "value"
			      }, {
				  "fromField": "volume",
				  "toField": "volume"
			      } ],
			  "dataProvider": chartData1,
			  "categoryField": "pay",
			  "compareField": "value",
		      }, {
			  "title": "second data set",
			  "fieldMappings": [ {
				  "fromField": "value",
				  "toField": "value"
			      }, {
				  "fromField": "volume",
				  "toField": "volume"
			      } ],
			  "dataProvider": chartData2,
			  "categoryField": "pay",
			  "compareField": "value",
			  "compared": true
		      }
		      ],

		  /*
		  "graphs": [ {
			  //"bullet": "circle",
			  //"bulletSize": 8,
			  "lineAlpha": 1,
			  "lineThickness": 2,
			  "fillAlphas": 0,
			  "xField": "pay",
			  "yField": "value",
			  } ],
		  * /
 
		  "panels": [ {
	
			  recalculateToPercents:"never",
			  "showCategoryAxis": false,
			  "title": "Value",
			  //"percentHeight": 70,
			  "stockGraphs": [ {
				  "id": "g1",
				  "valueField": "value",
				  "comparable": true,
				  "compareField": "value",
				  "balloonText": "[[title]]:<b>[[value]]</b>",
				  "compareGraphBalloonText": "[[title]]:<b>[[value]]</b>"
			      } ],
			  "stockLegend": {
			      "periodValueTextComparing": "[[percents.value.close]]%",
			      "periodValueTextRegular": "[[value.close]]"
			  }
		      }],
	      } );

	  console.log(chart);

	  console.log("Don't look here :)");

	  $(".add-btn").on("click", function(e){
		  console.log("add btn");
		  var newChartData = chartData;

		  newChartData.push({"pay":1800, "value":30});

		  newChartData.sort(function(a,b){
			  if(a.pay<b.pay) return -1;
			  if(a.pay > b.pay) return 1;
			  return 0;
		      });
		
		  //Setting the new data to the graph
		  chart.dataProvider = newChartData;
		
		  //Updating the graph to show the new data
		  chart.validateData();
	      });
	*/      
