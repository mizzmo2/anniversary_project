// Utilities interfaces with Firebase.js to separate out logic from main.js and the general HTML.

import { addReadingList, addCurrentReading, addWotw, addChipToBothLists } from "./firebase.js";
// Import image functions from firebase
import { getImagesFromFolder } from "./firebase.js";

export async function waitReadingList(title, author, who){
    if (!title || !author || !who) return;
    await addReadingList(title, author, who)
    
}

export async function waitCurrentReading(title, author, who, review, rating){
    if (!title || !author || !who || !review || !rating) return;
    await addCurrentReading(title, author, who, review, rating)
    
}

export async function waitAddWant(want, link, who){
    if (!want || !link || !who) return;
    await addWotw(want, link, who)
    
}

export async function waitAddChip(name) {
    if(!name) return;
    await addChipToBothLists(name);
}




let currentImageIndex = 0;
let imagesList = [];

/**
 * Initialize the image viewer
 * @param {string} folderPath - Path to the Firebase Storage folder containing images
 */
export async function initializeImageViewer(folderPath = "images") {
    try {
        // Fetch all images from the specified folder
        imagesList = await getImagesFromFolder(folderPath);
        
        // Sort images by name (optional - you can customize sorting)
        imagesList.sort((a, b) => a.name.localeCompare(b.name));
        
        console.log(`Loaded ${imagesList.length} images`);
        
        if (imagesList.length > 0) {
            displayImage(0);
        } else {
            displayNoImagesMessage();
        }
        
        // Setup navigation buttons
        setupNavigationButtons();
        
    } catch (error) {
        console.error("Error initializing image viewer:", error);
        displayErrorMessage();
    }
}

/**
 * Display image at specified index
 * @param {number} index - Index of image to display
 */
function displayImage(index) {
    if (imagesList.length === 0) return;
    
    // Wrap around if index is out of bounds
    if (index < 0) {
        currentImageIndex = imagesList.length - 1;
    } else if (index >= imagesList.length) {
        currentImageIndex = 0;
    } else {
        currentImageIndex = index;
    }
    
    const imageContainer = document.getElementById("image_container");
    if (imageContainer) {
        imageContainer.src = imagesList[currentImageIndex].url;
        imageContainer.alt = imagesList[currentImageIndex].name;
    
    }
}


/**
 * Setup navigation button event listeners
 */

function setupNavigationButtons() {
    const nextBtn = document.getElementById("next_button");
    const prevBtn = document.getElementById("prev_button");
    
    console.log("Setting up navigation buttons...");
    console.log("Next button:", nextBtn);
    console.log("Prev button:", prevBtn);
    
    if (nextBtn) {
        // Remove any existing listeners by cloning
        const newNextBtn = nextBtn.cloneNode(true);
        nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
        
        newNextBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("NEXT CLICKED! Current index:", currentImageIndex);
            displayImage(currentImageIndex + 1);
        };
        
        newNextBtn.style.cursor = "pointer";
        console.log("Next button click handler attached");
    } else {
        console.error("Next button not found!");
    }
    
    if (prevBtn) {
        // Remove any existing listeners by cloning
        const newPrevBtn = prevBtn.cloneNode(true);
        prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
        
        newPrevBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("PREV CLICKED! Current index:", currentImageIndex);
            displayImage(currentImageIndex - 1);
        };
        
        newPrevBtn.style.cursor = "pointer";
        console.log("Previous button click handler attached");
    } else {
        console.error("Previous button not found!");
    }
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            console.log("Right arrow pressed");
            displayImage(currentImageIndex + 1);
        } else if (e.key === "ArrowLeft") {
            console.log("Left arrow pressed");
            displayImage(currentImageIndex - 1);
        }
    });
    
    console.log("Navigation setup complete");
}

/**
 * Display message when no images are found
 */
function displayNoImagesMessage() {
    const imageContainer = document.getElementById("image_container");
    if (imageContainer) {
        imageContainer.src = "image/colour-bars.png";
        imageContainer.alt = "No documents found";
    }
}

/**
 * Display error message
 */
function displayErrorMessage() {
    const imageContainer = document.getElementById("image_container");
    if (imageContainer) {
        imageContainer.src = "image/colour-bars.png";
        imageContainer.alt = "Error loading documents";
    }
}

