export interface IProfileModel {
    animation: {
        animateYN: boolean;
        animate: {
            recycleYN: boolean;
            recycle: number;
            dealerYN: boolean;
            dealer: number;
            playerYN: boolean;
            player: number;
            opponentYN: boolean;
            opponent: number;
        };
    };
    showStatistics: boolean;
}
export declare const DEFAULT_PROFILE: {
    animation: {
        animateYN: boolean;
        animate: {
            recycleYN: boolean;
            recycle: number;
            dealerYN: boolean;
            dealer: number;
            playerYN: boolean;
            player: number;
            opponentYN: boolean;
            opponent: number;
        };
    };
    showStatistics: boolean;
};
