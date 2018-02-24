"use strict";

module Sudoku {
    'use strict';

    var modules = {
        'Controllers': 'controller', 
        'Services': 'service',
        'Factories': 'factory',
        'Objects': 'service',
        'Scenes': 'service',
        'Quadtree': 'service',
        'KdTree': 'service',
        'Physics': 'service',
        'Directives': 'directive' 
    };

    var allAngularModuleNames = [];

    for (var mod in modules) {
        if (modules.hasOwnProperty(mod)){
            var moduleName = 'Orbs.' + mod;

            angular.module(moduleName, []);
            allAngularModuleNames.push(moduleName);

            // iterate through all the classes in the module and create angular modules for them
            for (var myClass in Sudoku[mod]) {
                if(Sudoku[mod].hasOwnProperty(myClass)){
                    angular.module(moduleName)[modules[mod]](myClass, Sudoku[mod][myClass]);
                }
            }
        }
    }

    angular.module('sudoku', allAngularModuleNames);

    $(document).ready(() => {
        angular.bootstrap('.sudokuApp', ['sudoku']);
    });
}
