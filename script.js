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

// Function to dynamically adjust bounds when the window resizes
function adjustBounds() {
    map.invalidateSize();  // Fix layout issues
    map.fitBounds(bounds); // Re-fit the map to match the resized window
}

// Listen for window resize events
window.addEventListener('resize', adjustBounds);

// Define rectangular regions with bounds and names
const rectangles = [
    { bounds: [[200, 420], [350, 750]], name: "Math and Science Center" },
    { bounds: [[350, 390], [500, 585]], name: "Hannah Hall" },
    { bounds: [[350, 585], [500, 800]], name: "Dodge Hall" },
    { bounds: [[500, 790], [720, 900]], name: "Kresge Library" },
    { bounds: [[670, 420], [890, 540]], name: "South Foundation Hall" },
    { bounds: [[829,557],[975,783]], name: "Oakland Center" },
    { bounds: [[974,630],[1083,783]], name: "Oakland Center" },
    { bounds: [[920, 390], [1070, 560]], name: "North Foundation" },
    { bounds: [[976,555],[1049,583]], name: "North Foundation" },
    { bounds: [[1191,422],[1359,634]], name: "Wilson" },
    { bounds: [[1567,91],[1691,362]], name: "HHB" },
    { bounds: [[1438,698],[1566,936]], name: "Vanderburg" },
    { bounds: [[873,798],[1060,986]], name: "O'Dowd" },
    { bounds: [[181,1612],[463,1802]], name: "Pawley" },
    { bounds: [[375,836],[463,1028]], name: "Engineering Center" },
    { bounds: [[453,934],[588,1025]], name: "Engineering Center" },
    { bounds: [[510,1139],[552,1369]], name: "Elliot" },
    { bounds: [[417,1065],[522,1231]], name: "Elliot" },
    { bounds: [[268,1237],[505,1416]], name: "Varner" },
    { bounds: [[673,1251],[791,1429]], name: "Rec Center" },
    { bounds: [[800,1201],[961,1459]], name: "O'rena" },
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
        alert('Please place a duck on the map before submitting.');
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
        alert(`Duck is in: ${regionName}`);
    } else {
        alert('The duck is not within any region. Please place it inside a region.');
    }
});

// List of names
const names = [
    "Dodge", "EC", "Elliot", "Hannah", "Hillcrest", "Humanhealth", "Library",
    "MSC", "NFH", "O'Dowd", "O'Rena", "OC", "Pawley", "Rec", "SFH", "Vandenburg",
    "Varner", "Wilson"
];

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
    const imageCount = 5; // Assume each folder contains 5 images (adjust as needed)
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

