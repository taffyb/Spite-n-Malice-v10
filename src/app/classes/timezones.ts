export class Location {
    timezone:string;
    constructor(timezone:string){
        this.timezone=timezone;
    }
    area(){
        return this.timezone.split("/")[0];
    }
    location(){
        const arr=this.timezone.split("/");
        if(arr.length>1){
            return this.timezone.split("/")[1];
        }else{
            return "";
        }
    }
    region(){
        const arr=this.timezone.split("/");
        if(arr.length>2){
            return this.timezone.split("/")[2];
        }else{
            return "";
        }
    }
};
export class TimeZone{
    abbreviation:string;
    client_ip:string;
    datetime:string;
    day_of_week:number;
    day_of_year:number;
    dst:boolean;
    dst_from:string;
    dst_offset:number;
    dst_until:string;
    raw_offset:number;
    timezone:string;
    unixtime:number;
    utc_datetime:string;
    utc_offset:string;
    week_number:number;
}