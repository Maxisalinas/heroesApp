import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable, catchError, of, map} from 'rxjs';

import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';


@Injectable({providedIn: 'root'})
export class HeroesService {
    constructor(private http: HttpClient) {}


        private baseUrl: string = environments.baseUrl;

        // Pedir heroes
        getHeroes():Observable<Hero[]> {

             return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`);

        }

        getHeroById( id: string ):Observable<Hero | undefined> {
            return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
                .pipe(
                    catchError( () => of(undefined))  
                );
         }

         getSuggestions( query:string ): Observable<Hero[]>  {

            return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }`);
         }


        // Añadir heroes y editar heroes
         addHero( hero: Hero ): Observable<Hero> {

            return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
         }

         updateHero( hero: Hero ): Observable<Hero> { 
            if ( !hero.id ) throw Error('Hero id is required')
            return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${hero.id}`, hero);
         }

         deleteHero( id: string ): Observable<boolean> { 
            return this.http.delete(`${ this.baseUrl }/heroes/${ id }`)
            .pipe(
                map( resp => true),
                catchError( err => of(false))
            );
            
         }

         
    
}