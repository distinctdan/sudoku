module Sudoku.Controllers {
    'use strict';

    export class cellController {
        public cell: ICell;

        public static $inject = [

        ];

        constructor(

        ) {

        };
    }
}

module Sudoku.Directives {
    'use strict';

    export class cell {

        public static $inject = [

        ];

        constructor(

        ) {
            return {
                bindToController: true,
                controller: Controllers.cellController,
                controllerAs: 'ctrl',
                scope: {
                    cell: '=sudokuCell',
                },
                templateUrl: "<%= getVersionedPath('/app/directives/cell/cell.tmpl.html') %>",
                link: ($scope, element, attrs) => {

                }
            }
        };
    }
}