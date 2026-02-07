// ==========================================
// ECOBIN - JavaScript Controller
// ==========================================

// State Management
let currentScreen = 'home-screen';
let selectedWasteType = null;
let scanningInProgress = false;

// Waste type database with dummy detection data
const wasteDatabase = {
    phone: {
        name: 'Smartphone',
        value: '₹450',
        confidence: '94%',
        explanation: 'High confidence based on shape, size, and material detection. Our AI identified the screen, ports, and battery components.',
        co2Saved: '1.8 kg',
        energyDays: '5',
        ecoPoints: 120
    },
    battery: {
        name: 'Lithium Battery',
        value: '₹180',
        confidence: '96%',
        explanation: 'Very high confidence. Battery terminals, cylindrical shape, and chemical composition clearly identified.',
        co2Saved: '0.9 kg',
        energyDays: '3',
        ecoPoints: 90
    },
    laptop: {
        name: 'Laptop Computer',
        value: '₹850',
        confidence: '92%',
        explanation: 'High confidence. Keyboard layout, screen hinge, and motherboard components detected successfully.',
        co2Saved: '3.2 kg',
        energyDays: '12',
        ecoPoints: 200
    },
    charger: {
        name: 'USB Charger',
        value: '₹120',
        confidence: '89%',
        explanation: 'Good confidence. USB port configuration and circuit board pattern recognized.',
        co2Saved: '0.5 kg',
        energyDays: '2',
        ecoPoints: 60
    }
};

// ==========================================
// Navigation System
// ==========================================

// Navigation history stack
let screenHistory = [];

function navigateTo(screenId, isBack = false) {
    const currentScreenElement = document.querySelector('.screen.active');
    const targetScreenElement = document.getElementById(screenId + '-screen');

    if (!targetScreenElement) {
        console.error(`Screen ${screenId} not found`);
        return;
    }

    // Handle history
    if (!isBack && currentScreenElement) {
        const currentId = currentScreenElement.id.replace('-screen', '');
        // Only push to history if it's not a background-to-background transition
        if (currentId !== screenId && currentId !== 'landing' && currentId !== 'signup') {
            screenHistory.push(currentId);
        }
    }

    // Reset history if going back to the start
    if (screenId === 'landing') {
        screenHistory = [];
    }

    // Add exit animation to current screen
    if (currentScreenElement) {
        currentScreenElement.classList.add('exiting');

        // Wait for exit animation
        setTimeout(() => {
            currentScreenElement.classList.remove('active', 'exiting');
        }, 300);
    }

    // Activate new screen with entrance animation
    setTimeout(() => {
        targetScreenElement.classList.add('active');
        currentScreen = screenId + '-screen';

        // Screen-specific initialization
        initializeScreen(screenId);

        // Show/hide floating home button
        const homeBtn = document.getElementById('floating-home-btn');
        if (homeBtn) {
            // Hide on landing and home screens, show on all others
            if (screenId === 'landing' || screenId === 'home') {
                homeBtn.style.display = 'none';
            } else {
                homeBtn.style.display = 'flex';
            }
        }

        // Show/hide back to app button on landing screen
        const backToAppBtn = document.getElementById('back-to-app-btn');
        if (backToAppBtn) {
            if (screenId === 'landing' && screenHistory.length > 0) {
                backToAppBtn.style.display = 'flex';
            } else {
                backToAppBtn.style.display = 'none';
            }
        }
    }, 150);
}

function goBack() {
    if (screenHistory.length > 0) {
        const prevScreen = screenHistory.pop();
        navigateTo(prevScreen, true);
    } else {
        navigateTo('home');
    }
}

// ==========================================
// Screen Initialization
// ==========================================

function initializeScreen(screenId) {
    switch (screenId) {
        case 'home':
            resetAllStates();
            break;
        case 'map':
            initializeMap();
            break;
        case 'scanning':
            resetScanningUI();
            break;
        case 'result':
            showDetectionResult();
            break;
    }
}

function resetAllStates() {
    selectedWasteType = null;
    scanningInProgress = false;
}

// ==========================================
// Waste Selection
// ==========================================

