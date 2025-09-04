// Simple fallback worker - WebLLM might need different setup
self.onmessage = function(e) {
  console.log('Worker received message:', e.data);
  
  // For now, return a simple response
  self.postMessage({
    type: 'error',
    message: 'WebLLM worker not properly configured yet'
  });
};
