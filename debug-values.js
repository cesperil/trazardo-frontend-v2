const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4200,
    path: '/api/tecnicos',
    method: 'GET'
};

const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Tecnicos:', data.substring(0, 500)));
});
req.on('error', e => console.error(e));
req.end();

const options2 = {
    hostname: 'localhost',
    port: 4200,
    path: '/api/explotaciones',
    method: 'GET'
};

const req2 = http.request(options2, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Explotaciones:', data.substring(0, 500)));
});
req2.on('error', e => console.error(e));
req2.end();
