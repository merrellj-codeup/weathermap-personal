class Loading {
    constructor(target){
        this.target = target;
        this.element = this.render();
    }
    render(){
        // create the node for the loading pane
        const loading = document.createElement('div');
        loading.classList.add('loading-pane');
        loading.innerHTML = `
                <div class="loading-spinner">
                    <div class="loading-spinner-circle"></div>
                </div>
                <div class="loading-text">Loading...</div>
        `;
        //list of funny loading messages
        const loadingMessages = [
            'Fist-fighting with Mapbox...',
            'Reticulating splines...',
            'Asking ChatGPT for help...',
            'Adjusting flux capacitor...',
            'Cat herding rogue-pixels...',
            'Warming up the server...',
            'Loading weather data...',
            'Still faster than Windows update...',
            'Caching the cache...'
        ]
        // shuffle the loading messages
        const shuffledMessages = loadingMessages.sort(() => Math.random() - 0.5);
        // interval to change the loading message
        let i = 0;
        setInterval(() => {
            loading.querySelector('.loading-text').innerHTML = shuffledMessages[i];
            i++;
            if (i >= shuffledMessages.length) {
                i = 0;
            }
        }, 2000);
        
        return loading;
    }
    start(){
        //add the loading pane to the DOM
        this.target.appendChild(this.element);
        //add the loading class to the page-wrapper
        document.querySelector('.page-wrapper').classList.add('loading');
        //fade in the loading pane
        this.element.classList.add('fade-in');
    }
    stop(){
        //fade out the loading pane
        this.element.classList.add('fade-out');
        document.querySelector('.page-wrapper').classList.remove('loading');
        //remove the loading pane from the DOM after .3s
        setTimeout(() => {
            this.element.remove();
        }, 300);
    }
}

export default Loading;