import Forecast from './forecast.js';

class Result {
    constructor(data, map){
        this.id = data.id;
        this.map = map;
        this.state = data.context[1].text;
        this.country = data.context[2].text;
        this.type = data.type;
        this.place_type = data.place_type;
        this.relevance = data.relevance;
        this.properties = data.properties;
        this.text_en = data.text_en;
        this.language_en = data.language_en;
        this.place_name_en = data.place_name_en;
        this.text = data.text;
        this.language = data.language;
        this.place_name = data.place_name;
        this.bbox = data.bbox;
        this.center = data.center;
        this.geometry = data.geometry;
        this.context = data.context;
        this.render();
    }
    render(){
        const result = document.createElement('div');
        result.classList.add('container', 'location-result');
        result.innerHTML = `
            <div class="row">
                <div class="column">
                    <h3>${this.text_en}</h3>
                    <p>${this.state}</p>
                    <p>${this.country}</p>
                    <button class="location-result-button">See Forecast</button>
                </div>
            </div>
        `;
        const button = result.querySelector('.location-result-button');
        //add click event listener to result
        result.addEventListener('click', e => {
            //if the node clicked was the button node, do this
            if(e.target === button){
                //get forecast
                const forecast = new Forecast(this.center, this.text_en);
            }
            else {
                //fly to the location
                this.map.flyTo({
                    center: [this.center[0] - 0.1, this.center[1]],
                    zoom: 10
                });
            }
        });
        
        const resultsContainer = document.querySelector('.location-search-pane');
        resultsContainer.appendChild(result);
    }
}

export default Result;

// Example result object
const exampleObject = {
    "id": "place.291252460",
    "type": "Feature",
    "place_type": [
        "place"
    ],
    "relevance": 1,
    "properties": {
        "wikidata": "Q975",
        "mapbox_id": "dXJuOm1ieHBsYzpFVndvN0E"
    },
    "text_en": "San Antonio",
    "language_en": "en",
    "place_name_en": "San Antonio, Texas, United States",
    "text": "San Antonio",
    "language": "en",
    "place_name": "San Antonio, Texas, United States",
    "bbox": [
        -98.88641,
        29.100796,
        -98.253657,
        29.749
    ],
    "center": [
        -98.495141,
        29.4246
    ],
    "geometry": {
        "type": "Point",
        "coordinates": [
            -98.495141,
            29.4246
        ]
    },
    "context": [
        {
            "id": "district.1648364",
            "wikidata": "Q16861",
            "mapbox_id": "dXJuOm1ieHBsYzpHU2Jz",
            "text_en": "Bexar County",
            "language_en": "en",
            "text": "Bexar County",
            "language": "en"
        },
        {
            "id": "region.181484",
            "short_code": "US-TX",
            "wikidata": "Q1439",
            "mapbox_id": "dXJuOm1ieHBsYzpBc1Rz",
            "text_en": "Texas",
            "language_en": "en",
            "text": "Texas",
            "language": "en"
        },
        {
            "id": "country.8940",
            "short_code": "us",
            "wikidata": "Q30",
            "mapbox_id": "dXJuOm1ieHBsYzpJdXc",
            "text_en": "United States",
            "language_en": "en",
            "text": "United States",
            "language": "en"
        }
    ]
}