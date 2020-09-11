"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//export const DEFAULT_PROFILE={
//    animation: { animateYN: true, 
//                 animate: { recycleYN: true, recycle: 1,
//                             dealerYN: true, dealer: 1, 
//                             playerYN: true, player: 1, 
//                             opponentYN: true, opponent: 1 }
//                },
//    showStatistics:true
//}
exports.DEFAULT_PROFILE = {
    animation: { animateYN: true,
        animate: { recycleYN: false, recycle: 1,
            dealerYN: false, dealer: 1,
            playerYN: true, player: .2,
            opponentYN: true, opponent: .2 }
    },
    showStatistics: true
};
