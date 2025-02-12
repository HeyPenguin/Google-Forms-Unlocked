console.log('ChatGPT integration (hidden mode) loaded');

// OpenAI API Key (Replace with your key)
const OPENAI_API_KEY = 'YOUR_OPENAI_KEY';

// Function to create the ChatGPT pop-up
function createChatGPTPopup() {
  // Check if already open
  if (document.querySelector('.chatgpt-popup')) return;

  // Create main pop-up container
  const chatGPTDiv = document.createElement('div');
  chatGPTDiv.className = 'chatgpt-popup';
  chatGPTDiv.style.position = 'fixed';
  chatGPTDiv.style.bottom = '-100px'; // Starts hidden
  chatGPTDiv.style.left = '50%';
  chatGPTDiv.style.transform = 'translateX(-50%)';
  chatGPTDiv.style.width = '90%';
  chatGPTDiv.style.maxWidth = '500px';
  chatGPTDiv.style.height = 'auto';
  chatGPTDiv.style.backgroundColor = 'white';
  chatGPTDiv.style.border = '1px solid #dadce0';
  chatGPTDiv.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
  chatGPTDiv.style.zIndex = '9999';
  chatGPTDiv.style.padding = '10px';
  chatGPTDiv.style.display = 'flex';
  chatGPTDiv.style.flexDirection = 'column';
  chatGPTDiv.style.borderRadius = '8px';
  chatGPTDiv.style.fontFamily = '"Google Sans", Roboto, Arial, sans-serif';

  // Title bar for styling
  const titleBar = document.createElement('div');
  titleBar.style.background = '#f1f3f4';
  titleBar.style.color = '#5f6368';
  titleBar.style.padding = '8px';
  titleBar.style.fontSize = '14px';
  titleBar.style.fontWeight = 'bold';
  titleBar.style.textAlign = 'center';
  titleBar.innerText = 'Google Assistant AI';

  // Input field
  const inputField = document.createElement('textarea');
  inputField.placeholder = 'Ask something...';
  inputField.style.width = '100%';
  inputField.style.height = '40px';
  inputField.style.marginBottom = '10px';
  inputField.style.border = '1px solid #ccc';
  inputField.style.borderRadius = '4px';
  inputField.style.padding = '5px';

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.innerText = 'Ask';
  submitButton.style.backgroundColor = '#1a73e8';
  submitButton.style.color = 'white';
  submitButton.style.border = 'none';
  submitButton.style.padding = '8px';
  submitButton.style.borderRadius = '4px';
  submitButton.style.cursor = 'pointer';

  // Response area
  const responseDiv = document.createElement('div');
  responseDiv.style.maxHeight = '200px';
  responseDiv.style.overflowY = 'auto';
  responseDiv.style.padding = '5px';
  responseDiv.style.borderTop = '1px solid #ddd';

  // Close button
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.marginTop = '10px';
  closeButton.style.backgroundColor = 'red';
  closeButton.style.color = 'white';
  closeButton.style.border = 'none';
  closeButton.style.padding = '8px';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => chatGPTDiv.remove());

  // Function to fetch response from OpenAI API
  async function askChatGPT(question) {
    responseDiv.innerHTML = '<p><em>Loading...</em></p>';

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: question }],
        }),
      });

      const data = await response.json();
      responseDiv.innerHTML = `<p><strong>ChatGPT:</strong> ${data.choices[0].message.content}</p>`;
    } catch (error) {
      responseDiv.innerHTML = '<p style="color: red;">Error fetching response.</p>';
    }
  }

  // Add event listener to button
  submitButton.addEventListener('click', () => {
    const question = inputField.value.trim();
    if (question) {
      askChatGPT(question);
      inputField.value = '';
    }
  });

  // Append elements to chat popup
  chatGPTDiv.appendChild(titleBar);
  chatGPTDiv.appendChild(inputField);
  chatGPTDiv.appendChild(submitButton);
  chatGPTDiv.appendChild(responseDiv);
  chatGPTDiv.appendChild(closeButton);

  document.body.appendChild(chatGPTDiv);

  // Enable auto-hide on scroll
  handleScrollHide(chatGPTDiv);
}

// Function to auto-hide when scrolling up
function handleScrollHide(chatGPTDiv) {
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', function () {
    if (window.scrollY > lastScrollY) {
      chatGPTDiv.style.bottom = '10px'; // Show when scrolling down
    } else {
      chatGPTDiv.style.bottom = '-100px'; // Hide when scrolling up
    }
    lastScrollY = window.scrollY;
  });
}

// Open ChatGPT when Alt + C is pressed
document.addEventListener('keydown', function (event) {
  if (event.altKey && event.keyCode === 67) { // Alt + C
    createChatGPTPopup();
  }
});

// Listen for messages from background.js
chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === 'displayChatGPT') {
    createChatGPTPopup();
  }
});
