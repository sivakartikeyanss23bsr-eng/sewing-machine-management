const axios = require('axios');

async function testServiceAnalytics() {
  try {
    console.log('🔑 Logging in as admin...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginRes.data.token;
    const headers = { 'Authorization': 'Bearer ' + token };
    
    console.log('✅ Admin login successful');
    
    // Test service data
    console.log('\n🔧 Testing service analytics...');
    const servicesRes = await axios.get('http://localhost:5000/api/services', { headers });
    
    console.log('✅ Service data retrieved successfully!');
    console.log('📊 Service Analytics Summary:');
    console.log('  - Total Services:', servicesRes.data.length);
    
    // Calculate status distribution
    const statusCounts = servicesRes.data.reduce((acc, service) => {
      acc[service.status] = (acc[service.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Service Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = Math.round((count / servicesRes.data.length) * 100);
      console.log('  -', status + ':', count, '(' + percentage + '%)');
    });
    
    console.log('\n🎉 Service Analytics is working perfectly!');
    
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

testServiceAnalytics();
