import {Component, OnInit,Input, Output, EventEmitter, HostBinding, ViewChild, ElementRef } from '@angular/core';
import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {Options} from '../classes/options'
import {SelectedCard} from '../classes/selected-card'

@Component({
    selector: 'card',
    templateUrl:'./card.component.html',
    styleUrls: ['./card.component.css']
  })
  
  export class CardComponent {
    @Input()cardNo:number;
    @Input()pos:number;
    @Input()options:Options = new Options();
    @Output()onSelect:EventEmitter<SelectedCard> = new EventEmitter<SelectedCard>();
    @ViewChild('cardref',{static:false}) cardref:ElementRef;
        
    constructor() {
    }
    ngOnInit(){
//        if(this.pos>=1 && this.pos<5){
//                console.log(`[${this.pos}]Card[${this.cardNo}].options: ${JSON.stringify(this.options)}`);
//        }
    }
    
    filename():string{
        let filename:string;
        if(this.cardNo>=0){
            filename="c"+(this.cardNo<10?"0"+this.cardNo:this.cardNo)+".png";
        }else{
            filename="back.png";
        }
        return filename;
    }
                    
    toggleSelection(){

        let selectedCard=new SelectedCard(-1,-1);
        selectedCard.cardNo=this.cardNo;
        selectedCard.position=this.pos;
        let rect= this.cardref.nativeElement.getBoundingClientRect();
//        console.log(`Card bounding box: ${JSON.stringify(rect)}`);
        selectedCard.x=rect.x;
        selectedCard.y=rect.y;
        selectedCard.width=rect.width;
        selectedCard.height=rect.height;
        this.onSelect.emit(selectedCard);
    }
}
