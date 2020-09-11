import { IMoveModel } from './moves';
import { IPlayerModel } from './players';
export interface IMoveMessage {
    moves: IMoveModel[];
    from: IPlayerModel;
    to: IPlayerModel;
    gameUuid: string;
}
export interface IJoinMessage {
    player2: IPlayerModel;
    gameUuid: string;
}
export interface IInvitationMessage {
    uuid?: string;
    from: IPlayerModel;
    to: IPlayerModel;
    timestamp: number;
    response?: boolean;
}
