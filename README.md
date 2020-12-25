# Angular Spotify Authorization Example

Spotify Authorization Guide demo / example provided with Angular 11.

`https://developer.spotify.com/documentation/general/guides/authorization-guide/`

`https://github.com/spotify/web-api-auth-examples`

## Installation

Run `npm install` to install dependencies.

## Create Spotify Application

Navigate to [your Spotify for Developers Dashboard](https://developer.spotify.com/dashboard/applications) and create your application.

Register the neccessary redirect URIs on clicking the 'Edit Settings' button in your application dashboard.

Add both development and production redirect URIs. E.g. development: `http://localhost:4200/home/` to match this example.

## Adjust Environment variables

Change `clientId` and `clientSecret` values in `src/environments/environment.prod.ts` and `src/environments/environment.ts`.

Change `redirectUri` value in `src/environments/environment.prod.ts` to match your application production url.

## Development server

Run `ng serve` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200/). The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
