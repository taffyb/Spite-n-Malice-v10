export interface ICardModel {
    cardNo: number;
    position: number;
}
export declare class Card implements ICardModel {
    cardNo: number;
    position: number;
    constructor(cardNo: number, position: number);
}