function selectWaste(wasteType) {
    selectedWasteType = wasteType;

    // Add visual feedback
    const selectedCard = event.currentTarget;
    selectedCard.style.transform = 'scale(0.95)';

    setTimeout(() => {
        selectedCard.style.transform = '';
        navigateTo('map');
    }, 200);
}

// ==========================================
// Scanning Functionality
// ==========================================

function resetScanningUI() {
    const scanContent = document.getElementById('scan-content');
    const scanText = document.querySelector('.scan-text');

    scanContent.innerHTML = `
        <svg viewBox="0 0 200 200" class="scan-icon">
            <circle cx="100" cy="100" r="60" fill="none" stroke="#A8E6CF" stroke-width="3" stroke-dasharray="5,5" class="rotate-animation"/>
            <path d="M 70 100 L 85 115 L 130 70" stroke="#5FB87C" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0" class="check-animation"/>
        </svg>
        <p class="scan-text">Position your item in the frame</p>
    `;
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Simulate file processing
    startScanning();
}

function simulateScan() {
    startScanning();
}

function startScanning() {
    if (scanningInProgress) return;
    scanningInProgress = true;

    const scanContent = document.getElementById('scan-content');
    const scanText = scanContent.querySelector('.scan-text');

    // Update UI to show scanning
    scanText.textContent = 'Analyzing your item...';
    document.querySelector('.scan-frame').classList.add('scanning');

    // Simulate AI processing time
    setTimeout(() => {
        scanText.textContent = 'Item detected!';

        // Show checkmark animation
        const checkmark = scanContent.querySelector('.check-animation');
        if (checkmark) {
            checkmark.style.opacity = '1';
        }

        // Navigate to results after brief delay
        setTimeout(() => {
            navigateTo('result');
            scanningInProgress = false;
        }, 1000);
    }, 2500);
}

// ==========================================
// Result Screen - Step by Step Animation
// ==========================================

function showDetectionResult() {
    // Reset all steps
    document.querySelectorAll('.result-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show detection result first
    document.getElementById('detection-result').classList.add('active');

    // Update detection data
    updateDetectionData();
}

function updateDetectionData() {
    if (!selectedWasteType) {
        selectedWasteType = 'phone'; // Default fallback
    }

    const wasteData = wasteDatabase[selectedWasteType];

    // Update item name
    const itemName = document.getElementById('detected-item-name');
    if (itemName) {
        itemName.textContent = wasteData.name;
    }

    // Update details
    const detailCards = document.querySelectorAll('.detail-card');
    if (detailCards.length >= 2) {
        detailCards[0].querySelector('.detail-value').textContent = wasteData.value;
        detailCards[1].querySelector('.detail-value').textContent = wasteData.confidence;
    }

    // Update explanation
    const explanation = document.querySelector('.confidence-explanation');
    if (explanation) {
        explanation.textContent = wasteData.explanation;
    }
}

function showNatureReaction() {
    // Hide detection result
    document.getElementById('detection-result').classList.remove('active');

    // Show nature reaction
    setTimeout(() => {
        document.getElementById('nature-reaction').classList.add('active');

        // Start with sad plant
        document.getElementById('sad-plant').classList.add('active');
        document.getElementById('sad-message').style.display = 'block';
        document.getElementById('happy-message').style.display = 'none';

        // After 2 seconds, transform to happy
        setTimeout(() => {
            transformToHappy();
        }, 2000);
    }, 300);
}

function transformToHappy() {
    const sadPlant = document.getElementById('sad-plant');
    const happyPlant = document.getElementById('happy-plant');
    const sadMessage = document.getElementById('sad-message');
    const happyMessage = document.getElementById('happy-message');
    const impactBtn = document.getElementById('impact-btn');

    // Fade out sad plant
    sadPlant.style.transition = 'opacity 0.5s ease-out';
    sadPlant.style.opacity = '0';

    setTimeout(() => {
        sadPlant.classList.remove('active');

        // Fade in happy plant
        happyPlant.classList.add('active');
        happyPlant.style.opacity = '0';
        happyPlant.style.transition = 'opacity 0.8s ease-in';

        setTimeout(() => {
            happyPlant.style.opacity = '1';

            // Trigger leaf and flower animations by adding class
            const leaves = happyPlant.querySelectorAll('.leaf-grow');
            const flowers = happyPlant.querySelectorAll('.flower-bloom');
            const sparkles = happyPlant.querySelectorAll('.sparkle');

            // Stagger the animations
            leaves.forEach((leaf, index) => {
                leaf.style.animationDelay = `${index * 0.1}s`;
            });

            flowers.forEach((flower, index) => {
                flower.style.animationDelay = `${0.4 + index * 0.05}s`;
            });

            sparkles.forEach((sparkle, index) => {
                sparkle.style.animation = 'sparkle-animation 1s ease-in-out infinite';
                sparkle.style.animationDelay = `${0.8 + index * 0.2}s`;
            });
        }, 50);

        // Switch messages
        setTimeout(() => {
            sadMessage.style.opacity = '0';
            sadMessage.style.transition = 'opacity 0.3s';

            setTimeout(() => {
                sadMessage.style.display = 'none';
                happyMessage.style.display = 'block';
                happyMessage.style.opacity = '0';
                happyMessage.style.transition = 'opacity 0.5s';

                setTimeout(() => {
                    happyMessage.style.opacity = '1';

                    // Show impact button
                    setTimeout(() => {
                        impactBtn.style.display = 'flex';
                        impactBtn.style.opacity = '0';
                        impactBtn.style.transition = 'opacity 0.5s';

                        setTimeout(() => {
                            impactBtn.style.opacity = '1';
                        }, 50);
                    }, 800);
                }, 50);
            }, 300);
        }, 500);
    }, 500);
}

function showImpact() {
    // Hide nature reaction
    document.getElementById('nature-reaction').classList.remove('active');

    // Show impact result
    setTimeout(() => {
        document.getElementById('impact-result').classList.add('active');

        // Update impact data
        updateImpactData();

        // Trigger pop-in animations for impact cards
        setTimeout(() => {
            const impactCards = document.querySelectorAll('.impact-card');
            impactCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('pop-in');
                }, index * 150);
            });
        }, 200);
    }, 300);
}

