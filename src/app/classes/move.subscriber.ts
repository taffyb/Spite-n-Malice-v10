import {IMoveModel} from 's-n-m-lib';

export interface IMoveSubscriber{
    performMoves(gameUuid:string,moves:IMoveModel[]);
}