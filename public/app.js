// Dog vs Cat Voting App

const API_URL = '';
const STORAGE_KEY = 'dogvscat_votes';

// DOM Elements
const dogImage = document.getElementById('dog-image');
const catImage = document.getElementById('cat-image');
const dogSpinner = document.getElementById('dog-spinner');
const catSpinner = document.getElementById('cat-spinner');
const dogVotesEl = document.getElementById('dog-votes');
const catVotesEl = document.getElementById('cat-votes');
const totalVotesEl = document.getElementById('total-votes');
const refreshBtn = document.querySelector('.refresh-btn');
const dogVoteBtn = document.querySelector('.dog-btn');
const catVoteBtn = document.querySelector('.cat-btn');

// Vote state
let votes = {
    dog: 0,
    cat: 0
};

// Load initial data
async function init() {
    loadVotesFromStorage();
    updateVoteDisplay();
    await Promise.all([
        loadDogImage(),
        loadCatImage()
    ]);
}

// Load votes from localStorage
function loadVotesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            votes = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading votes from storage:', error);
        votes = { dog: 0, cat: 0 };
    }
}

// Save votes to localStorage
function saveVotesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
    } catch (error) {
        console.error('Error saving votes to storage:', error);
    }
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

// Vote for dog or cat
function vote(type) {
    if (type !== 'dog' && type !== 'cat') return;
    
    // Increment vote
    votes[type]++;
    
    // Save to localStorage
    saveVotesToStorage();
    
    // Update display with animation
    updateVoteDisplay();
    animateCounter(type);
    
    // Button animation
    const btn = type === 'dog' ? dogVoteBtn : catVoteBtn;
    animateButton(btn);
}

// Animate counter increment
function animateCounter(type) {
    const counterEl = type === 'dog' ? dogVotesEl : catVotesEl;
    counterEl.style.transform = 'scale(1.3)';
    counterEl.style.color = type === 'dog' ? 'var(--color-accent-warm)' : 'var(--color-accent-cool)';
    
    setTimeout(() => {
        counterEl.style.transform = 'scale(1)';
        counterEl.style.color = '';
    }, 200);
}

// Animate button press
function animateButton(btn) {
    btn.classList.add('voted');
    btn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        btn.style.transform = '';
        btn.classList.remove('voted');
    }, 150);
}

// Update vote display
function updateVoteDisplay() {
    dogVotesEl.textContent = votes.dog;
    catVotesEl.textContent = votes.cat;
    totalVotesEl.textContent = votes.dog + votes.cat;
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
