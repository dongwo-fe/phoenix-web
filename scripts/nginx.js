const fs = require('fs');
const path = require('path');

const SERVE_ENV = process.env.SERVE_ENV || 'dev';

const api_list = {
    dev: 'http://127.0.0.1:8082',
    production: 'http://127.0.0.1:8082',
};

const file_path = path.join(__dirname, '../docker/nginx/conf.d');
const template = fs.readFileSync(file_path + '/default.temp', {
    encoding: 'utf-8',
});

let conf = template.replace(/{{api_ip}}/g, api_list[SERVE_ENV]);

console.log('代理地址', proxy_list[SERVE_ENV]);

fs.writeFileSync(file_path + '/default.conf', conf, { encoding: 'utf-8' });
