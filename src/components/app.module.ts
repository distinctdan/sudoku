import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from 'src/components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { PuzzleBoardComponent } from 'src/components/puzzleBoard/puzzleBoard.component';
import { PuzzleCellColorDirective} from 'src/directives/puzzleCellColor.directive';
import { PuzzleControlsComponent} from 'src/components/puzzleControls/puzzleControls.component';
import { PuzzleListPageComponent } from 'src/pages/puzzleListPage/puzzleListPage.component';
import { PuzzlePageComponent } from 'src/pages/puzzlePage/puzzlePage.component';

@NgModule({
    declarations: [
        AppComponent,
        PuzzleBoardComponent,
        PuzzleCellColorDirective,
        PuzzleControlsComponent,
        PuzzleListPageComponent,
        PuzzlePageComponent,
    ],
    imports: [
        BrowserModule,
        // import HttpClientModule after BrowserModule.
        HttpClientModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
