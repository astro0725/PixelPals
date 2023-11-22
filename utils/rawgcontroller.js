
const RAWG_KEY = `a7f884c3e8d24c95acac41dabed0465d`;    // key for SDR
const RAWG_URL = `https://rawg.io/api/`;

/*
   rawg.io Fetch function: fetch a json response based on search param
   accepts a query parameter, the url to push the parameter to, and the key
   returns the json response from the server
*/
const rawgFetch = function(queryParam, url, key)
{
    
    console.log(url+queryParam+key);

    return fetch(url+queryParam+key)
    .then(function(response)
    {
        return response.json();
    }); // end then
} // end rawgFetch

/*
   getGameByName function: fetch request to the RAWG API. This will pass argument
   as a query parameter to the server.
   it will accept a game name argument - function error handles empty, erroneous spaces,
   and unacceptable special characters (out of ASCII range, endl, tabs, etc)
   returns a JSON of the request from the RAWG server
*/
const displayResults = function (results) {
    const resultsContainer = document.getElementById("results");
    
     // Clear previous results
    resultsContainer.innerHTML = '';
    
     // Check if there are results
     if (results.results.length === 0) {
    resultsContainer.textContent = "No results found.";
    return;
     }
    
     // Create an unordered list to hold the results
     const resultList = document.createElement("ul");
    
     results.results.forEach((result) => {
     // Create a list item
     const listItem = document.createElement("li");
    
     // Create an image element
     const imageElement = document.createElement("img");
    imageElement.src = result.background_image; // Use the API-provided image URL
    imageElement.alt = result.name; // Set alt text for accessibility
    imageElement.style.maxWidth = "100px"; // Set a maximum width for the image (adjust as needed)
    
     // Create a text element for the game name
    const textElement = document.createTextNode(result.name);
    
    // Append the image and text elements to the list item
     listItem.appendChild(imageElement);
     listItem.appendChild(textElement);
    
    // Append the list item to the result list
    resultList.appendChild(listItem);
    });
    
    // Append the result list to the results container
    resultsContainer.appendChild(resultList);
    }

    
const getGameByName = function(gameToFind)
{
    // TESTING COMMENT
    console.log(`getByName envoked`);

    // create a query parameter based on input game
    let qp = `games?search=${gameToFind}`;
    rawgFetch(qp, RAWG_URL, RAWG_KEY)
    .then(function(result)
    {
        displayResults(result);
    });

} // end getGameByName

//

const displayGamesByRating = async (apiKey, ratingMin = 0, ratingMax = 10, pageSize = 10) => {
    const endpoint = "https://api.rawg.io/api/games";
    
    const params = new URLSearchParams({
        key: apiKey,
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
            
            // Get the container element where the game information will be displayed
            const gameContainer = document.getElementById('gameContainer');

            // Display game information
            games.forEach(game => {
                // Create a new paragraph element
                const paragraph = document.createElement('p');
                
                // Set the text content of the paragraph
                paragraph.textContent = `${game.name} - Rating: ${game.rating}`;

                // Add a click event listener to toggle the selected state
                paragraph.addEventListener('click', () => toggleSelection(paragraph));

                // Append the paragraph to the container
                gameContainer.appendChild(paragraph);
            });
        } else {
            console.error(`Error: Unable to fetch games. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

// Function to toggle the selected state
const toggleSelection = (element) => {
    element.classList.toggle('selected');
};

// Function to open the modal with detailed information
const openModal = (game) => {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    
    // Clear previous content
    modalContent.innerHTML = '';

    // Create elements for detailed information
    const heading = document.createElement('h2');
    heading.textContent = game.name;

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${game.rating}`;

    // You can add more details here

    // Append elements to modal content
    modalContent.appendChild(heading);
    modalContent.appendChild(rating);

    // Display the modal
    modal.style.display = 'block';
};

// Function to close the modal
const closeModal = () => {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
};


const apiKey = 'a7f884c3e8d24c95acac41dabed0465d';
displayGamesByRating(apiKey, 8.0);
