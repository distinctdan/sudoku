import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from 'src/components/app/app.component';
import { AppRoutingModule } from 'src/app-routing.module';
import { PuzzleBoardComponent } from 'src/components/puzzleBoard/puzzleBoard.component';
import { PuzzleCellColorDirective} from 'src/directives/puzzleCellColor.directive';
import { PuzzleControlsComponent} from 'src/components/puzzleControls/puzzleControls.component';
import { PuzzleListPageComponent } from 'src/pages/puzzleListPage/puzzleListPage.component';
import { PuzzlePageComponent } from 'src/pages/puzzlePage/puzzlePage.component';
import { puzzlesFeatureKey, puzzlesReducer, PuzzleEffects } from 'src/store/puzzle';
import { saveStateMetaReducer } from 'src/store/saveState.metareducer';

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
        StoreModule.forRoot(
            {[puzzlesFeatureKey]: puzzlesReducer},
            // Loads/saves to localStorage
            {metaReducers: [saveStateMetaReducer]}
        ),
        EffectsModule.forRoot([PuzzleEffects])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
