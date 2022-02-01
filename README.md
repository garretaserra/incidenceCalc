# Incidence calculator
This server has an API for saving and retrieving data of the incidence rates of COVID in various cities/regions:
## Installation of dependencies
```
npm i
```
## Install Typescript CLI Globally
If you don't already have Typescript CLI install it:
```
npm install typescript -g
```

## Start server
This will compile the typescript on to `/build` file and run the javascript
```
npm run start
```

# API
## Create a City
`POST /city`
```json
{
    "city": "string",
    "region": "string (optional)",
    "country": "string",
    "population": "number"
}
```

## Add Incidence data to a City
`POST /city/{city}/incidence/`
```json
{
    "date": "ISO 8601",
    "incidence": "number",
}
```

## Get Incidence rate by city in a day
`GET /city/{city}/incidence/{date}`

## Get Incidence rate by city in a range of days
`GET /city/{city}/incidence/{from}/{to}`

## Get Incidence rate by region in a day
`GET /region/{region}/incidence/{date}`

## Get Incidence rate by region in a range of days
`GET /region/{region}/incidence/{from}/{to}`

## Responses
All successful responses of the GET requests will have the body with the format:
```json
{
    "incidenceRate": "number"
}
```
Indicating the incidence rate per 100.000 people.

# Remarks
- Because all the data is stored in memory it will be lost on every server restart.
- Dates should be in ISO 8601 like 2022-02-01 for the first of February.
- The server is only considering ranges of dates within the same year.
- Every search that is being made in the data structure is in a Map so that is it fast to retrieve one entry.
- For retrieving multiple entries iteration over each is needed, the performace could be improved by keeping track of the total population of the regions instead of calculating it every time by adding all the cities.
- Also if we consider that there is the typical use case of searching for ranges of natural weeks, the performance could also be improved by keeping track weekly of the incidence in a city. This would increase memory usage but would improve performace.