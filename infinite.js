// Initialize the map
const map = L.map('map', {
    crs: L.CRS.Simple, // Use a simple coordinate reference system
    minZoom: -2, // Allow zooming out
    maxZoom: 2, // Allow zooming in
});

// Define the image dimensions (replace with actual dimensions of OUmap.png)
const imageWidth = 2000; // Example width
const imageHeight = 1700; // Example height
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Add the image as a layer
const imageUrl = 'OUmap.png'; // Ensure this file is in the same directory
L.imageOverlay(imageUrl, bounds).addTo(map);

// Set the initial view to fit the image
map.fitBounds(bounds);

// Set the maximum bounds to restrict panning
map.setMaxBounds(bounds);

// Define rectangular regions with bounds and names
const rectangles = [
    { bounds: [[200, 420], [350, 750]], name: "Math and Science Center" },
    { bounds: [[350, 390], [500, 585]], name: "Hannah Hall" },
    { bounds: [[350, 585], [500, 800]], name: "Dodge Hall" },
    { bounds: [[500, 790], [720, 900]], name: "Kresge Library" },
    { bounds: [[670, 420], [890, 540]], name: "South Foundation Hall" },
    { bounds: [[829,557],[975,783]], name: "Oakland Center" },
    { bounds: [[974,630],[1083,783]], name: "Oakland Center" },
    { bounds: [[920, 390], [1070, 560]], name: "North Foundation Hall" },
    { bounds: [[976,555],[1049,583]], name: "North Foundation Hall" },
    { bounds: [[1191,422],[1359,634]], name: "Wilson Hall" },
    { bounds: [[1567,91],[1691,362]], name: "Human Health Building" },
    { bounds: [[1438,698],[1566,936]], name: "Vandenberg Hall" },
    { bounds: [[873,798],[1060,986]], name: "O'Dowd Hall" },
    { bounds: [[181,1612],[463,1802]], name: "Pawley Hall" },
    { bounds: [[375,836],[463,1028]], name: "Engineering Center" },
    { bounds: [[453,934],[588,1025]], name: "Engineering Center" },
    { bounds: [[510,1139],[552,1369]], name: "Elliot Hall" },
    { bounds: [[417,1065],[522,1231]], name: "Elliot Hall" },
    { bounds: [[268,1237],[505,1416]], name: "Varner Hall" },
    { bounds: [[673,1251],[791,1429]], name: "Rec Center" },
    { bounds: [[800,1201],[961,1459]], name: "O'Rena" },
    { bounds: [[9,1218],[177,1744]], name: "Hillcrest Hall" }
];

// Add rectangles to the map
rectangles.forEach(region => {
    const rectangle = L.rectangle(region.bounds, {
        color: 'transparent', // Make the border invisible
        weight: 0, // Remove the border weight
        fillOpacity: 0 // Make the fill completely transparent
    }).addTo(map);
});

// Define the icon for the rubber duck
const duckIcon = L.icon({
    iconUrl: 'rubber-duck-icon.png', // Ensure this file is in the same directory
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 16] // Anchor point of the icon (centered)
});

let currentDuckMarker = null; // Variable to store the current duck marker

const submitButton = document.getElementById('submit-button');
submitButton.disabled = true; // Initially disable the button

// Function to check if the duck is within a region
function isDuckInRegion() {
    if (!currentDuckMarker) return false;

    const duckPosition = currentDuckMarker.getLatLng();
    return rectangles.some(region => {
        const bounds = L.latLngBounds(region.bounds);
        return bounds.contains(duckPosition);
    });
}

// Add a click event to the map for placing the icon
map.on('click', (e) => {
    // Remove the existing duck marker if it exists
    if (currentDuckMarker) {
        map.removeLayer(currentDuckMarker);
    }

    // Place a new duck marker
    currentDuckMarker = L.marker(e.latlng, { icon: duckIcon }).addTo(map);

    // Enable or disable the submit button based on the duck's position
    submitButton.disabled = !isDuckInRegion();
});

