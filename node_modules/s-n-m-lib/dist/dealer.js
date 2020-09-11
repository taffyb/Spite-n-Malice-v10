"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moves_1 = require("./moves");
var enums_1 = require("./enums");
var Dealer = /** @class */ (function () {
    function Dealer() {
    }
    Dealer.prototype.getDeck = function () {
        var decks = 2; //default play with two decks
        var jokers = 4;
        var deck = [];
        for (var d = 0; d < decks; d++) {
            for (var i = 1; i <= 52; i++) {
                deck.push(i);
            }
        }
        if (jokers > 0) {
            for (var i = 1; i <= jokers; i++) {
                deck.push(enums_1.CardsEnum.JOKER);
            }
        }
        this.shuffle(deck);
        return deck;
    };
    Dealer.prototype.fillHand = function (activePlayer, game) {
        var c = 0;
        var moves = [];
        var HAND_1 = enums_1.PositionsEnum.PLAYER_HAND_1 + (activePlayer * enums_1.PlayerPositionsEnum.PLAYER_2);
        var HAND_5 = enums_1.PositionsEnum.PLAYER_HAND_5 + (activePlayer * enums_1.PlayerPositionsEnum.PLAYER_2);
        for (var i = HAND_1; i <= HAND_5; i++) {
            if (game.getCards(i).length == 0) {
                var nextCard = void 0;
                try {
                    nextCard = this.dealNextCard(game);
                }
                catch (e) {
                    game.outOfCards();
                }
                c++;
                var move = new moves_1.Move();
                move.type = enums_1.MoveTypesEnum.DEALER;
                move.from = enums_1.PositionsEnum.DECK;
                move.card = nextCard.cardNo;
                move.to = i;
                moves.push(move);
            }
        }
        return moves;
    };
    Dealer.prototype.shuffle = function (deck) {
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    };
    Dealer.prototype.recycle = function (game) {
        /*
        If the deck has run out of cards,
        shuffle the recycle pile and add them back into the deck.
        */
        console.log("*** Recycle Discard pile ***");
        for (var i = game.getCards(enums_1.PositionsEnum.RECYCLE).length - 1; i >= 0; i--) {
            game.getCards(enums_1.PositionsEnum.DECK).push(game.getCards(enums_1.PositionsEnum.RECYCLE).pop());
        }
        ;
        this.shuffle(game.getCards(enums_1.PositionsEnum.DECK));
    };
    Dealer.prototype.dealNextCard = function (game) {
        var nextCard;
        if (game.getCards(enums_1.PositionsEnum.DECK).length == 0) {
            this.recycle(game);
        }
        if (game.getCards(enums_1.PositionsEnum.DECK).length == 0) {
            throw Error;
        }
        nextCard = game.getCards(enums_1.PositionsEnum.DECK).pop();
        if (game.getCards(enums_1.PositionsEnum.DECK).length == 0) {
            this.recycle(game);
        }
        return nextCard;
    };
    return Dealer;
}());
exports.Dealer = Dealer;
