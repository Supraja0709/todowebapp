const https = require('https');
const token = 'DQUSRZ2R-rK6UfRwtbqiFR21eHSh9cRRne_2q-uFYUG';

const query = `
  query {
    projects {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const data = JSON.stringify({ query });

const options = {
  hostname: 'backboard.railway.app',
  path: '/graphql/v2',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(body));
});
req.write(data);
req.end();
