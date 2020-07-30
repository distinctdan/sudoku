import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from 'src/components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { PuzzleBoardComponent } from 'src/components/puzzleBoard/puzzleBoard.component';
import { PuzzleCellColorDirective} from 'src/directives/puzzleCellColor.directive';
import { PuzzleControlsComponent} from 'src/components/puzzleControls/puzzleControls.component';
import { PuzzleListPageComponent } from 'src/pages/puzzleListPage/puzzleListPage.component';
import { PuzzlePageComponent } from 'src/pages/puzzlePage/puzzlePage.component';
import * as fromPuzzles from 'src/store/puzzle/reducers/puzzle.reducer';
import { PuzzleEffects } from 'src/store/puzzle/effects/puzzle.effects';

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
        AppRoutingModule,
        StoreModule.forRoot({
            [fromPuzzles.featureKey]: fromPuzzles.reducer
        }),
        EffectsModule.forRoot([PuzzleEffects])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }