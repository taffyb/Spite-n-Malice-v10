import {IMoveModel,IGameModel} from 's-n-m-lib';
export interface IReport{

    renderCanvas(canvas:any,moves:IMoveModel[],game:IGameModel);
}