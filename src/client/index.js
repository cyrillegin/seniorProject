/*
    index.js
    Authors: Cyrille Gindreau

    this file serves as the entry point for the app. Currently it doesn't do anything other
    than import the base styles and the three container.

*/
import './base.style.scss';

import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line

import threecomponent from './components/3dContainer/three.component';
import blueprintcomponent from './components/2dContainer/blueprint.component';
import controlscomponent from './components/controlsContainer/controls.component';
import slidercomponent from './components/slider/slider.component';
import mainPage from './pages/home.template.html';
import boatParametersService from './services/boatParameters.service';

angular.module('boat_builder', ['ngRoute'])
    .component('threecomponent', threecomponent)
    .component('blueprintcomponent', blueprintcomponent)
    .component('controlscomponent', controlscomponent)
    .component('slidercomponent', slidercomponent)
    .service('boatParametersService', boatParametersService)
    .config(
        ['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
            $locationProvider.hashPrefix('');
            $routeProvider
                .when('/', {
                    template: mainPage,
                })
                .otherwise({
                    redirectTo: '/',
                });
        }]);
