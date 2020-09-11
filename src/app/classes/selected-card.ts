export interface ISelectedCardModel{
    cardNo:number;
    position:number;
    x:number;
    y:number;
    width:number;
    height:number;
}

export class SelectedCard implements ISelectedCardModel{
    cardNo: number;
    position: number;
    x: number;
    y: number;
    width: number;
    height: number;
    
    constructor(cardNo:number,position:number){
        this.cardNo=cardNo;
        this.position=position;
    }
}