import { IPlayerModel } from './players';
export interface IInvitationModel {
    uuid?: string;
    from: IPlayerModel;
    to: IPlayerModel;
    timestamp: number;
    response?: boolean;
}
