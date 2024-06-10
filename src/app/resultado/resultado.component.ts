import { Component } from '@angular/core';
import { RankingService } from '../services/ranking.service';
import { Ranking } from '../interfaces/Ranking.interfaces';
 

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.css'
})
export class ResultadoComponent {
  ranking: Ranking[] = [];

  constructor(private rankingService: RankingService) {
    this.ranking = this.rankingService.getRanking();
  }
}
