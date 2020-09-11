import {IReport} from './reports';
import {IMoveModel,IGameModel,MoveTypesEnum, CardsEnum, PositionsEnum, SMUtils} from 's-n-m-lib';
import * as d3 from 'd3';

export class BasicReport implements IReport{

    renderCanvas(canvas,moves: IMoveModel[],game:IGameModel) {
        
        const rect = canvas.nativeElement.getBoundingClientRect();
        const margin:number=50;
        const width:number=rect.width-(margin*2);
        const height:number=500;
        const element = canvas.nativeElement;
        const barWidth = 10;  // Width of the bars
        const players:any={};
        let data:any =[];
        // Define the div for the tooltip
        const div = d3.select("#canvas").append("div")   
            .attr("class", "rpt-tooltip")               
            .style("opacity", 0);

        players[game.player1Uuid]={pile:13,posOffset:0,moveCount:0,playerNo:1};
        players[game.player2Uuid]={pile:13,posOffset:10,moveCount:0,playerNo:2};
        //we only want Player Moves
        console.log(`All moves.length: ${moves.length}`);
        data= moves.filter((m)=>{
            return Number.parseInt(String(m.type)) === MoveTypesEnum.PLAYER;
        });
        console.log(`Player moves.length: ${moves.length}`);
        data.forEach((m)=>{
            const from:number = Number.parseInt(String(m.from));
            const pile1:number = PositionsEnum.PLAYER_PILE
            const pile2:number = PositionsEnum.PLAYER_PILE+10;
            if(from == pile1 || from==pile2){
                m.pileCount = players[m.playerUuid].pile;
                players[m.playerUuid].pile-=1;
            }
            m.id=players[m.playerUuid].moveCount+=1;
        });
        console.log(`players: ${JSON.stringify(players)}`);
        d3.select('svg').remove();

        let svg = d3.select(element).append('svg')
          .attr('left', margin)
          .attr('width', width)
          .attr('height', height)
//          .style('background','red')
          .style('border', '1px solid');
        
        // Create xScale
        const xScale = d3.scaleLinear()
                      .domain([1, moves.length])
                      .range([0, width]);
        
        /* This scale produces negative output for negatve input */
        const yScale = d3.scaleLinear()
                       .domain([0, 13])
                       .range([0, (height/2)]);

        /*
         * We need a different scale for drawing the y-axis. It needs
         * a reversed range, and a larger domain to accomodate negaive values.
         */
        const yAxisScale = d3.scaleLinear()
                           .domain([-13, 13])
                           .range([(height/2) - yScale(-13), 0 ]);
        const yAxis = d3.axisLeft(yAxisScale);
        svg.append('g')
        .attr('transform', function(d) {
          return 'translate(' + margin + ', 0)';
        })
        .call(yAxis);
        
        svg.append("line")          // attach a line
            .style("stroke", "black")  // colour the line
            .attr("x1", margin)     // x position of start of the line
            .attr("y1", height/2)      // y position of start of the line
            .attr("x2", width)     // x position of end of the line
            .attr("y2", height/2);    // y position of end of the line
        
        svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", function(d:any, i) { return margin + ((d.id-1) * barWidth); })
          .attr("y", function(d:any, i) { 
              let y = 0; 
              let barHeight = 0;
              const pileCount = players[d.playerUuid].pile;
              const from:number = Number.parseInt(String(d.from));
              const pile1:number = PositionsEnum.PLAYER_PILE
              const pile2:number = PositionsEnum.PLAYER_PILE+10;
              
              if(players[d.playerUuid].playerNo == 1){
                if(from == pile1){
                    barHeight= yScale(d.pileCount);
                }else{
                    barHeight= yScale(0.2);
                }
                y= (height/2)-barHeight;
              }else{
                y= height/2 ;
              }
              return y;
          })
          .attr("height", function(d:any) {  
              let barHeight = 0;
              const pileCount = players[d.playerUuid].pile;
              const from:number = Number.parseInt(String(d.from));
              const pile1:number = PositionsEnum.PLAYER_PILE;
              const pile2:number = PositionsEnum.PLAYER_PILE+10;

              if(from == pile1 || from == pile2 ){
                  barHeight= yScale(d.pileCount);
              }else{
                  barHeight= yScale(0.2);
              }
              return barHeight
          })
          .attr("width", barWidth)
          .style("fill", function(d:any, i) { 
              let colour = "grey";
              const playerNo = players[d.playerUuid].playerNo;
              const from:number = Number.parseInt(String(d.from));
              const pile1:number = PositionsEnum.PLAYER_PILE;
              const pile2:number = PositionsEnum.PLAYER_PILE+10;

//            console.log(`d[${d.id} move ${JSON.stringify(d)}, pileCount:${d.pileCount}`);
              if(from == pile1 || from == pile2 ){
                  colour = "grey";
              }else if(String(d.isDiscard)==="true"){
                  colour = "red";
              }else if(SMUtils.toFaceNumber(d.card)===CardsEnum.JOKER){
                  colour = "blue";
              }
              
              return colour;
          })
          .style("stroke", "black")
          .style("stroke-width", "1px")
          .style("opacity", function(d, i) { return 1 /*- (i * (1/data.length)); */})   
          .on("mouseover", function(d:any) {      
              div.transition()        
                  .duration(200)      
                  .style("opacity", .9);      
               div.html(`card: ${CardsEnum[SMUtils.toFaceNumber(d.card)]}` )  
                  .style("left", (d3.event.pageX) + "px")     
                  .style("top", (d3.event.pageY - 28) + "px");    
              })                  
          .on("mouseout", function(d) {       
              div.transition()        
                  .duration(500)      
                  .style("opacity", 0);   
          });
    }
}