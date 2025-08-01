import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient } from '@angular/common/http';

//Main class for the App
export const appConfig: ApplicationConfig = 
{
    providers: 
    [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes), provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables()),
        provideHttpClient(),
    ],
};
