import pg from 'pg';

async function test() {
  console.log('Testing with connectionString and sslmode=no-verify...');
  const connectionString = 'postgresql://postgres.yllmpaulrczmxgzlmlde:uctUbf2IPB2vj9VI@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify';
  
  const pool = new pg.Pool({ connectionString });

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`✅ SUCCESS! Database time: ${res.rows[0].now}`);
    client.release();
  } catch (err) {
    console.log(`❌ FAILED: ${err.message}`);
  } finally {
    await pool.end();
  }
}

test();
