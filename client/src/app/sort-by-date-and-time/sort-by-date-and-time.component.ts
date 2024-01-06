import {Component, OnInit, ViewChild} from '@angular/core';
import {LogServiceService} from "../service/log-service.service";
import {LogResponse} from "../entity/model";
import {EChartsOption} from "echarts";
import * as echarts from 'echarts';
// @ts-ignore
import * as worldMap from "src/assets/globalMap/custom.geo.json";

export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  title: any;
  plotOptions: any;
};


@Component({
  selector: 'app-sort-by-date-and-time',
  templateUrl: './sort-by-date-and-time.component.html',
  styleUrls: ['./sort-by-date-and-time.component.css']
})
export class SortByDateAndTimeComponent implements OnInit {

  option!: EChartsOption;

  data!: any;

  mapOption: EChartsOption = {};

  pieOption: EChartsOption = {};

  barOption:EChartsOption={};

  @ViewChild("chart") chart: any;
  public chartOptions!: Partial<ChartOptions>;

  ngOnInit(): void {
    this.fetchData();


    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "heatmap"
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              {
                from: -30,
                to: 5,
                name: "low",
                color: "#00A100"
              },
              {
                from: 6,
                to: 20,
                name: "medium",
                color: "#128FD9"
              },
              {
                from: 21,
                to: 45,
                name: "high",
                color: "#FFB200"
              },
              {
                from: 46,
                to: 55,
                name: "extreme",
                color: "#FF0000"
              }
            ]
          }
        }
      },
      dataLabels: {
        enabled: false
      }
    };
  }

  constructor(private logService: LogServiceService) {
  }

  fetchData(): void {
    let responseData: LogResponse;
    this.logService.getLogs().subscribe(
      (response: LogResponse) => {
        this.data = response;
        console.log(this.data);
        this.transformDataForChart();
        this.mapFunction();
        this.transformDataToDoughnoutChart();
        this.mapPieChart();
        this.mapBarGraph();
      },
      (error) => {
        // Handle errors if needed
        console.error('Error fetching data:', error);
      }
    );
  }

  transformDataForChart(): void {
    const daysToInclude = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      .map(day => day.toLowerCase()); // Convert all days to lowercase for case insensitivity

    this.chartOptions.series = Object.keys(this.data.dayAndTime)
      .filter(day => daysToInclude.includes(day.toLowerCase())) // Filter only the desired days (case insensitive)
      .sort(this.sortDays)
      .map(day => {
        const timeData = Object.entries(this.data.dayAndTime[day])
          .sort(([timeA], [timeB]) => this.sortTime(timeA, timeB))
          .map(([time, value]) => ({x: time, y: value}));

        return {
          name: day.toUpperCase(),
          data: timeData,
        };
      });
  }

  private sortDays(dayA: string, dayB: string): number {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAIndex = daysOrder.findIndex(day => day.toLowerCase() === dayA.toLowerCase());
    const dayBIndex = daysOrder.findIndex(day => day.toLowerCase() === dayB.toLowerCase());

    return dayAIndex - dayBIndex;
  }

  private sortTime(timeA: string, timeB: string): number {
    const isValidTime = (time: string): boolean => {
      // Implement a validation logic for the time format
      // For example, check if the time string contains both hour and period (AM/PM)
      return /^\d+\s*(AM|PM)$/i.test(time.trim());
    };

    if (isValidTime(timeA) && isValidTime(timeB)) {
      const parseTime = (time: string) => {
        const [hour, period] = time.split(/([^\d]+)/).filter(Boolean);
        return parseInt(hour, 10) + (period.toLowerCase() === 'pm' ? 12 : 0);
      };
      return parseTime(timeA) - parseTime(timeB);
    }
    return 0; // Default return value if timeA or timeB is not valid
  }

  transformDataToDoughnoutChart(): void {

    const browserToInclude = ['EDGE', 'OPERA', 'CHROME', 'FIREFOX', 'BRAVE', 'SAFARI']
    const browsers = Object.keys(this.data.browsers);
    const doughnutData = browsers.filter(browser => browserToInclude.includes(browser.toUpperCase()))
      .map(browser => {
        const browserData = this.data.browsers[browser]; // Assuming the browser data is a number

        return {
          name: browser.toUpperCase(),
          value: browserData,
        };
      });

    this.option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: doughnutData
        }
      ]
    };
  }

  mapFunction(): void {

    const data = Object.keys(this.data.countries).map((name) => {
      return {name, value: this.data.countries[name]};
    });

    console.log(data);

    echarts.registerMap('USA', worldMap, {
      Alaska: {
        left: -131,
        top: 25,
        width: 15
      },
      Hawaii: {
        left: -110,
        top: 28,
        width: 5
      },
      'Puerto Rico': {
        left: -76,
        top: 26,
        width: 2
      }
    });
    this.mapOption = {
      tooltip: {
        trigger: 'item',
        showDelay: 0,
        transitionDuration: 0.2
      },
      toolbox: {
        show: true,
        //orient: 'vertical',
        left: 'left',
        top: 'top',
        feature: {
          dataView: {readOnly: false},
          restore: {},
          saveAsImage: {}
        }
      },
      series: [
        {
          name: 'Visitor By Country',
          type: 'map',
          roam: true,
          map: 'USA',
          itemStyle: {
            emphasis: {
              areaColor: '#29e6f8',
            },
          },
          data: data
        }
      ]
    } as EChartsOption;

  }

  mapPieChart() {
    const data = Object.keys(this.data.operatingSystems).map((name) => {
      return {name, value: this.data.operatingSystems[name]};
    });

    this.pieOption = {
      title: {
        text: 'Users By Operating System',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  mapBarGraph() {

    const countriesToInclude= ['INDIA', 'NEPAL', 'BANGLADESH', 'CHINA'];
    const countries = Object.keys(this.data.countries);
    const graphData = countries.filter(countries => countriesToInclude.includes(countries.toUpperCase()))
      .map(countries => {
        const countriesData = this.data.countries[countries]; // Assuming the browser data is a number

        return {
          name: countries.toUpperCase(),
          value: countriesData,
        };
      });

    this.barOption = {
      dataset: {
        source: [['value', 'name'], ...graphData.map(item => [item.value, item.name])]
      },
      grid: { containLabel: true },
      xAxis: { name: 'numbers' },
      yAxis: { type: 'category' },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: Math.min(...graphData.map(item => item.value)),
        max: Math.max(...graphData.map(item => item.value)),
        text: ['High Score', 'Low Score'],
        dimension: 0,
        inRange: {
          color: ['#65B581', '#FFCE34', '#FD665F']
        }
      },
      series: [{
        type: 'bar',
        encode: {
          x: 'value',
          y: 'name'
        }
      }]
    };
  }


}


