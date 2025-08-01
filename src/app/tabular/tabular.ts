import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Polygon } from '../../services/polygon';
import { RouterModule } from '@angular/router';

@Component(
{
    standalone: true,
    selector: 'app-tabular',
    imports: [FormsModule, RouterModule],
    templateUrl: './tabular.html',
    styleUrl: './tabular.scss'
})
export class Tabular implements OnInit
{
    // hold mode for switching back to main view
    mode: string = '';

    // variables for obtaining from API
    data: any[] = []; 
    keys: string[] = []; 
    limit = 0;

    // variables for filtering by date
    startDate: string = '';
    endDate: string = '';
    filtered: any[] = [];

    // variables related to filtering by dropdown
    label: string = '';
    showDropdown = false;
    shownColumns: { [key: string]: boolean } = {};
    visible: string[] = [];
    allSelected = true; // true when the page first loads

    constructor(private api: Polygon, private detector: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute, private route: Router) {}

    // obtains data in two different ways depending on router link user clicked on
    ngOnInit(): void 
    {
        const mode = this.activatedRoute.snapshot.paramMap.get('mode');
        if(mode === 'switch')
        {
            this.mode = 'switch';
            this.activatedRoute.queryParams.subscribe(parameters =>
            {
                this.toggleSelectAll();
                // get relevant values from dashboard
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
                    // set column visibility
                    this.shownColumns = {};
                    this.shownColumns['date'] = true;
                    this.shownColumns[label] = true;
                    // set component start & end date
                    this.startDate = startDate;
                    this.endDate = endDate;
                    this.label = label;
                    // set the view
                    this.filter();
                    this.detector.detectChanges();
                });
            });
        }
        else
        {
            this.mode = '';
            this.loadData();
        }
    }

    // loads the data from the API for standard case
    loadData(afterLoad?: () => void)
    {
        this.api.getData().subscribe(
        {
            next: result => 
            {
                // following code is initializing data components from Polygon API
                this.data = result.results; 
                this.keys = Object.keys(this.data[0]); 
                this.limit = this.data.length; 
                // if using one of the "switch" buttons do not configure the dates
                if(afterLoad)
                {
                    afterLoad();
                }
                else // when clicking the dashboard tab
                {
                    this.startDate = this.data[this.limit - 1]['date']; 
                    this.endDate = this.data[0]['date'];
                }
                // following code is initialization for filtering functionality
                this.filtered = this.data;
                this.keys.forEach(key => 
                {
                    this.shownColumns[key] = true;  
                });
                this.visible = this.keys; 
                this.detector.detectChanges(); 
            },
            error: err =>
            {
                console.error("Could not obtain data from API");
            }
        });
    }

    // filters data based on user input for date and categories requested
    filter()
    {
        // update categories if they were modified by user
        this.visible = this.keys.filter(key => this.shownColumns[key]);

        // fetch start and end dates from class variables
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;
        
        // filter based on dates provided
        this.filtered = this.data.filter((row : any) =>
        {   
            const date = new Date(row['date']);

            if((start && date < start) || (end && date > end)) // ignore items outside filter
            {
                return false;
            }
            return true;
        });
    }

    // used to select / deselect all categories 
    toggleSelectAll()
    {
        this.allSelected = !this.allSelected; 
        this.keys.forEach(key => 
        {
            this.shownColumns[key] = this.allSelected;
        });
        this.visible = this.keys.filter(key => this.shownColumns[key]);
        this.detector.detectChanges();
    }

    // goes to the main view page if mode is on switch
    goToMainView(mode : string)
    {
        if(mode !== 'switch') // check mode
        {
            return;
        }
        // get variables
        const label = this.label;  
        const startDate = this.startDate;
        const endDate = this.endDate;

        // set parameters
        this.route.navigate(['/dashboard', 'switch'], 
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
