import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Tabs } from "./components/tabs/tabs";


@Component
({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Tabs],
    template: `
        <app-header/>
        <app-tabs/>
        <router-outlet/>
    `,
    styles: [],
})
export class App 
{
    protected title = 'Mock Dashboard';
}
 