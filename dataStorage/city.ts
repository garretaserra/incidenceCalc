export default class City {
    name: string;
    population: number;
    country: string;
    dayIncidence: Map<number, number>;

    constructor(name, population, country) {
        this.name = name;
        this.population = population;
        this.country = country;
        this.dayIncidence = new Map<number, number>();
    }

    addIncidence(dayOfTheYear, incidence){
        if(incidence > this.population)
            throw Error('Incidence can not be higher than population');

        this.dayIncidence.set(dayOfTheYear, incidence);
    }
}
