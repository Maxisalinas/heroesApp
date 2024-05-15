import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Observable, map, tap } from 'rxjs';



@Injectable({providedIn: 'root'})
export class PublicGuard  implements CanActivate {


    constructor( private authService: AuthService,
                 private router:Router
    ) { }

    checkLogin(): boolean | Observable<boolean> {

       return this.authService.checkAuthentication()
        .pipe( 
            tap( resp => {
                if( resp ) {
                    this.router.navigate(['./'])
                }
            }),
            map( resp => !resp ),

        )
    }

    canActivate(): boolean | Observable<boolean> {

        return this.checkLogin()
        
    }
    
}

