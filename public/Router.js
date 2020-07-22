"use strict"

import {routes} from './routes.js';

class Router{

    constructor(routes){
        this.routes = routes;
        this.rootElement = document.getElementById('app');
        this.currentRoute = '';
    }

    loadRoute(routeName){
        console.log(`Routing to ${routeName}`)

        this.currentRoute = routeName;
        this.rootElement.innerHTML = this.routes[routeName]['template']();
        this.routes[routeName]['script']();

    }

    loadDefault(){
        for(let route in this.routes){
            if(this.routes[route]['default'] === true){
                this.loadRoute(route)
            }
        }
    }
}

export {Router};