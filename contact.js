const contactForm = document.getElementById('contactForm');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Firebase configuration - Replace with your own Firebase project config
// IMPORTANT: These are public keys that are safe to include in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyB9VbCbqfKrfoCmX6kae_-N_UyHpBUjIjA",
  authDomain: "contact-egedal-devlopment.firebaseapp.com",
  projectId: "contact-egedal-devlopment",
  storageBucket: "contact-egedal-devlopment.firebasestorage.app",
  messagingSenderId: "1091720412185",
  appId: "1:1091720412185:web:aa2215a16a71d4e379be88",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore database instance
const db = firebase.firestore();

// Contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Get form values
    const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
    const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
    const subject = contactForm.querySelector('input[placeholder="Subject"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Create message object with timestamp
    const contactMessage = {
        name,
        email,
        subject,
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        // Add document to 'messages' collection
        await db.collection('messages').add(contactMessage);
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form
        contactForm.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
});

// Function to display notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 5000);
}

// Add basic CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.5s ease;
    }
    
    .notification.success {
        background-color: #4CAF50;
    }
    
    .notification.error {
        background-color: #F44336;
    }
    
    .notification.hide {
        animation: slideOut 0.5s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);