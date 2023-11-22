const GameController = {
    apiKey: 'a7f884c3e8d24c95acac41dabed0465d', // Replace with your actual API key
    gameContainer: null,

    init: function () {
        this.gameContainer = document.getElementById('gameContainer');
        this.displayGamesByRating(8.0);
    },

    displayGamesByRating: async function (ratingMin = 0, ratingMax = 10, pageSize = 10) {
        const endpoint = "https://api.rawg.io/api/games";
        
        const params = new URLSearchParams({
            key: this.apiKey,
            page_size: pageSize,
            ordering: '-rating',
            rating_min: ratingMin,
            rating_max: ratingMax,
        });

        const url = `${endpoint}?${params.toString()}`;

        try {
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                const games = data.results || [];

                // Display game information
                games.forEach(game => {
                    const paragraph = this.createGameParagraph(game);
                    this.gameContainer.appendChild(paragraph);
                });
            } else {
                console.error(`Error: Unable to fetch games. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    },

    createGameParagraph: function (game) {
        const paragraph = document.createElement('p');
        paragraph.textContent = `${game.name} - Rating: ${game.rating}`;

        // Add a click event listener to toggle the selected state
        paragraph.addEventListener('click', () => this.toggleSelection(paragraph));

        return paragraph;
    },

    toggleSelection: function (element) {
        element.classList.toggle('selected');
    },
};

// Initialize the GameController
GameController.init();