import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';
import { Input } from '@angular/core';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
  styles: ``
})
export class CardComponent implements OnInit {

  @Input()
  public heroCard!: Hero; 

  ngOnInit(): void {
    if (!this.heroCard) 
    throw Error ('La propiedad heroCard es requerida')
  }

}
