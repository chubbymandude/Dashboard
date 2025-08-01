import { Component, OnInit, ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartConfiguration, TooltipItem} from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Polygon } from '../../services/polygon';
import { CurrentDate } from "../current-date/current-date";

@Component(
{
    selector: 'app-dashboard',
    imports: [BaseChartDirective, HttpClientModule, FormsModule, RouterModule, DecimalPipe, CurrentDate],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
// following class is a display of a dynamic dashboard below the net income chart
export class Dashboard implements OnInit
{
    @ViewChild( BaseChartDirective ) chart?: BaseChartDirective
    // variables for obtaining from API
    data: any[] = []; 
    limit = 0;
    label = '';

    // variables for filtering by date
    startDate: string = '2022-01-01';
    endDate: string = '2022-07-19';
    filtered: any[] = [];

    // data for the dynamic line chart
    lineChartData =
    {
        datasets: [
        {
            data: [] as { x: any; y: number }[],
            label: this.label, 
            fill: true,
        }],
    }

    // custom resizing, dynamic modifications and scales
    get lineChartOptions(): ChartConfiguration['options']
    {
        return{ // allows for options to be modified upon tile clicks
            responsive: false,
            maintainAspectRatio: false, 
            plugins:
            {
                title:
                {
                    display: true, 
                    text: 'Recent Data for ' + this.label,
                    font:
                    {
                        size: 24,
                    }
                },
                tooltip: // customizing data points (aka tooltips)
                {
                    callbacks:
                    {
                        // custom labeling
                        label: (tooltipItem: TooltipItem<'line'>) =>
                        {
                            const label = tooltipItem.dataset.label || '';
                            const rawData : any = tooltipItem.raw;
                            const colVal = rawData.y;

                            const colValFormat = new Intl.NumberFormat('en-US').format(Number(colVal));
                            return `${label}: ${colValFormat}`;
                        }
                    }
                }
            },
            scales:
            {
                y: // y-axis (non-date column)
                {
                    title:
                    {
                        display: true,
                        text: this.label,
                    }
                },
                x: // x-axis (dates)
                {
                    type: 'timeseries',
                    time: // display months on axis
                    {
                        unit: 'day', 
                        displayFormats:
                        {
                            month: 'DD MMM',
                        },
                    },
                    title:
                    {
                        display: true,
                        text: 'Date',
                    },
                }
            },
            
        }
    }

    constructor(private http: HttpClient, private api: Polygon, 
                private detector: ChangeDetectorRef, private route: Router, 
                private activatedRoute: ActivatedRoute) {}
    
    ngOnInit(): void 
    {
        const mode = this.activatedRoute.snapshot.paramMap.get('mode');
        if(mode === 'switch')
        {
            this.activatedRoute.queryParams.subscribe(parameters =>
            {
                // get relevant values from tabular view
                const label = parameters['label'];
                const startDate = parameters['startDate'];
                const endDate = parameters['endDate'];
                // set component start & end date
                this.startDate = startDate;
                this.endDate = endDate;
                this.label = label;
                // reload API with specified data
                this.loadData(() =>
                {
                    // set component start & end date
                    this.startDate = startDate;
                    this.endDate = endDate;
                    this.label = label;
                    // display chart accordingly
                    this.updateChart(label);
                    this.detector.detectChanges();
                });
            });
        }
        else
        {
            this.loadData();
        }
    }

    loadData(afterLoad?: () => void)
    {
        const mode = this.activatedRoute.snapshot.paramMap.get('mode');
        this.api.getData().subscribe(
        {
            next: result => 
            {
                // following code is initializing data components from Polygon API
                this.data = result.results; 
                this.limit = this.data.length; 
                // this only runs when switching back and forth with the "switch" buttons
                if(afterLoad && mode === 'switch')
                {
                    afterLoad();
                }
                else // runs on open and when clicking the top tabs
                {
                    this.startDate = this.data[this.limit - 1]['date']; 
                    this.endDate = this.data[0]['date'];
                    this.updateChart('yield_1_month');
                }
                this.detector.detectChanges(); 
            },
            error: err =>
            {
                console.error("Could not obtain data from API");
            }
        });
    }

    // function to update chart when a tile is clicked with the specified date range by user
    updateChart(tile : string)
    {
        // fetch start and end dates from class variables
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;

        // filter based on date provided
        this.filtered = this.data.filter((row : any) =>
        {   
            const date = new Date(row['date']);

            if((start && date < start) || (end && date > end)) // ignore items outside filter
            {
                return false;
            }
            return true;
        });

        // get column data
        const colData = this.getColumnData(tile).map((value: any) => Number(value) || 0);
        const dateData = this.getColumnData('date').map((value: any) => value);
        // place column data in a map for use in time series
        const data = dateData.map((date: any, colIndex: any) => (
        {
            x: date,
            y: colData[colIndex]
        }));
        // update the chart
        this.lineChartData.datasets[0].data = data; 
        this.lineChartData.datasets[0].label = tile; 
        this.label = tile; 

        // force redraw
        this.chart?.update();
        this.detector.detectChanges();
    }

    // helper method for the above function; obtains column data for a specified tile 
    getColumnData(tile : string)
    {
        // get the column data in this date range
        return this.filtered
            .map((row: { [x: string]: any; }) => row[tile])
            .filter((value: string | null | undefined) => value !== undefined && value !== null && value !== '');
    }  

    // send current dashboard data to tabular view so that page can show relevant information upon button click
    goToTabularView() 
    {
        // get variables
        const label = this.label;  
        const startDate = this.startDate;
        const endDate = this.endDate;

        // set parameters
        this.route.navigate(['/tabular', 'switch'], 
        {
            queryParams: 
            {
                label: label,
                startDate: startDate,
                endDate: endDate
            }
        });
    }
}