"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var SMUtils = /** @class */ (function () {
    function SMUtils() {
    }
    SMUtils.toFaceNumber = function (card) {
        var c;
        if (card > enums_1.CardsEnum.DECK) {
            c = enums_1.CardsEnum.JOKER;
        }
        else if (card > enums_1.CardsEnum.NO_CARD) {
            c = card % enums_1.CardsEnum.KING;
            if (c == 0) {
                c = enums_1.CardsEnum.KING;
            }
        }
        else {
            c = enums_1.CardsEnum.NO_CARD;
        }
        return c;
    };
    SMUtils.getTopOfStack = function (cards) {
        return this.getFaceNumber(cards, cards.length - 1);
    };
    SMUtils.getFaceNumber = function (cards, depth) {
        if (depth === void 0) { depth = 0; }
        if (depth == 0) {
            if (cards[depth].cardNo == enums_1.CardsEnum.JOKER) {
                return enums_1.CardsEnum.ACE;
            }
            else {
                return this.toFaceNumber(cards[depth].cardNo);
            }
        }
        else {
            var faceNumber = this.toFaceNumber(cards[depth].cardNo);
            if (faceNumber == enums_1.CardsEnum.JOKER) {
                return this.getFaceNumber(cards, depth - 1) + 1;
            }
            else {
                return faceNumber;
            }
        }
    };
    return SMUtils;
}());
exports.SMUtils = SMUtils;