function updateImpactData() {
    if (!selectedWasteType) {
        selectedWasteType = 'phone';
    }

    const wasteData = wasteDatabase[selectedWasteType];

    // Update impact values
    const impactCards = document.querySelectorAll('.impact-card');
    if (impactCards.length >= 3) {
        impactCards[0].querySelector('.impact-value').textContent = `+${wasteData.ecoPoints}`;
        impactCards[1].querySelector('.impact-value').textContent = wasteData.co2Saved;
        impactCards[2].querySelector('.impact-value').textContent = wasteData.energyDays;
    }

    // Update final message
    const finalMessage = document.querySelector('.final-message p');
    if (finalMessage) {
        finalMessage.textContent = `You saved enough energy to charge a phone for ${wasteData.energyDays} days! 🔋`;
    }
}

// ==========================================
// Interactive Elements Enhancement
// ==========================================

// Add ripple effect to buttons on click
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add touch feedback for waste cards
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add event listeners to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', addRippleEffect);
    });

    // Add hover effects to waste cards
    const wasteCards = document.querySelectorAll('.waste-card');
    wasteCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});

// ==========================================
// Utility Functions
// ==========================================

// Smooth scroll to top when changing screens
function scrollToTop(smooth = true) {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Log analytics (placeholder for future implementation)
function logEvent(eventName, eventData) {
    console.log(`Analytics Event: ${eventName}`, eventData);
}

// ==========================================
// Accessibility Enhancements
// ==========================================

// Keyboard navigation support
document.addEventListener('keydown', (event) => {
    // ESC to go back
    if (event.key === 'Escape' && currentScreen !== 'home-screen') {
        const backButton = document.querySelector('.screen.active .btn-back');
        if (backButton) {
            backButton.click();
        }
    }
});

// Announce screen changes to screen readers
function announceScreenChange(screenName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = `Navigated to ${screenName}`;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ==========================================
// Performance Optimizations
// ==========================================

// Preload images and assets
function preloadAssets() {
    // In a real app, preload images here
    console.log('Assets preloaded');
}

// Initialize app
window.addEventListener('load', () => {
    preloadAssets();
    console.log('EcoBin app initialized successfully! 🌱');
});

// ==========================================
// PWA Support (Optional Enhancement)
// ==========================================

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ==========================================
// Live Map with Geolocation
// ==========================================

let map = null;
let userMarker = null;

// Sample recycling centers (you can add real ones later)
const recyclingCenters = [
    { name: "EcoBin Station #42", lat: 0, lng: 0.002, address: "Green Valley Mall", distance: "0.3 km" },
    { name: "EcoBin Hub Central", lat: 0.003, lng: -0.002, address: "Tech Park Plaza", distance: "0.5 km" },
    { name: "EcoBin Express", lat: -0.002, lng: 0.003, address: "City Center", distance: "0.7 km" }
];

function initializeMap(userLat, userLng) {
    // Create map centered on user location
    if (map) {
        map.remove(); // Remove existing map if any
    }

    map = L.map('live-map').setView([userLat, userLng], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Custom icon for user location
    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #4A90E2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20]
    });

    // Add user marker
    userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        .bindPopup('<b>📍 You are here!</b>');

    // Custom icon for recycling centers
    const binIcon = L.divIcon({
        className: 'bin-location-marker',
        html: '<div style="background: #5FB87C; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">♻️</div>',
        iconSize: [30, 30]
    });

    // Add recycling center markers (offset from user location)
    recyclingCenters.forEach(center => {
        const lat = userLat + center.lat;
        const lng = userLng + center.lng;

        L.marker([lat, lng], { icon: binIcon }).addTo(map)
            .bindPopup(`
                <div style="text-align: center;">
                    <b>♻️ ${center.name}</b><br>
                    ${center.address}<br>
                    <span style="color: #5FB87C; font-weight: bold;">${center.distance}</span><br>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" style="color: #4A90E2;">Get Directions →</a>
                </div>
            `);
    });

    // Update location status
    document.getElementById('location-text').textContent = 'Location found! Showing nearby centers';
    document.getElementById('location-status').style.color = '#5FB87C';
}

function getUserLocation() {
    const statusEl = document.getElementById('location-status');
    const textEl = document.getElementById('location-text');

    if (!navigator.geolocation) {
        textEl.textContent = 'Geolocation not supported';
        statusEl.style.color = '#FF6B6B';
        // Use default location
        initializeMap(25.2677, 82.9913); // Varanasi, India (IIT BHU area)
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            initializeMap(latitude, longitude);
        },
        (error) => {
            console.log('Geolocation error:', error);
            textEl.textContent = 'Using default location (Varanasi)';
            statusEl.style.color = '#FFB84D';
            // Fallback to Varanasi area
            initializeMap(25.2677, 82.9913);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

// Initialize map when map screen is shown
const originalNavigateTo = navigateTo;
navigateTo = function (screen) {
    originalNavigateTo(screen);

    // Initialize map when navigating to map screen
    if (screen === 'map' && !map) {
        setTimeout(() => {
            getUserLocation();
        }, 300);
    }
};

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateTo,
        selectWaste,
        simulateScan,
        showNatureReaction,
        showImpact,
        initializeMap,
        getUserLocation
    };
}

// ==========================================
// Chatbot Functionality
// ==========================================

let chatOpen = false;

const chatResponses = {
    'batteries': {
        keywords: ['battery', 'batteries', 'lithium', 'recycle batteries'],
        response: '✅ Yes! Batteries are highly recyclable. We accept all types including lithium-ion, AA, AAA, and phone batteries. Find your nearest center in the Map section! 🔋'
    },
    'nearest': {
        keywords: ['nearest', 'nearby', 'location', 'where', 'find center', 'closest'],
        response: '📍 To find the nearest recycling center:\n1. Click "Start Recycling"\n2. Select your e-waste type\n3. View the interactive map with your location\n4. Click any marker for directions! 🗺️'
    },
    'points': {
        keywords: ['points', 'earn', 'rewards', 'eco points', 'how do i'],
        response: '⭐ Earn Eco Points by recycling e-waste!\n• Phone: 120 points\n• Laptop: 200 points\n• Battery: 90 points\n• Charger: 60 points\n\nCheck your progress in "View History"! 🏆'
    },
    'phone': {
        keywords: ['phone', 'smartphone', 'mobile', 'cell'],
        response: '📱 Smartphones are valuable e-waste! They contain precious metals like gold and copper. Worth ₹450 and 120 Eco Points. Just scan and recycle! ♻️'
    },
    'laptop': {
        keywords: ['laptop', 'computer', 'pc'],
        response: '💻 Laptops are our highest-value items! Worth ₹850 and 200 Eco Points. They contain rare earth metals that can be reused. Scan to recycle! 🌍'
    },
    'contact': {
        keywords: ['contact', 'support', 'help', 'email', 'phone number'],
        response: '📞 Need human help?\n📧 Email: support@ecobin.com\n📱 Phone: +91-1800-ECO-BIN\nâ° Hours: 9 AM - 6 PM (Mon-Sat)\n\nOr visit our Help Center! 💚'
    },
    'default': {
        keywords: [],
        response: '🤔 I\'m here to help! Try asking:\n• "Can I recycle batteries?"\n• "Where is the nearest center?"\n• "How do I earn points?"\n• "Contact support"\n\nOr use the quick buttons below! 🌱'
    }
};

function toggleChat() {
    chatOpen = !chatOpen;
    const chatContainer = document.getElementById('chatbot-container');

    if (chatOpen) {
        chatContainer.classList.add('active');
        chatContainer.style.display = 'flex';
    } else {
        chatContainer.classList.remove('active');
        chatContainer.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Show typing indicator
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 800);
}

function sendQuickMessage(message) {
    addMessage(message, 'user');

    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 600);
}

