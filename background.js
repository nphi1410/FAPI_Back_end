// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'mergeCookies') {
        let sessionId = '';
        // Get session ID cookie using chrome.cookies.get
        chrome.cookies.get({ "url": 'https://fap.fpt.edu.vn/Student.aspx', "name": 'ASP.NET_SessionId' }, function (cookie) {
            if (cookie) {
                sessionId = `${cookie.name}=${cookie.value}`;
            }
            // Get cookies from Chrome API
            chrome.cookies.getAll({ domain: "fap.fpt.edu.vn" }, cookies => {
                // Extract cookie values from the cookies array
                const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
                // Merge the cookies from document.cookie and Chrome API
                const updatedCookie = `${message.cookie};${sessionId};${cookieString}`;
                // Send back the updated cookie string to the content script
                sendResponse(updatedCookie);
            });
        });
        // Return true to indicate that we want to use sendResponse asynchronously
        return true;
    }
});





