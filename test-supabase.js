const https = require('https');

https.get('https://golygozojriwynakbpuwn.supabase.co', (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