// Handle the "Submit" button click
submitButton.addEventListener('click', () => {
    if (!currentDuckMarker) {
        return;
    }

    const duckPosition = currentDuckMarker.getLatLng();
    let regionName = null;

    // Check if the duck is within any region
    rectangles.forEach(region => {
        const bounds = L.latLngBounds(region.bounds);
        if (bounds.contains(duckPosition)) {
            regionName = region.name;
        }
    });

    if (regionName) {
        if (regionName === currentChosenName) {
            score++; // Increment the score
            updateScore(); // Update the score display
            currentChosenName = startNewRound(); // Start a new round
        } else {
            if (correctRectangle) {
                highlightCorrectRectangle(correctRectangle); // Highlight the correct rectangle
                setTimeout(() => {
                    currentChosenName = startNewRound(); // Start a new round after highlighting
                }, 2000);
            }
        }
    } else {
        alert('The duck is not within any region. Please place it inside a region.');
    }
});

// Function to highlight the correct rectangle temporarily
function highlightCorrectRectangle(correctRegion) {
    const correctBounds = L.latLngBounds(correctRegion.bounds);
    const tempRectangle = L.rectangle(correctBounds, {
        color: 'green',
        weight: 2,
        fillOpacity: 0.5
    }).addTo(map);

    // Remove the temporary rectangle after 2 seconds
    setTimeout(() => {
        map.removeLayer(tempRectangle);
    }, 2000);
    
}

// List of names
const names = [
    "Dodge Hall", "Engineering Center", "Elliot Hall", "Hannah Hall", "Hillcrest Hall", 
    "Human Health Building", "Kresge Library", "Math and Science Center", "North Foundation Hall", 
    "O'Dowd Hall", "O'Rena", "Oakland Center", "Pawley Hall", "Rec Center", "South Foundation Hall", 
    "Vandenberg Hall", "Varner Hall", "Wilson Hall"
];

// Mapping of folder names to the number of images in each folder
const folderImageCounts = {
    "Dodge Hall": 10,
    "Engineering Center": 9,
    "Elliot Hall": 12,
    "Hannah Hall": 9,
    "Hillcrest Hall": 10,
    "Human Health Building": 6,
    "Kresge Library": 10,
    "Math and Science Center": 13,
    "North Foundation Hall": 5,
    "O'Dowd Hall": 10,
    "O'Rena": 8,
    "Oakland Center": 13,
    "Pawley Hall": 12,
    "Rec Center": 10,
    "South Foundation Hall": 12,
    "Vandenberg Hall": 3,
    "Varner Hall": 8,
    "Wilson Hall": 6
};

// Function to randomly choose a name
function chooseRandomName() {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

// Function to set a random background image based on the chosen name
function setRandomBackground(name) {
    const folderPath = `Random_Photos/${name}`; // Path to the folder
    const imageCount = 1; // Assume each folder contains 5 images (adjust as needed)
    const randomImageIndex = Math.floor(Math.random() * imageCount) + 1; // Random image index (1-based)
    const imageUrl = `${folderPath}/image${randomImageIndex}.jpg`; // Construct the image path

    // Set the background image of the map container
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.backgroundImage = `url('${imageUrl}')`;
    mapContainer.style.backgroundSize = 'cover';
    mapContainer.style.backgroundPosition = 'center';
}

// Function to set a random image in the image container based on the chosen name
function setRandomImage(name) {
    const folderPath = `Random_Photos/${name}`; // Path to the folder
    const imageCount = folderImageCounts[name] || 1; // Default to 1 if the folder is not in the mapping
    const randomImageIndex = Math.floor(Math.random() * imageCount) + 1; // Random image index (1-based)
    const imageUrl = `${folderPath}/image${randomImageIndex}.jpg`; // Construct the image path

    // Set the image source in the image container
    const randomImageElement = document.getElementById('random-image');
    randomImageElement.src = imageUrl;
}

// Randomly choose a name and set the image
const chosenName = chooseRandomName();
const randomNameElement = document.getElementById('random-name');
randomNameElement.textContent = `Randomly chosen: ${chosenName}`;
setRandomImage(chosenName);

// Display the randomly chosen name

let score = 0; // Initialize the score
const scoreElement = document.getElementById('score');

let correctRectangle = null; // Variable to store the correct rectangle for the current round

// Function to update the score display
function updateScore() {
    scoreElement.textContent = score;
}

// Function to start a new round
function startNewRound() {
    const chosenName = chooseRandomName();
    randomNameElement.textContent = `Randomly chosen: ${chosenName}`;
    setRandomImage(chosenName);

    // Find and set the correct rectangle for the chosen name
    correctRectangle = rectangles.find(region => region.name === chosenName);

    return chosenName;
}

// Start the first round
let currentChosenName = startNewRound();

