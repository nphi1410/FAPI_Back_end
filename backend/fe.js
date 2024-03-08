const url = 'https://44.226.145.213:10000/schedule';

// Get cookies from the document header
const cookie = document.cookie;

// Send message to background.js with the cookie
chrome.runtime.sendMessage({ action: 'mergeCookies', cookie }, response => {
    // console.log(response);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'fapcookie': response // Including client-side cookies in the request headers
        },
        body: JSON.stringify({})
    };
    
    fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Use response.text() instead of response.json()
        })
        .then(data => {
            if (data.length === 0) {
                console.log('Response is empty or null.');
            } else {
                const parsedData = JSON.parse(data);
                console.log('Response:', parsedData);
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
});

