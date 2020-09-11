import { Component, OnInit,Input,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';
import {IGaugeModel} from './gauge.data';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit { 
    uuid:string;
    @Input()a:IGaugeModel;
    @Input()b:IGaugeModel;    
    @ViewChild(uuid, {read: ElementRef,static:true})   
    private canvas: ElementRef;

    constructor() {
      this.uuid='taffy';
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.renderGauge(this.uuid,this.a,this.b);
    }
    renderGauge(uuid:string,a:IGaugeModel,b:IGaugeModel){
        const total:number = a.value+b.value;
        const scaleTicks = d3.scaleLinear()
            .domain([0, total])
            .range([0, Math.PI]);
        const width:number=100;
        const radius:number=(width /2);
        
        const id="#"+uuid;
        const svg = d3.select(id).append('svg')
            .attr('left', 0)
            .attr('top', 0)
            .attr('width', width)
            .attr('height', radius);
                

        const div = d3.select(id).append("div")   
            .attr("class", "rpt-tooltip")               
            .style("opacity", 0);
        
        //draw two arcs left and right
        svg.append('path')
            .attr("transform",`translate(${radius},${radius}) rotate(-90)`)
            .style('fill','blue')
            .style('stroke','black')
            .attr('d', specifyArc(0,total*(a.value/(total))))   
            .on("mouseover", function(d:any) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                 div.html(`wins: ${a.value}` )  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });
        
        svg.append('path')
            .attr("transform",`translate(${radius},${radius}) rotate(-90)`)
            .style('fill','red')
            .style('stroke','black')
            .attr('d', specifyArc(total*(a.value/(total)),total))   
            .on("mouseover", function(d:any) {      
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
                 div.html(`wins: ${b.value}` )  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px");    
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
            });
        
        function specifyArc(start, end) {
          return d3.arc()
            .startAngle(scaleTicks(start))
            .endAngle(scaleTicks(end))
            .innerRadius(0)
            .outerRadius(width/2);
        }
    }
}
