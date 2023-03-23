import keys from '../keys.js';

class ChatGPT {
    constructor(forecastObject){
        this.forecast = forecastObject;
        this.response;
    }
    async getChat(){
        let currentDate = new Date();
        // get current time of day
        let timeOfDay;
        if (currentDate.getHours() >= 5 && currentDate.getHours() < 12) {
            timeOfDay = "morning";
        } else if (currentDate.getHours() >= 12 && currentDate.getHours() < 17) {
            timeOfDay = "afternoon";
        } else if (currentDate.getHours() >= 17 && currentDate.getHours() < 20) {
            timeOfDay = "evening";
        } else {
            timeOfDay = "night";
        }
        const forecastString = JSON.stringify(this.forecast);
        const trumpPrompt = `You are a weatherman that is giving a one-paragraph summary of the current weather in the style of Donald Trump. Don't focus on the statistics, just make it funny and have little to do with actual weather. Have at least 1 line that insults a random politician. The current time of day is ${timeOfDay}. The weather data is in the following object: ${forecastString}`;

        const arnoldPrompt = `You are a weatherman that is giving a one-paragraph summary of the current weather in the style of Arnold Schwarzenegger. Don't focus on the statistics, just make it funny and have little to do with actual weather. Have at least reference to a famous line from his movies. Be sure to alter spelling to account for his accent. The current time of day is ${timeOfDay}. The weather data is in the following object: ${forecastString}`;

        const dangerfieldPrompt = `You are Rodney Dangerfield performing a skit about the weather. Don't focus on the statistics, just make it funny and have little to do with actual weather. The current time of day is ${timeOfDay}. The weather data is in the following object: ${forecastString}`;
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${keys.chatgpt}`);
        // myHeaders.append("Content-Type", "application/json");
        let raw = JSON.stringify({
            "prompt": arnoldPrompt,
            "max_tokens": 500,
            "temperature": 1,
        });
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        try {
            let response = await fetch("https://us-central1-codeup-website.cloudfunctions.net/openai/chat", requestOptions);
            let result = await response.json();
            console.log(result);
            this.response = result.choices[0].text;
            return this.response;
        } catch (error) {
            console.log(error);
            return 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore nisi obcaecati nostrum optio harum maiores alias autem voluptatum doloremque quasi eos nihil, molestiae fugiat, ea repellendus quisquam et quas rem!'
        }
    }

}

export default ChatGPT;