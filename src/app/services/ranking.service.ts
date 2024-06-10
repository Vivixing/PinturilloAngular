import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  ranking = []
  constructor() { }

  getRanking() {
    return this.ranking;
  }

  updateRanking(newRanking: any) {
    this.ranking = newRanking;
  }
}
