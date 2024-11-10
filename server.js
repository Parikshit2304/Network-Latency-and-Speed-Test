const http = require('http');

// Data to be used for download testing
const downloadData = Buffer.alloc(10 * 1024 * 1024, 'a'); // 10MB of 'a'

// Create a server
const server = http.createServer((req, res) => {
  if (req.url === '/ping') {
    // Respond with a simple message for latency testing
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else if (req.url === '/download') {
    // Send a large amount of data for download speed testing
    res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    res.end(downloadData);
  } else if (req.url === '/upload' && req.method === 'POST') {
    // Receive data for upload speed testing
    let receivedBytes = 0;
    req.on('data', chunk => {
      receivedBytes += chunk.length;
    });

    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Received ${receivedBytes} bytes`);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log('Test server running on port 3000');
});
