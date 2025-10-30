// Content script for Interceptly
// This runs on all pages and can communicate with the background service worker

console.log('Interceptly content script injected')

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse({
      title: document.title,
      url: window.location.href,
    })
  }
})
