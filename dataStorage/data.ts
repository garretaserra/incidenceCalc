import City from './city';
import Region from './region';

/**
 * Singleton pattern
 */

let cityInstance: Map<string, City>;
let regionsInstance: Map<string, Region>;

export default {
    getCities: () => {
        if(cityInstance == null){
            cityInstance = new Map<string, City>();
        }
        return cityInstance;
    },

    getRegions: () => {
        if(regionsInstance == null){
            regionsInstance = new Map<string, Region>();
        }
        return regionsInstance;
    }
}