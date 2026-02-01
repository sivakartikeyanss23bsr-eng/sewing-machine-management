const pool = require('./db');

async function checkUsersTable() {
  try {
    console.log('🔍 Checking users table structure...');
    
    // Get table columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Users Table Structure:');
    console.log('=====================================');
    columns.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Get all users with correct columns
    const users = await pool.query(`
      SELECT *
      FROM users 
      ORDER BY user_id DESC
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

checkUsersTable();
