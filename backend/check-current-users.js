const pool = require('./db');

async function checkCurrentUsers() {
  try {
    console.log('🔍 Checking current users in the database...');
    
    // Get all users
    const users = await pool.query(`
      SELECT user_id, name, email, phone, role, is_verified, created_at
      FROM users 
      ORDER BY created_at DESC
    `);
    
    console.log('\n📋 Current Users in Database:');
    console.log('=====================================');
    
    if (users.rows.length === 0) {
      console.log('No users found in the database');
    } else {
      users.rows.forEach((user, index) => {
        console.log(`${index + 1}. User ID: ${user.user_id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Verified: ${user.is_verified ? 'Yes' : 'No'}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
        console.log('-------------------------------------');
      });
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Users: ${users.rows.length}`);
    
    // Count by role
    const roleCounts = users.rows.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`   Admin Users: ${roleCounts.admin || 0}`);
    console.log(`   Regular Users: ${roleCounts.user || 0}`);
    
    // Count verified vs unverified
    const verifiedCount = users.rows.filter(user => user.is_verified).length;
    console.log(`   Verified Users: ${verifiedCount}`);
    console.log(`   Unverified Users: ${users.rows.length - verifiedCount}`);
    
    console.log('\n✅ Database connection successful!');
    
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message);
  } finally {
    pool.end();
  }
}

checkCurrentUsers();
