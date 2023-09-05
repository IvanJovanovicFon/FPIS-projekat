import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  
  slides: any[] = new Array(6).fill({id: -1, src: '', title: '', subtitle: ''});

  constructor() { }

  ngOnInit(): void {
    this.slides[0] = {
      id: 0,
      src: './assets/1.jpg',
      subtitle: 'Posvećujemo pažnju detaljima.'
    };
    this.slides[1] = {
      id: 1,
      src: './assets/2.jpg',
      subtitle: 'Nase gradjevine su vrhunskog kvaliteta.'
    }
    this.slides[2] = {
      id: 2,
      src: './assets/3.jpg',
      subtitle: 'Moderan izgled.'
    }
    this.slides[3] = {
      id: 3,
      src: './assets/4.jpg',
      subtitle: 'Radimo sa najmodernijim masinama.'
    },
    this.slides[4] = {
      id: 4,
      src: './assets/5.jpg',
      subtitle: 'Naši radnici znaju svoj posao.'
    },
    this.slides[5] = {
      id: 5,
      src: './assets/6.jpg',
      subtitle: 'Imamo tim vrhunskih inženjera.'
    }
  }
}
