import { Game } from './games';
import { Card } from './cards';
import { Move } from './moves';
export declare class Dealer {
    getDeck(): number[];
    fillHand(activePlayer: number, game: Game): Move[];
    protected shuffle<T>(deck: T[]): void;
    protected recycle(game: Game): void;
    protected dealNextCard(game: Game): Card;
}
