// DOM Elements
const micButton = document.getElementById('micButton');
const statusText = document.getElementById('statusText');
const userTextElement = document.getElementById('userText');
const jarvisTextElement = document.getElementById('jarvisText');
const supportWarning = document.getElementById('supportWarning');

// Check for Browser Support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechSynthesis = window.speechSynthesis;

if (!SpeechRecognition) {
    supportWarning.classList.remove('hidden');
    micButton.disabled = true;
    statusText.textContent = "Browser Not Supported";
} else {
    // Initialize Recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop after one command
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    // --- Event Listeners ---

    micButton.addEventListener('click', () => {
        if (micButton.classList.contains('listening')) {
            stopListening();
        } else {
            startListening();
        }
    });

    recognition.onstart = () => {
        micButton.classList.add('listening');
        statusText.textContent = "Listening...";
        micButton.querySelector('.mic-icon').textContent = "⬛"; // Stop icon
    };

    recognition.onend = () => {
        stopListening();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userTextElement.textContent = transcript;
        handleCommand(transcript.toLowerCase());
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        stopListening();
        statusText.textContent = "Error occurred. Try again.";
    };

    // --- Helper Functions ---

    function startListening() {
        try {
            recognition.start();
        } catch (e) {
            console.log("Recognition already started");
        }
    }

    function stopListening() {
        recognition.stop();
        micButton.classList.remove('listening');
        statusText.textContent = "Click to Start Listening";
        micButton.querySelector('.mic-icon').textContent = "🎙️";
    }

    /**
     * Process the user's voice command and trigger actions
     * @param {string} command - The recognized text in lowercase
     */
    function handleCommand(command) {
        let response = "I'm not sure what you mean.";

        if (command.includes("open google")) {
            response = "Opening Google.";
            window.open("https://www.google.com", "_blank");
        } else if (command.includes("open youtube")) {
            response = "Opening YouTube.";
            window.open("https://www.youtube.com", "_blank");
        } else if (command.includes("time")) {
            const now = new Date();
            response = "The time is " + now.toLocaleTimeString();
        } else if (command.includes("date")) {
            const today = new Date();
            response = "Today is " + today.toDateString();
        } else if (command.includes("hello") || command.includes("hi")) {
            response = "Hello there! How can I help you today?";
        } else {
            // Fallback for unrecognized commands
            response = "Sorry, I didn't understand that. You can ask me to open Google, YouTube, or tell the time.";
        }

        jarvisTextElement.textContent = response;
        speak(response);
    }

    /**
     * Use Speech Synthesis to speak the response
     * @param {string} text - The text to speak
     */
    function speak(text) {
        if (!SpeechSynthesis) return;
        
        // Cancel any ongoing speech
        SpeechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1; // Normal speed
        utterance.pitch = 1; // Normal pitch

        // Optional: Select a specific voice if available
        const voices = SpeechSynthesis.getVoices();
        // Try to find a "Microsoft David" or similar English voice if available, otherwise use default
        // console.log(voices); // Debug: see available voices

        SpeechSynthesis.speak(utterance);
    }
}
