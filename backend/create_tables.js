require('dotenv').config();
const https = require('https');

const PROJECT = 'lnvmffabfiwylwseuizw';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function pgQuery(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: `${PROJECT}.supabase.co`,
      path: '/rest/v1/rpc/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Use Supabase's pg endpoint
function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request({
      hostname: `${PROJECT}.supabase.co`,
      path: '/pg/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  // Test connection via Supabase JS
  const { createClient } = require('@supabase/supabase-js');
  const sb = createClient(process.env.SUPABASE_URL, SERVICE_KEY);

  console.log('Testing connection...');
  const { data, error } = await sb.from('categories').select('count').limit(1);
  
  if (error && error.code === '42P01') {
    console.log('Tables do not exist yet - need to create via SQL Editor');
    console.log('\n📋 Please run supabase_schema.sql in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/' + PROJECT + '/sql/new');
  } else if (error) {
    console.log('Connection error:', error.message);
  } else {
    console.log('✅ Tables exist! Running seed...');
    require('./setup_db.js');
  }
}

main().catch(console.error);
