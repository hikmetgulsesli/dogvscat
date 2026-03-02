// Dog vs Cat Voting App

const API_URL = '';

// DOM Elements
const dogImage = document.getElementById('dog-image');
const catImage = document.getElementById('cat-image');
const dogSpinner = document.getElementById('dog-spinner');
const catSpinner = document.getElementById('cat-spinner');
const dogVotesEl = document.getElementById('dog-votes');
const catVotesEl = document.getElementById('cat-votes');
const totalVotesEl = document.getElementById('total-votes');
const refreshBtn = document.querySelector('.refresh-btn');

// Load initial data
async function init() {
    await Promise.all([
        loadDogImage(),
        loadCatImage(),
        loadVotes()
    ]);
}

// Fetch random dog image
async function loadDogImage() {
    showSpinner('dog');
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        dogImage.src = data.message;
        dogImage.onload = () => hideSpinner('dog');
    } catch (error) {
        console.error('Error loading dog image:', error);
        hideSpinner('dog');
    }
}

// Fetch random cat image
async function loadCatImage() {
    showSpinner('cat');
    try {
        // Add random query param to prevent caching
        catImage.src = `https://cataas.com/cat?random=${Date.now()}`;
        catImage.onload = () => hideSpinner('cat');
    } catch (error) {
        console.error('Error loading cat image:', error);
        hideSpinner('cat');
    }
}

// Show spinner
function showSpinner(type) {
    const spinner = type === 'dog' ? dogSpinner : catSpinner;
    spinner.classList.add('active');
}

// Hide spinner
function hideSpinner(type) {
    const spinner = type === 'dog' ? dogSpinner : catSpinner;
    spinner.classList.remove('active');
}

// Load votes from server
async function loadVotes() {
    try {
        const response = await fetch('/api/votes');
        const data = await response.json();
        updateVoteDisplay(data);
    } catch (error) {
        console.error('Error loading votes:', error);
    }
}

// Vote for dog or cat
async function vote(type) {
    try {
        const response = await fetch(`/api/vote/${type}`, {
            method: 'POST'
        });
        const data = await response.json();
        updateVoteDisplay(data);
        
        // Visual feedback
        const btn = type === 'dog' 
            ? document.querySelector('.dog-btn') 
            : document.querySelector('.cat-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 100);
    } catch (error) {
        console.error('Error voting:', error);
    }
}

// Update vote display
function updateVoteDisplay(data) {
    dogVotesEl.textContent = data.dog;
    catVotesEl.textContent = data.cat;
    totalVotesEl.textContent = data.dog + data.cat;
}

// Refresh both images
async function refreshImages() {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Loading...';
    
    await Promise.all([
        loadDogImage(),
        loadCatImage()
    ]);
    
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Load New Images';
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Expose functions globally for onclick handlers
window.vote = vote;
window.refreshImages = refreshImages;
