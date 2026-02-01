const axios = require('axios');

async function testUserManagement() {
  try {
    console.log('🔑 Logging in as admin...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginRes.data.token;
    const headers = { 'Authorization': 'Bearer ' + token };
    
    console.log('✅ Admin login successful');
    
    // Test getting all users
    console.log('\n📋 Testing get all users...');
    const usersRes = await axios.get('http://localhost:5000/api/admin-users', { headers });
    
    console.log('✅ Users retrieved successfully!');
    console.log('📊 Current Users:');
    usersRes.data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.is_verified ? 'Verified' : 'Not Verified'}`);
    });
    
    // Test adding a new user
    console.log('\n➕ Testing add new user...');
    const newUser = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'test123',
      phone: '1234567890',
      role: 'user',
      is_verified: true
    };
    
    const addRes = await axios.post('http://localhost:5000/api/admin-users', newUser, { headers });
    console.log('✅ New user created:', addRes.data.message);
    
    // Test updating a user
    console.log('\n✏️ Testing update user...');
    const updateRes = await axios.put(`http://localhost:5000/api/admin-users/${addRes.data.user.user_id}`, {
      name: 'Updated Test User',
      email: 'testuser@example.com',
      phone: '9876543210',
      role: 'user',
      is_verified: false
    }, { headers });
    console.log('✅ User updated:', updateRes.data.message);
    
    // Test password reset
    console.log('\n🔐 Testing password reset...');
    const resetRes = await axios.post(`http://localhost:5000/api/admin-users/${addRes.data.user.user_id}/reset-password`, {
      newPassword: 'newpassword123'
    }, { headers });
    console.log('✅ Password reset:', resetRes.data.message);
    
    // Get updated users list
    console.log('\n📋 Getting updated users list...');
    const updatedUsersRes = await axios.get('http://localhost:5000/api/admin-users', { headers });
    
    console.log('📊 Updated Users:');
    updatedUsersRes.data.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - ${user.role} - ${user.is_verified ? 'Verified' : 'Not Verified'}`);
    });
    
    // Test deleting the test user
    console.log('\n🗑️ Testing delete user...');
    const deleteRes = await axios.delete(`http://localhost:5000/api/admin-users/${addRes.data.user.user_id}`, { headers });
    console.log('✅ User deleted:', deleteRes.data.message);
    
    console.log('\n🎉 User Management API is working perfectly!');
    
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testUserManagement();
