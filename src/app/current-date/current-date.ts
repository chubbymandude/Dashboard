import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { DatePipe } from '@angular/common';

@Component(
{
    selector: 'app-current-date',
    imports: [],
    templateUrl: './current-date.html',
    styleUrl: './current-date.scss',
    providers: [DatePipe]
})
// a component within the dashboard component that displays the current date at the top of the page
export class CurrentDate implements OnInit
{
    currDateTime: string | null = null;

    constructor(private datePipe: DatePipe, private detector: ChangeDetectorRef) {};

    // updates the current date frequently
    ngOnInit()
    {
        this.updateDateTime();
        // make it so the date gets updated every second
        setInterval(() => { this.updateDateTime(); }, 500);
    }

    updateDateTime()
    {
        this.currDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        // ensure changes are shown on screen
        this.detector.detectChanges();
    }
}
