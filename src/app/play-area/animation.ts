import { trigger, state, style, transition, animate} from '@angular/animations';

export const Animations = [
   trigger('animateCard', [
         state('from', style({
           top:'{{fTop}}px',
           left:'{{fLeft}}px',
           position:'absolute',
           opacity:'{{fOpacity}}%',
           zIndex:'999'
         }),{params:{fTop:10,fLeft:10,fOpacity:35}}),
         state('to', style({
           top:'{{tTop}}px',
           left:'{{tLeft}}px',
           position:'absolute',
           opacity:'100%',
           zIndex:'999'
         }),{params:{tTop:500,tLeft:500}}),
         transition('from=>to', animate('{{duration}}ms'),{params:{duration:500}}),
//         transition('final=>initial', animate('1000ms'))
    ]),
];
export const DEFAULT_DURATIONS={PLAYER:800,DEALER:100,RECYCLE:80};