// Chatbot conversation state
let chatContext = {
    lastTopic: null,
    askedAboutRecycling: false,
    userName: null
};

function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (/(^|\s)(hi|hello|hey|hola|heya|sup|yo)($|\s|!)/i.test(lowerMessage)) {
        chatContext.lastTopic = 'greeting';
        const greetings = [
            "Hey there! 👋 I'm EcoBot, your recycling buddy! How can I help you save the planet today?",
            "Hello! 🌱 Ready to recycle? Ask me anything about e-waste!",
            "Hi! 💚 I'm here to help you recycle smarter. What would you like to know?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Thanks / appreciation
    if (/(thank|thanks|thx|appreciate|helpful|awesome|great|nice)/.test(lowerMessage)) {
        const thanks = [
            "You're welcome! 😊 Happy to help save the planet together! 🌍",
            "My pleasure! Keep up the great work recycling! ♻️💚",
            "Glad I could help! Any other questions? 🌱"
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }

    // Confirmations / agreement
    if (/(^|\s)(yes|yeah|yep|sure|ok|okay|sounds good)($|\s|!)/i.test(lowerMessage)) {
        if (chatContext.lastTopic === 'nearest_center') {
            return "Perfect! 🗺️ Head to the Map section to see all nearby centers. Click on any marker for directions! Want to know what you can recycle there?";
        }
        return "Great! How else can I help you today? 😊";
    }

    // Safe / safety questions
    if (/(safe|safety|danger|harm|risk)/.test(lowerMessage)) {
        chatContext.lastTopic = 'safety';
        return "Great question! 🛡️ Yes, recycling e-waste is completely safe when done at certified centers like ours! We follow proper protocols to handle batteries, screens, and electronic components safely. Never try to dismantle devices yourself! Want to know what items we accept?";
    }

    // Batteries
    if (/(batter|lithium|aa|aaa|cell|power bank)/.test(lowerMessage)) {
        chatContext.lastTopic = 'batteries';
        chatContext.askedAboutRecycling = true;
        return "✅ Absolutely! Batteries are SUPER important to recycle! We accept:\n• Lithium-ion (phones, laptops)\n• AA, AAA, D cells\n• Power banks\n• Car batteries\n\nBatteries contain valuable metals AND can be dangerous in landfills! Drop them at any EcoBin center. Should I show you the nearest one? 🔋";
    }

    // Location / nearest center
    if (/(where|location|near|closest|find|center|station|address|direction)/.test(lowerMessage)) {
        chatContext.lastTopic = 'nearest_center';
        return "📍 I can help you find the nearest center! Here's how:\n\n1. Click 'Start Recycling' on the home screen\n2. Select your e-waste type\n3. View the interactive map with ALL nearby centers\n4. Click any marker for contact info & directions!\n\nYour nearest center is probably less than 2 km away! Want me to tell you about their hours? ⏰";
    }

    // Points / rewards
    if (/(point|reward|earn|credit|benefit|prize|incentive)/.test(lowerMessage)) {
        chatContext.lastTopic = 'points';
        return "⭐ YES! You earn Eco Points for every item recycled!\n\n📱 Phone: 120 pts (₹450)\n💻 Laptop: 200 pts (₹850)\n🔋 Battery: 90 pts (₹200)\n🔌 Charger: 60 pts (₹150)\n\nPoints = Impact! Check 'View History' to track your progress. You're literally turning trash into treasure! Want to know what you can recycle? ♻️";
    }

    // Phone recycling
    if (/(phone|smartphone|mobile|iphone|android|cell)/.test(lowerMessage) && !/(number|contact)/.test(lowerMessage)) {
        chatContext.lastTopic = 'phone';
        return "📱 Old phones are perfect for recycling! They contain:\n• Gold, silver, copper\n• Rare earth metals\n• Recyclable glass & plastic\n\n💰 Worth: ₹450 + 120 Eco Points\n\nJust scan it at any center and we'll handle the rest! Your old phone becomes someone's new resource! Ready to recycle? 🌍";
    }

    // Laptop / computer
    if (/(laptop|computer|pc|desktop|macbook)/.test(lowerMessage)) {
        chatContext.lastTopic = 'laptop';
        return "💻 Laptops are our HIGHEST value recyclables!\n\n💰 ₹850 + 200 Eco Points per laptop\n\nWe safely extract:\n• Circuit boards (precious metals)\n• Hard drives (securely wiped!)\n• Screens, keyboards, batteries\n\nDon't worry about your data - we ensure secure disposal! Have an old laptop ready? 🔒";
    }

    // How it works / process
    if (/(how|process|work|step|procedure|what do i)/.test(lowerMessage)) {
        chatContext.lastTopic = 'process';
        return "📝 Super easy 3-step process:\n\n1️⃣ **Scan**: Use our camera to identify your e-waste\n2️⃣ **Drop**: Visit nearest center (we show you on map!)\n3️⃣ **Earn**: Get Eco Points + cash value instantly!\n\nNo sorting needed - we handle everything! Ready to start? Just click 'Start Recycling'! 🚀";
    }

    // What can be recycled
    if (/(what|which|can i recycle|accept|take|item)/.test(lowerMessage)) {
        chatContext.lastTopic = 'accepted_items';
        return "♻️ We accept these e-waste items:\n\n📱 Phones & tablets\n💻 Laptops & computers\n🔋 All types of batteries\n🔌 Chargers & cables\n⌚ Smartwatches\n🎮 Gaming devices\n📺 Old TVs & monitors\n\nBasically, if it has a plug or battery, we can recycle it! What do you have? 😊";
    }

    // Contact / support
    if (/(contact|support|help|human|talk|call|email|phone number)/.test(lowerMessage)) {
        chatContext.lastTopic = 'contact';
        return "📞 Need to talk to a human? We've got you!\n\n📧 Email: support@ecobin.com\n📱 Phone: +91-1800-ECO-BIN\n⏰ Hours: 9 AM - 6 PM (Mon-Sat)\n\nOr keep chatting with me - I'm here 24/7! What would you like to know? 💚";
    }

    // Negative / frustrated responses
    if (/(no|nope|nah|don't|stop|useless|bad)/.test(lowerMessage)) {
        return "Oh! Sorry if I misunderstood 😅 Let me try differently - what specific question do you have about recycling? I'm here to help! 🌱";
    }

    // Fallback - check for ANY keyword match
    for (const [key, data] of Object.entries(chatResponses)) {
        if (key === 'default') continue;
        for (const keyword of data.keywords) {
            if (lowerMessage.includes(keyword)) {
                chatContext.lastTopic = key;
                return data.response + "\n\nAnything else you'd like to know? 😊";
            }
        }
    }

    // Smart default with context
    if (chatContext.askedAboutRecycling) {
        return "🤔 Hmm, I'm not sure about that specific item. But I can tell you about:\n• Batteries & power banks 🔋\n• Phones & laptops 📱\n• How to find centers 📍\n• Earning rewards ⭐\n\nWhat interests you most?";
    }

    // Complete default
    return "🤔 I'm here to help with recycling questions! Try asking:\n• 'What can I recycle?'\n• 'Where is the nearest center?'\n• 'How do I earn points?'\n• 'Is it safe?'\n\nI'm learning to be more helpful! 🌱";
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';

    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">🌱</div>
            <div class="message-bubble">
                <p>${text.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <p>${text}</p>
            </div>
        `;
    }

    // Remove quick actions if they exist
    const quickActions = messagesContainer.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.remove();
    }

    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Toggle center details
function toggleCenterDetails(centerId) {
    const details = document.getElementById(`${centerId}-details`);
    const isHidden = details.style.display === 'none' || !details.style.display || details.style.maxHeight === '0px';

    if (isHidden) {
        details.style.display = 'block';
        details.style.maxHeight = '500px';
    } else {
        details.style.maxHeight = '0px';
        setTimeout(() => {
            details.style.display = 'none';
        }, 300);
    }
}

// Toggle other centers list
function toggleOtherCenters() {
    const list = document.getElementById('other-centers-list');
    const btn = document.getElementById('view-other-btn');
    const isHidden = list.style.display === 'none' || !list.style.display;

    if (isHidden) {
        list.style.display = 'block';
        btn.querySelector('span').textContent = 'Hide Other Centers';
        btn.querySelector('svg').style.transform = 'rotate(180deg)';
    } else {
        list.style.display = 'none';
        btn.querySelector('span').textContent = 'View Other Centers (2)';
        btn.querySelector('svg').style.transform = 'rotate(0deg)';
    }
}

// Toggle all centers list
function toggleAllCenters() {
    const container = document.getElementById('all-centers-container');
    const btn = document.getElementById('show-centers-btn');
    const isHidden = container.style.display === 'none' || !container.style.display;

    if (isHidden) {
        container.style.display = 'block';
        btn.querySelector('span').textContent = '📍 Hide Centers';
        btn.querySelector('svg').style.transform = 'rotate(180deg)';
    } else {
        container.style.display = 'none';
        btn.querySelector('span').textContent = '📍 Show Nearby Centers';
        btn.querySelector('svg').style.transform = 'rotate(0deg)';
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Mock signup - just save to localStorage and go to home
    localStorage.setItem('ecobin_user', JSON.stringify({
        mobile: '+91' + mobile,
        signupDate: new Date().toISOString()
    }));

    alert(`Welcome! Account created for +91${mobile} 🎉`);
    navigateTo('home');
}

// Initialize map when map screen is shown
function initializeMap() {
    // Check if map already initialized
    if (window.ecobinMap) {
        return;
    }

    const mapElement = document.getElementById('live-map');
    if (!mapElement) return;

    // Initialize Leaflet map
    window.ecobinMap = L.map('live-map').setView([25.2677, 82.9913], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(window.ecobinMap);

    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // Center map on user location
                window.ecobinMap.setView([userLat, userLon], 14);

                // Add user marker
                L.marker([userLat, userLon], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="background: #2196F3; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                        iconSize: [22, 22]
                    })
                }).addTo(window.ecobinMap).bindPopup('📍 You are here');

                // Update location text
                document.getElementById('real-time-location').textContent = `${userLat.toFixed(4)}, ${userLon.toFixed(4)}`;
            },
            (error) => {
                console.log('Geolocation error:', error);
            }
        );
    }

    // Add recycling center markers
    const centers = [
        { lat: 25.2677, lon: 82.9913, name: 'EcoBin Station #42', location: 'Green Valley Mall' },
        { lat: 25.2685, lon: 82.9920, name: 'EcoBin Station #15', location: 'Lanka Market' },
        { lat: 25.2620, lon: 82.9965, name: 'EcoBin Station #28', location: 'Bhelpur' }
    ];

    centers.forEach(center => {
        const marker = L.marker([center.lat, center.lon], {
            icon: L.divIcon({
                className: 'recycle-center-marker',
                html: '<div style="background: #5FB87C; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">♻️</div>',
                iconSize: [36, 36]
            })
        }).addTo(window.ecobinMap);

        marker.bindPopup(`<strong>${center.name}</strong><br>${center.location}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lon}" target="_blank">Get Directions</a>`);
    });
}
