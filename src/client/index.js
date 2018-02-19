/*
    index.js
    Authors: Cyrille Gindreau

    this file serves as the entry point for the app. Currently it doesn't do anything other
    than import the base styles and the three container.

*/
import './base.style.scss';

import angular from 'angular';
import angularRoute from 'angular-route'; // eslint-disable-line
// import 'jquery';

import boatContainer from './components/3dContainer/three.component';
import blueprintContainer from './components/2dContainer/blueprint.component';
import controlsContainer from './components/controlsContainer/controls.component';
import mainPage from './pages/home.template.html';

angular.module('boat_builder', ['ngRoute'])
    .component('three-container', boatContainer)
    .component('blueprint-container', blueprintContainer)
    .component('controls-container', controlsContainer)
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
