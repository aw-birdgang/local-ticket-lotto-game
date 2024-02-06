const http = require('http');
const options = {
  host: '0.0.0.0',
  path: '/api/health',
  port: 3600,
  timeout: 2000,
};

const healthCheck = http.request(options, (res) => {
  console.log(`HEALTHCHECK STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
healthCheck.on('error', function (err) {
  console.error('ERROR');
  process.exit(1);
});

healthCheck.end();
