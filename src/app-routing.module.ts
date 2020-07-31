import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PuzzleListPageComponent } from 'src/pages/puzzleListPage/puzzleListPage.component';
import { PuzzlePageComponent } from 'src/pages/puzzlePage/puzzlePage.component';

const routes: Routes = [
    {path: '', component: PuzzleListPageComponent},
    {path: 'puzzles/:id', component: PuzzlePageComponent},
    {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
