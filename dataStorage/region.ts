import City from "./city";

class Region {
    public name: string;
    public cities: Set<City>;

    constructor(name){
        this.name = name;
        this.cities = new Set<City>();
    }
}
export default Region;