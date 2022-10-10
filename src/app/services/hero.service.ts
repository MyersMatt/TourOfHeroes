import { Injectable } from '@angular/core';
import { Hero} from "../interfaces/hero";
import { HEROES } from "../mock-heroes";
import { MessageService } from "./message.service";
import {Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(private http: HttpClient,private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]>{
    this.log('HeroService: attempting to fetch heroes');
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    );
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h=> h.id === id)!;
    this.log(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  private log(message: string): void{
    this.messageService.add(`HeroService: ${message}`)
  }

  private handleError<T>(operation = 'operation', result?: T){
    return(error: any): Observable<T> =>{
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }
}
