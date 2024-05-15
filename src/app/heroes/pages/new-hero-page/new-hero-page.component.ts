import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { switchMap, filter } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';




@Component({
  selector: 'app-new-hero-page',
  templateUrl: './new-hero-page.component.html',
  styles: ``
})
export class NewHeroPageComponent implements OnInit {

    ngOnInit(): void {
        if (this.router.url.includes('edit')) 

            this.activatedRoute.params
            .pipe( 
                switchMap( ({ id }) => this.heroesService.getHeroById( id ) )
            ).subscribe( hero => {
                if ( !hero ) {
                    return this.router.navigateByUrl('/');
                } 

                this.heroForm.reset( hero );

                return;
            }); 
        }

    public heroForm = new FormGroup({
        id: new FormControl(''),
        superhero: new FormControl('', {nonNullable: true}),
        publisher: new FormControl<Publisher>( Publisher.DCComics),
        alter_ego: new FormControl(''),
        first_appearance:  new FormControl(''),
        characters: new FormControl(''),
        alt_img: new FormControl(''),
    });

    public publishers = [
        { id: 'DC Comics', value: 'DC - Comics'},
        { id: 'Marvel', value: 'Marvel Comics' }    
    ];

    constructor(private heroesService: HeroesService,
                private activatedRoute: ActivatedRoute,
                private router:Router ,
                private snackbar: MatSnackBar,
                private dialog: MatDialog
    ) {}

    get currentHero(): Hero {
        const hero = this.heroForm.value as Hero;
        return hero
    }



    onSubmit(): void {
        if ( this.heroForm.invalid ) return;

        if ( this.currentHero.id ) {
            this.heroesService.updateHero( this.currentHero )
                .subscribe( hero => {
                    this.router.navigate(['/heroes/list'])
                    this.showSnackBar( `El superheroe '${hero.superhero}' se editó exitosamente` )
                });

                return  
        }

        this.heroesService.addHero( this.currentHero )
            .subscribe( hero => {
                this.router.navigate(['/heroes/list'])
                this.showSnackBar( `El superheroe '${hero.superhero}' se añadió exitosamente` );
            });

            return
    }


    onDelete(): void {
        if( !this.currentHero.id ) throw Error('Hero id is required');

        const dialogRef = this.dialog.open( ConfirmDialogComponent, { data: this.heroForm.value } );

        dialogRef.afterClosed()
            .pipe(
                filter( ( result: boolean) => result ),
                switchMap( () => this.heroesService.deleteHero(this.currentHero.id)),
                filter( (wasDeleted: boolean) => wasDeleted)
                )
                .subscribe(() => { 
                    this.showSnackBar('El super héroe se eliminó correctamente')
                    this.router.navigate(['/heroes/list']);
                 }) 
    }



    showSnackBar( message: string ): void { 
        this.snackbar.open( message, 'OK', { duration: 2500 } )
    }
  
}