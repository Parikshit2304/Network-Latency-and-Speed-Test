const http = require('http');

// Server URL
const serverUrl = 'http://localhost:3000';

// Function to measure latency
function measureLatency() {
  const startTime = Date.now();
  
  http.get(`${serverUrl}/ping`, (res) => {
    res.on('data', () => {}); // Consume data to complete the request
    res.on('end', () => {
      const latency = Date.now() - startTime;
      console.log(`Latency: ${latency} ms`);
    });
  }).on('error', (err) => {
    console.error(`Error measuring latency: ${err.message}`);
  });
}

// Function to measure download speed
function measureDownloadSpeed() {
  const startTime = Date.now();
  let receivedBytes = 0;

  http.get(`${serverUrl}/download`, (res) => {
    res.on('data', (chunk) => {
      receivedBytes += chunk.length;
    });

    res.on('end', () => {
      const durationInSeconds = (Date.now() - startTime) / 1000;
      const speedMbps = (receivedBytes / (1024 * 1024)) / durationInSeconds * 8;
      console.log(`Download Speed: ${speedMbps.toFixed(2)} Mbps`);
    });
  }).on('error', (err) => {
    console.error(`Error measuring download speed: ${err.message}`);
  });
}

// Function to measure upload speed
function measureUploadSpeed() {
  const uploadData = Buffer.alloc(5 * 1024 * 1024, 'a'); // 5MB of 'a'
  const startTime = Date.now();

  const req = http.request(`${serverUrl}/upload`, {
    method: 'POST',
    headers: {
      'Content-Length': uploadData.length
    }
  }, (res) => {
    res.on('data', () => {}); // Consume data to complete the request
    res.on('end', () => {
      const durationInSeconds = (Date.now() - startTime) / 1000;
      const speedMbps = (uploadData.length / (1024 * 1024)) / durationInSeconds * 8;
      console.log(`Upload Speed: ${speedMbps.toFixed(2)} Mbps`);
    });
  });

  req.on('error', (err) => {
    console.error(`Error measuring upload speed: ${err.message}`);
  });

  // Send the upload data
  req.write(uploadData);
  req.end();
}

// Run tests
measureLatency();
setTimeout(measureDownloadSpeed, 1000); // Delay to avoid overlap in logs
setTimeout(measureUploadSpeed, 3000); // Delay to avoid overlap in logs
