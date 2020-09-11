import { ICardModel } from './cards';
export declare class SMUtils {
    constructor();
    static toFaceNumber(card: number): number;
    static getTopOfStack(cards: ICardModel[]): number;
    static getFaceNumber(cards: ICardModel[], depth?: number): number;
}
