export const API_KEY = "AIzaSyAYSG0z-4VXp_YPRY9humvy3JiADKxXZA4";

export const value_convertor= (value) =>{
    
    if(value>=1000000){
        return Math.floor(value/1000000)+"M"
    }
    else if(value>=1000){
        return Math.floor(value/1000)+"K"

    }else{
        return value
    }
}