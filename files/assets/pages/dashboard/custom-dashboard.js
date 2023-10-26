"use strict";
$(document).ready(function () {
  //   fetch("https://appv.cloud:4000/retensis/getParametersData")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       document.getElementById("volt").innerHTML = data.vAverage + " V";
  //       document.getElementById("current").innerHTML = data.iAverage + " A";
  //       document.getElementById("frequency").innerHTML = data.frequency + " Hz";
  //       document.getElementById("tanki").innerHTML = data.BBM + " Liter";
  //     });

  fetch("https://appv.cloud:4000/retensis/getWitelList")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.witelList.length; i++) {
        let option = document.createElement("option");
        option.text = data.witelList[i].name;
        option.value = data.witelList[i].id;
        witelList.add(option);
      }
    });

  fetch("https://appv.cloud:4000/retensis/getRtuByWitel")
    .then((response) => response.json())
    .then((data) => {
      //   console.log(data);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // Adding 1 to get a 1-based month

      // Get the current year
      const currentYear = currentDate.getFullYear();

      // Calculate the number of days in the current month
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
      const numberOfDaysInMonth = lastDayOfMonth.getDate();

      document.getElementById("hourlyKWHDate").value =
        currentMonth +
        "/" +
        "1" +
        "/" +
        currentYear +
        " " +
        currentMonth +
        "/" +
        numberOfDaysInMonth +
        "/" +
        currentYear;

      //   console.log(document.getElementById("hourlyKWHDate"));
      //   console.log("asldjlkja;sdasdljk;ads;ljkdl;jk");

      //   document.getElementById("select2-rtuList-container").onclick =
      //     setSelectOnClickEvent;
      document.getElementById("rtuList").onchange = getAllData;
      let rtuList = document.getElementById("rtuList");
      let defaultSelected = document.getElementById(
        "select2-rtuList-container"
      );
      defaultSelected.title = "Choose RTU";
      defaultSelected.innerHTML = "Choose RTU";

      for (let i = 0; i < data.witel.length; i++) {
        if (data.witel[i].Rtus.length == 0) {
          continue;
        }
        let optgroup = document.createElement("optgroup");
        optgroup.label = data.witel[i].name;
        rtuList.appendChild(optgroup);

        let optionDefault = document.createElement("option");
        optionDefault.text = "Choose RTU";
        optionDefault.value = "";
        optgroup.appendChild(optionDefault);

        for (let j = 0; j < data.witel[i].Rtus.length; j++) {
          let option = document.createElement("option");
          option.text = data.witel[i].Rtus[j].name;
          option.value = data.witel[i].Rtus[j].id;
          //   option.selected = true;
          optgroup.appendChild(option);
        }
      }

      //add onclick event

      return data;
    });

  function setSelectOnClickEvent() {
    // console.log("lkjsfdalkjsfad;lkjasdf;ljk");
    let select = document.getElementsByClassName("select2-results__options");
    for (let i = 0; i < select.length; i++) {
      console.log(select[i]);
      select[i].onclick = getAllData;
    }
  }
  function getAllData() {
    console.log("sdjklfa;sljfaslk;dfj");
    getHourlyKWH();
    getDailyKWH();
    getMonthlyKWH();
  }

  function getMonthlyKWH(a, b, f) {
    let selectedRtu = document.getElementById("rtuList").value;
    const data = {
      chosenMonth: new Date().getMonth(),
    };
    const headers = {
      "Content-Type": "application/json", // Specify the content type as JSON
      // Add any other headers as needed
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data), // Convert the data to a JSON string
    };
    fetch(
      "https://appv.cloud:4000/retensis/getKWHMonthly/" + selectedRtu,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("kwhMonthly").innerHTML =
          data[0].kwh.toLocaleString() + " kWh";
        document.getElementById("kwhMonthlyIDR").innerHTML =
          "Rp. " + data[0].EstimatedCost.toLocaleString();
      });
  }

  function getHourlyKWH() {
    let selectedRtu = document.getElementById("rtuList").value;
    const data = {
      startDate: document.getElementById("hourlyKWHDate").value.split(" ")[0],
      endDate: document.getElementById("hourlyKWHDate").value.split(" ")[1],
    };
    const headers = {
      "Content-Type": "application/json", // Specify the content type as JSON
      // Add any other headers as needed
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data), // Convert the data to a JSON string
    };
    fetch(
      "https://appv.cloud:4000/retensis/getHourlyPowerData/" + selectedRtu,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        //parameteres data
        document.getElementById("volt").innerHTML =
          data[data.length - 1].vAverage + " V";
        document.getElementById("current").innerHTML =
          data[data.length - 1].iAverage + " A";
        document.getElementById("frequency").innerHTML =
          data[data.length - 1].frequency + " Hz";
        document.getElementById("tanki").innerHTML =
          data[data.length - 1].BBM + " Liter";
        //parameters get kwhmonthly
        data = data.map((datum) => {
          // Your date and time string
          const dateString = datum.year;
          // console.log(fetchTime);
          // Split the string into date and time parts
          const [datePart, timePart] = dateString.split(" ");

          // Split the date and time parts further
          const [year, month, day] = datePart.split(":");
          const [hour, minute, second] = timePart.split(":");

          // Create a Date object
          let parsedDate = new Date(year, month - 1, day, hour, minute, second);
          parsedDate.setHours(parsedDate.getHours() - 8);
          return {
            activePowerTotal: datum.activePowerTotal,
            activePower_R: datum.activePower_R,
            activePower_S: datum.activePower_S,
            activePower_T: datum.activePower_T,
            vAverage: datum.vAverage,
            iAverage: datum.iAverage,
            frequency: datum.frequency,
            BBM: datum.BBM,
            year: parsedDate,
          };
        });
        var amchart = AmCharts.makeChart("sales-analytics", {
          type: "serial",
          theme: "light",
          marginTop: 0,
          marginRight: 0,

          dataProvider: data,
          valueAxes: [
            {
              axisAlpha: 0,
              gridAlpha: 0,
              position: "left",
            },
          ],
          graphs: [
            {
              id: "g1",
              balloonText:
                "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
              bullet: "round",
              bulletSize: 8,
              lineColor: "#26ff00",
              lineThickness: 2,
              negativeLineColor: "#fe9365",
              type: "smoothedLine",
              valueField: "activePowerTotal",
            },
            {
              id: "g2",
              balloonText:
                "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
              bullet: "round",
              bulletSize: 8,
              lineColor: "#fc0303",
              lineThickness: 2,
              negativeLineColor: "#fe9365",
              type: "smoothedLine",
              valueField: "activePower_R",
            },
            {
              id: "g3",
              balloonText:
                "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
              bullet: "round",
              bulletSize: 8,
              lineColor: "#fff700",
              lineThickness: 2,
              negativeLineColor: "#fe9365",
              type: "smoothedLine",
              valueField: "activePower_S",
            },
            {
              id: "g4",
              balloonText:
                "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
              bullet: "round",
              bulletSize: 8,
              lineColor: "#000000",
              lineThickness: 2,
              negativeLineColor: "#fe9365",
              type: "smoothedLine",
              valueField: "activePower_T",
            },
          ],
          chartScrollbar: {
            graph: "g1",
            gridAlpha: 0,
            color: "#888888",
            scrollbarHeight: 55,
            backgroundAlpha: 0,
            selectedBackgroundAlpha: 0.1,
            selectedBackgroundColor: "#888888",
            graphFillAlpha: 0,
            autoGridCount: true,
            selectedGraphFillAlpha: 0,
            graphLineAlpha: 0.2,
            graphLineColor: "#c2c2c2",
            selectedGraphLineColor: "#888888",
            selectedGraphLineAlpha: 1,
          },
          chartCursor: {
            categoryBalloonDateFormat: "YYYY-MM-DD Pukul HH:00",
            cursorAlpha: 0,
            valueLineEnabled: true,
            valueLineBalloonEnabled: true,
            valueLineAlpha: 0.5,
            fullWidth: true,
          },
          dataDateFormat: "YYYY:MM:DD HH:mm:ss",
          categoryField: "year",
          timezone: "Asia/Dubai",
          dateFormatter: {
            timeZoneOffset: -480,
            utc: true,
          },

          categoryAxis: {
            minPeriod: "hh",
            parseDates: true,
            timeZoneOffset: -480,
            utc: true,
            gridAlpha: 0,
            minorGridAlpha: 0,
            minorGridEnabled: true,
          },
          export: {
            enabled: true,
          },
        });
        amchart.addListener("rendered", zoomChart);
        if (amchart.zoomChart) {
          amchart.zoomChart();
        }
        amchart.dateFormatter.utc = true;

        function zoomChart() {
          amchart.zoomToIndexes(
            Math.round(amchart.dataProvider.length * 0.4),
            Math.round(amchart.dataProvider.length * 0.55)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  // var ctx = document.getElementById('update-chart-1').sgetContext("2d");
  // var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: valincome('#fff', [5, 30, 20, 15, 20], '#fff'),
  //     options: valincomebuildoption(),
  // });
  // var ctx = document.getElementById('update-chart-2').getContext("2d");
  // var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: valincome('#fff', [10, 30, 20, 15, 30], '#fff'),
  //     options: valincomebuildoption(),
  // });
  // var ctx = document.getElementById('update-chart-3').getContext("2d");
  // var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: valincome('#fff', [25, 10, 20, 15, 20], '#fff'),
  //     options: valincomebuildoption(),
  // });
  // var ctx = document.getElementById('update-chart-4').getContext("2d");
  // var myChart = new Chart(ctx, {
  //     type: 'bar',
  //     data: valincome('#fff', [25, 30, 20, 15, 10], '#fff'),
  //     options: valincomebuildoption(),
  // });

  document
    .getElementById("dailyKWHDate")
    .addEventListener("input", getDailyKWH);

  function getDailyKWH() {
    let selectedRtu = document.getElementById("rtuList").value;
    console.log(document.getElementById("dailyKWHDate").value);
    const data = {
      targetYear: document.getElementById("dailyKWHDate").value.split("-")[0],
      targetMonth: document.getElementById("dailyKWHDate").value.split("-")[1],
    };
    console.log(data);
    const headers = {
      "Content-Type": "application/json", // Specify the content type as JSON
      // Add any other headers as needed
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data), // Convert the data to a JSON string
    };
    fetch(
      "https://appv.cloud:4000/retensis/getKWHDaily/" + selectedRtu,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var amchart = AmCharts.makeChart("active-power-analytics", {
          type: "serial",
          theme: "light",
          marginTop: 0,
          marginRight: 0,
          dataProvider: data,
          valueAxes: [
            {
              axisAlpha: 0,
              gridAlpha: 0,
              position: "left",
            },
          ],
          graphs: [
            {
              id: "g1",
              balloonText:
                "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
              bullet: "round",
              bulletSize: 8,
              lineColor: "#26ff00",
              lineThickness: 2,
              negativeLineColor: "#fe9365",
              type: "smoothedLine",
              valueField: "averageValue",
            },
          ],
          chartScrollbar: {
            graph: "g1",
            gridAlpha: 0,
            color: "#888888",
            scrollbarHeight: 55,
            backgroundAlpha: 0,
            selectedBackgroundAlpha: 0.1,
            selectedBackgroundColor: "#888888",
            graphFillAlpha: 0,
            autoGridCount: true,
            selectedGraphFillAlpha: 0,
            graphLineAlpha: 0.2,
            graphLineColor: "#c2c2c2",
            selectedGraphLineColor: "#888888",
            selectedGraphLineAlpha: 1,
          },
          chartCursor: {
            categoryBalloonDateFormat: "YYYY-MM-DD",
            cursorAlpha: 0,
            valueLineEnabled: true,
            valueLineBalloonEnabled: true,
            valueLineAlpha: 0.5,
            fullWidth: true,
          },
          dataDateFormat: "YYYY-MM-DD",
          categoryField: "date",
          categoryAxis: {
            minPeriod: "hh",
            parseDates: true,
            gridAlpha: 0,
            minorGridAlpha: 0,
            minorGridEnabled: true,
          },
          export: {
            enabled: true,
          },
        });
        amchart.addListener("rendered", zoomChart);
        if (amchart.zoomChart) {
          amchart.zoomChart();
        }

        function zoomChart() {
          amchart.zoomToIndexes(
            Math.round(amchart.dataProvider.length * 0.4),
            Math.round(amchart.dataProvider.length * 0.55)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function valincomebuildoption() {
    return {
      maintainAspectRatio: false,
      title: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      hover: {
        mode: "index",
      },
      scales: {
        xAxes: [
          {
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: false,
            scaleLabel: {
              display: true,
              labelString: "Value",
            },
            ticks: {
              min: 1,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 4,
          borderWidth: 12,
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 0,
          top: 15,
          bottom: 0,
        },
      },
    };
  }

  $(function () {});

  $(function () {});
});
