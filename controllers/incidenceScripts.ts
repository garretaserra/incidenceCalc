import City from '../dataStorage/city';
import data from '../dataStorage/data';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear'
import Region from '../dataStorage/region';
import { Request, Response } from 'express';
dayjs.extend(dayOfYear);

class IncidenceScripts{

    /**
     * POST
     *  /city
     * @param {string} city name of the city
     * @param {string} [region] optional region name of the city 
     * @param {number} population population of the city
     */
    addCity(req: Request, res: Response){
        const cityName = req.body.city;
        const regionName = req.body.region;
        const population = req.body.population;
        const country = req.body.country;

        let city = data.getCities().get(cityName);
        if(city != undefined) return res.status(400).send('City already exists');
        city = new City(cityName, population, country);
        data.getCities().set(cityName, city);
        

        if(regionName){
            let region = data.getRegions().get(regionName);
            if(region){
                region.cities.add(city);
            } else {
                region = new Region(regionName);
                region.cities.add(city);
                data.getRegions().set(regionName, region);
            }
        }
        res.send();
    }

    /**
     * POST
     *  /city/:city/incidence/
     * @param {string} city name of the city
     * @param {date} date ISO 8601 date like 2021-02-01
     * @param {number} incidence number of infected people
     */
    addIncidence(req: Request, res: Response){
        const cityName = req.params.city;
        const dateString = req.body.date;
        const incidence = req.body.incidence;

        const date = dayjs(dateString);
        if(!date.isValid) return res.status(400).send('Invalid ISO 8601 Date')
        const dayOfYear = date.dayOfYear()
        
        let city = data.getCities().get(cityName);
        if(!city) return res.status(400).send('City does not exist');

        city.addIncidence(dayOfYear, incidence);

        res.send();
    }

    /**
     * GET
     *  /city/:city/incidence/:date
     * 
     * @param {string} city name of the city
     * @param {Date} date
     */
    getCityDayIncidence(req: Request, res: Response){
        const cityName = req.params.city;
        const dateString = req.params.date;

        const date = dayjs(dateString);
        if(!date.isValid) return res.status(400).send('Invalid ISO 8601 Date')
        const dayOfYear = date.dayOfYear()

        let city = data.getCities().get(cityName);
        if(!city) return res.status(400).send('City does not exist');
        const incidence = city.dayIncidence.get(dayOfYear);
        if(incidence === undefined) return res.status(404).send('No data for this day');
        const incidenceRate = incidence / city.population * 10**5;

        res.send({incidenceRate});
    }

    /**
     * GET
     *  /city/:city/incidence/:from/:to
     * 
     * Get accumulated incidence rate over time
     * 
     * @param {string} city name of the city
     * @param {Date} from
     * @param {Date} to
     */
    getCityRangeIncidence(req: Request, res: Response){
        const cityName = req.params.city;
        const fromString = req.params.from;
        const toString = req.params.to;

        let city = data.getCities().get(cityName);
        if(!city) return res.status(400).send('City does not exist');

        const dateFrom = dayjs(fromString);
        const dateTo = dayjs(toString);
        if(!dateFrom.isValid || !dateTo.isValid) return res.status(400).send('Invalid ISO 8601 Date');
        const dayOfYearFrom = dateFrom.dayOfYear();
        const dayOfYearTo = dateTo.dayOfYear();

        if(dayOfYearFrom > dayOfYearTo) return res.status(400).send('First date should be before second');

        
        // Accumulate values
        let accumulate = 0;
        for(let i = dayOfYearFrom; i <= dayOfYearTo; i++){
            accumulate += city.dayIncidence.get(i) ?? 0;    // If data doesn't exist for some dates it will be treated as 0
        }
        
        const incidenceRate = accumulate / city.population * 10**5;
        res.send({incidenceRate});
    }

    /**
     * GET
     *  /region/:region/incidence/:date
     * @param {string} region name of the region
     * @param {Date} date
     */
    getRegionDayIncidence(req: Request, res: Response){
        const regionName = req.params.region;
        const dateString = req.params.date;

        let region = data.getRegions().get(regionName);
        if(!region) return res.status(400).send('Region does not exist');

        const date = dayjs(dateString);
        if(!date.isValid) return res.status(400).send('Invalid ISO 8601 Date')
        const dayOfYear = date.dayOfYear()

        let incidenceAccumulator = 0;
        let populationAccumulator = 0;
        for (const city of region.cities.values()){
            incidenceAccumulator += city.dayIncidence.get(dayOfYear) ?? 0;
            populationAccumulator += city.population;
        }

        const incidenceRate = incidenceAccumulator / populationAccumulator * 10**5;
        res.send({incidenceRate});
    }

    /**
     * GET
     *  /region/:region/incidence/:from/:to
     * @param {string} region name of the region
     * @param {Date} from
     * @param {Date} to
     */
    getRegionRangeIncidence(req: Request, res: Response){
        const regionName = req.params.region;
        const fromString = req.params.from;
        const toString = req.params.to;

        let region = data.getRegions().get(regionName);
        if(!region) return res.status(400).send('Region does not exist');

        const dateFrom = dayjs(fromString);
        const dateTo = dayjs(toString);
        if(!dateFrom.isValid || !dateTo.isValid) return res.status(400).send('Invalid ISO 8601 Date');
        const dayOfYearFrom = dateFrom.dayOfYear();
        const dayOfYearTo = dateTo.dayOfYear();

        if(dayOfYearFrom > dayOfYearTo) return res.status(400).send('First date should be before second');

        let incidenceAccumulator = 0;
        let populationAccumulator = 0;
        for (const city of region.cities.values()){
            for(let i = dayOfYearFrom; i <= dayOfYearTo; i++){
                incidenceAccumulator += city.dayIncidence.get(i) ?? 0;    // If data doesn't exist for some dates it will be treated as 0
            }
            populationAccumulator += city.population;
        }
        const incidenceRate = incidenceAccumulator / populationAccumulator * 10**5;
        res.send({incidenceRate});
    }
}

export = new IncidenceScripts();