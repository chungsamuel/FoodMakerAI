const chatbotToggler = document.querySelector(".chatbot-toggler");
// const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const API_KEY = "xxxxxxxx"; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">local_dining</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateResponse = (chatElement, promptMessage) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: promptMessage}],
        })
    };

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        chatElement.querySelector("p").textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        chatElement.querySelector("p").classList.add("error");
        chatElement.querySelector("p").textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    const option = document.querySelector('input[name="option"]:checked').value;
    userMessage = chatInput.value.trim();
    let promptMessage = "";

    if(option === "recommendation") {
        promptMessage = `I would like a recommendation of food based on the following preferences: ${userMessage}`;
    } else if(option === "recipe") {
        promptMessage = `I would like the recipe for ${userMessage}`;
    }

    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, promptMessage); 
    }, 600);
};


chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const textArea = document.querySelector(".chat-input textarea");
    const recommendationRadio = document.querySelector('input[name="option"][value="recommendation"]');
    const recipeRadio = document.querySelector('input[name="option"][value="recipe"]');

    // Debugging log
    console.log("Event listeners are being set up");

    function updatePlaceholder() {
        if (recommendationRadio.checked) {
            textArea.placeholder = "Enter your food preferences...";
            console.log("Placeholder set for recommendations");
        } else {
            textArea.placeholder = "Enter the food you want to make...";
            console.log("Placeholder set for recipe");
        }
    }

    // Call once on load to set initial state
    updatePlaceholder();

    // Set event listeners
    recommendationRadio.addEventListener("change", updatePlaceholder);
    recipeRadio.addEventListener("change", updatePlaceholder);
});

sendChatBtn.addEventListener("click", handleChat);

document.addEventListener("DOMContentLoaded", () => {
    fetch('secrets.json')
    .then((response) => response.json())
    .then((json) => console.log(json.id));
});
