import {GameFactory, Game } from './games';
import {Dealer, SMUtils } from 's-n-m-lib';
import {PositionsEnum, CardsEnum } from 's-n-m-lib';


describe('Game', () => {

    it('Select Active Player', () => {
        let expectedPlayer:boolean = true;
        for(let i=0;i<20;i++){
            const dealer = new Dealer();
            const deck=dealer.getDeck();
            const game: Game = Game.fromModel(GameFactory.newGame("new", "111111", "222222", deck));
            
            const activePlayer=game.activePlayer;
            const whoIsActivePlayer= getActivePlayer(game);
            expectedPlayer = expectedPlayer && (activePlayer == whoIsActivePlayer);

            console.log(`<${i}> getActivePlayer= ${whoIsActivePlayer} | game.activePlayer= ${activePlayer}`);
        }
        expect(expectedPlayer).toBe(true);
    });
});

function getActivePlayer(game:Game){

    let activePlayer:number=0;
    console.log(`=======================`);
    console.log(`Player<0> PILE ${SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE][game.cards[PositionsEnum.PLAYER_PILE].length-1].cardNo)}`);
    console.log(`Player<1> PILE ${SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE+10][game.cards[PositionsEnum.PLAYER_PILE+10].length-1].cardNo)}`);
    if(SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE][game.cards[PositionsEnum.PLAYER_PILE].length-1].cardNo) 
       >  
    SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE+10][game.cards[PositionsEnum.PLAYER_PILE+10].length-1].cardNo)
       && !(game.cards[PositionsEnum.PLAYER_PILE][game.cards[PositionsEnum.PLAYER_PILE].length-1].cardNo == CardsEnum.JOKER)){         
        activePlayer=1;
    }
    if(SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE][game.cards[PositionsEnum.PLAYER_PILE].length-1].cardNo) 
       ==  
    SMUtils.toFaceNumber(game.cards[PositionsEnum.PLAYER_PILE+10][game.cards[PositionsEnum.PLAYER_PILE+10].length-1].cardNo)){
        for(let i:number=PositionsEnum.PLAYER_STACK_1;i<=PositionsEnum.PLAYER_STACK_4;i++){

            console.log(`Player<0> PLAYER_STACK_${i} ${SMUtils.toFaceNumber(game.cards[i][game.cards[i].length-1].cardNo)}`);
            console.log(`Player<1> PLAYER_STACK_${i} ${SMUtils.toFaceNumber(game.cards[i+10][game.cards[i+10].length-1].cardNo)}`);
            if(SMUtils.toFaceNumber(game.cards[i][game.cards[i].length-1].cardNo) 
              >  
            SMUtils.toFaceNumber(game.cards[i+10][game.cards[i+10].length-1].cardNo)){
                 
                 activePlayer=1;
                 break;
            }else if(SMUtils.toFaceNumber(game.cards[i][game.cards[i].length-1].cardNo) 
              ==  
            SMUtils.toFaceNumber(game.cards[i+10][game.cards[i+10].length-1].cardNo)){
                continue;
            }
        }
    }
    
    return activePlayer;
}