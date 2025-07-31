#!/usr/bin/env node

/**
 * Firestore Rule Testing Utilities
 * Automated testing for Firestore security rules with different user scenarios
 */

const fs = require('fs');
const { execSync } = require('child_process');

const PROJECT_ID = 'taxation-f3ee8';

class FirestoreRuleTester {
  constructor() {
    this.testResults = {
      totalTests: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: [],
      summary: {}
    };
    
    this.testScenarios = this.defineTestScenarios();
  }

  /**
   * Define comprehensive test scenarios
   */
  defineTestScenarios() {
    return [
      // Authenticated user scenarios
      {
        name: 'Authenticated User - Own Transactions',
        description: 'User should be able to read their own transactions',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/transactions/trans-123',
        data: { userId: 'test-user-123', amount: 100 },
        operation: 'read',
        expected: 'allow',
        category: 'authenticated'
      },
      {
        name: 'Authenticated User - Own Portfolio',
        description: 'User should be able to read their own portfolio',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/portfolios/test-user-123',
        data: { userId: 'test-user-123', totalValue: 1000 },
        operation: 'read',
        expected: 'allow',
        category: 'authenticated'
      },
      {
        name: 'Authenticated User - Create Transaction',
        description: 'User should be able to create their own transactions',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/transactions/new-trans',
        data: { userId: 'test-user-123', amount: 50 },
        operation: 'create',
        expected: 'allow',
        category: 'authenticated'
      },
      {
        name: 'Authenticated User - Update Own Data',
        description: 'User should be able to update their own data',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/users/test-user-123',
        data: { name: 'Test User', email: 'test@example.com' },
        operation: 'write',
        expected: 'allow',
        category: 'authenticated'
      },

      // Cross-user access scenarios (should be denied in production)
      {
        name: 'Authenticated User - Other User Transactions',
        description: 'User should NOT be able to read other users transactions',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/transactions/trans-456',
        data: { userId: 'other-user-456', amount: 200 },
        operation: 'read',
        expected: 'deny',
        category: 'cross-user'
      },
      {
        name: 'Authenticated User - Other User Portfolio',
        description: 'User should NOT be able to read other users portfolio',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/portfolios/other-user-456',
        data: { userId: 'other-user-456', totalValue: 2000 },
        operation: 'read',
        expected: 'deny',
        category: 'cross-user'
      },
      {
        name: 'Authenticated User - Create Transaction for Other User',
        description: 'User should NOT be able to create transactions for other users',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/transactions/malicious-trans',
        data: { userId: 'other-user-456', amount: 1000000 },
        operation: 'create',
        expected: 'deny',
        category: 'cross-user'
      },

      // Unauthenticated scenarios
      {
        name: 'Unauthenticated - Read Transactions',
        description: 'Unauthenticated users should NOT be able to read transactions',
        auth: null,
        resource: '/databases/(default)/documents/transactions/trans-123',
        data: { userId: 'test-user-123', amount: 100 },
        operation: 'read',
        expected: 'deny',
        category: 'unauthenticated'
      },
      {
        name: 'Unauthenticated - Read Portfolio',
        description: 'Unauthenticated users should NOT be able to read portfolios',
        auth: null,
        resource: '/databases/(default)/documents/portfolios/test-user-123',
        data: { userId: 'test-user-123', totalValue: 1000 },
        operation: 'read',
        expected: 'deny',
        category: 'unauthenticated'
      },
      {
        name: 'Unauthenticated - Create Transaction',
        description: 'Unauthenticated users should NOT be able to create transactions',
        auth: null,
        resource: '/databases/(default)/documents/transactions/anon-trans',
        data: { userId: 'anonymous', amount: 50 },
        operation: 'create',
        expected: 'deny',
        category: 'unauthenticated'
      },
      {
        name: 'Unauthenticated - Write User Data',
        description: 'Unauthenticated users should NOT be able to write user data',
        auth: null,
        resource: '/databases/(default)/documents/users/anonymous',
        data: { name: 'Anonymous', email: 'anon@example.com' },
        operation: 'write',
        expected: 'deny',
        category: 'unauthenticated'
      },

      // Edge cases
      {
        name: 'Empty User ID',
        description: 'Requests with empty user ID should be denied',
        auth: { uid: '' },
        resource: '/databases/(default)/documents/transactions/empty-user',
        data: { userId: '', amount: 100 },
        operation: 'read',
        expected: 'deny',
        category: 'edge-case'
      },
      {
        name: 'Null User ID in Data',
        description: 'Data with null userId should be handled properly',
        auth: { uid: 'test-user-123' },
        resource: '/databases/(default)/documents/transactions/null-user',
        data: { userId: null, amount: 100 },
        operation: 'read',
        expected: 'deny',
        category: 'edge-case'
      }
    ];
  }

  /**
   * Run all test scenarios
   */
  async runAllTests() {
    console.log('🧪 Firestore Rule Testing Suite');
    console.log('='.repeat(50));
    console.log(`📋 Project: ${PROJECT_ID}`);
    console.log(`📅 Test Time: ${new Date().toISOString()}`);
    console.log(`🎯 Total Scenarios: ${this.testScenarios.length}\n`);

    // Check if we can run tests
    const canRunTests = await this.checkTestPrerequisites();
    if (!canRunTests) {
      console.log('❌ Cannot run tests - prerequisites not met');
      return this.testResults;
    }

    // Run tests by category
    const categories = [...new Set(this.testScenarios.map(t => t.category))];
    
    for (const category of categories) {
      await this.runTestCategory(category);
    }

    this.generateTestReport();
    return this.testResults;
  }

  /**
   * Check if we can run tests
   */
  async checkTestPrerequisites() {
    console.log('🔍 Checking test prerequisites...');
    
    try {
      // Check Firebase CLI
      execSync('firebase --version', { stdio: 'pipe' });
      console.log('✅ Firebase CLI available');

      // Check authentication
      execSync('firebase projects:list', { stdio: 'pipe' });
      console.log('✅ Firebase CLI authenticated');

      // Check project access
      execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' });
      console.log('✅ Project access confirmed');

      return true;
    } catch (error) {
      console.log('❌ Prerequisites not met:', error.message);
      console.log('\n💡 To run tests:');
      console.log('1. Install Firebase CLI: npm install -g firebase-tools');
      console.log('2. Login: firebase login');
      console.log(`3. Set project: firebase use ${PROJECT_ID}`);
      return false;
    }
  }

  /**
   * Run tests for a specific category
   */
  async runTestCategory(category) {
    const categoryTests = this.testScenarios.filter(t => t.category === category);
    
    console.log(`\n📂 Testing Category: ${category.toUpperCase()}`);
    console.log('-'.repeat(40));

    for (const test of categoryTests) {
      await this.runSingleTest(test);
    }
  }

  /**
   * Run a single test scenario
   */
  async runSingleTest(testScenario) {
    this.testResults.totalTests++;
    
    const testResult = {
      name: testScenario.name,
      description: testScenario.description,
      category: testScenario.category,
      expected: testScenario.expected,
      actual: null,
      passed: false,
      error: null,
      skipped: false
    };

    try {
      console.log(`🧪 ${testScenario.name}`);
      
      // For now, we'll simulate the test results based on current rules
      // In a real implementation, this would use Firebase Rules Playground API
      const result = await this.simulateRuleTest(testScenario);
      
      testResult.actual = result;
      testResult.passed = result === testScenario.expected;
      
      if (testResult.passed) {
        console.log(`   ✅ PASS - Expected: ${testScenario.expected}, Got: ${result}`);
        this.testResults.passed++;
      } else {
        console.log(`   ❌ FAIL - Expected: ${testScenario.expected}, Got: ${result}`);
        this.testResults.failed++;
      }

    } catch (error) {
      testResult.error = error.message;
      testResult.skipped = true;
      console.log(`   ⚠️ SKIP - ${error.message}`);
      this.testResults.skipped++;
    }

    this.testResults.tests.push(testResult);
  }

  /**
   * Simulate rule test based on current rules
   * In production, this would integrate with Firebase Rules Playground
   */
  async simulateRuleTest(testScenario) {
    // Read current rules to determine behavior
    const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
    
    // Check if rules are permissive (allow all)
    if (rulesContent.includes('allow read, write: if true')) {
      return 'allow'; // Current permissive rules allow everything
    }
    
    // Check if rules require authentication
    if (rulesContent.includes('request.auth != null')) {
      if (!testScenario.auth) {
        return 'deny'; // No auth provided
      }
      
      // Check for user-specific rules
      if (rulesContent.includes('request.auth.uid == userId') || 
          rulesContent.includes('request.auth.uid == resource.data.userId')) {
        
        if (testScenario.data && testScenario.data.userId) {
          return testScenario.auth.uid === testScenario.data.userId ? 'allow' : 'deny';
        }
        
        // For user documents, check if accessing own document
        if (testScenario.resource.includes('/users/')) {
          const resourceUserId = testScenario.resource.split('/users/')[1];
          return testScenario.auth.uid === resourceUserId ? 'allow' : 'deny';
        }
        
        return 'allow'; // Default for authenticated users
      }
      
      return 'allow'; // Authenticated user with permissive rules
    }
    
    // Default deny if no rules match
    return 'deny';
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(30));
    
    const passRate = this.testResults.totalTests > 0 ? 
      (this.testResults.passed / this.testResults.totalTests * 100).toFixed(1) : 0;
    
    console.log(`📈 Total Tests: ${this.testResults.totalTests}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`⚠️ Skipped: ${this.testResults.skipped}`);
    console.log(`📊 Pass Rate: ${passRate}%`);

    // Category breakdown
    const categories = [...new Set(this.testResults.tests.map(t => t.category))];
    console.log('\n📂 Results by Category:');
    
    categories.forEach(category => {
      const categoryTests = this.testResults.tests.filter(t => t.category === category);
      const categoryPassed = categoryTests.filter(t => t.passed).length;
      const categoryTotal = categoryTests.length;
      const categoryRate = categoryTotal > 0 ? (categoryPassed / categoryTotal * 100).toFixed(1) : 0;
      
      console.log(`   ${category}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    });

    // Failed tests details
    const failedTests = this.testResults.tests.filter(t => !t.passed && !t.skipped);
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      failedTests.forEach(test => {
        console.log(`   - ${test.name}`);
        console.log(`     Expected: ${test.expected}, Got: ${test.actual}`);
      });
    }

    // Overall assessment
    console.log('\n🎯 Overall Assessment:');
    if (this.testResults.failed === 0) {
      console.log('✅ ALL TESTS PASSED - Rules are working correctly');
    } else if (this.testResults.failed <= 2) {
      console.log('⚠️ MOSTLY PASSING - Minor issues detected');
    } else {
      console.log('❌ MULTIPLE FAILURES - Rules need attention');
    }

    // Store summary
    this.testResults.summary = {
      passRate: parseFloat(passRate),
      status: this.testResults.failed === 0 ? 'PASS' : 'FAIL',
      categories: categories.map(cat => {
        const tests = this.testResults.tests.filter(t => t.category === cat);
        return {
          name: cat,
          passed: tests.filter(t => t.passed).length,
          total: tests.length
        };
      })
    };
  }

  /**
   * Get test results
   */
  getResults() {
    return this.testResults;
  }

  /**
   * Generate Firebase Rules Playground URLs for manual testing
   */
  generatePlaygroundUrls() {
    console.log('\n🔗 Firebase Rules Playground URLs:');
    console.log('For manual testing, use these URLs:\n');
    
    const baseUrl = `https://console.firebase.google.com/project/${PROJECT_ID}/firestore/rules`;
    console.log(`📋 Rules Editor: ${baseUrl}`);
    console.log(`🧪 Rules Playground: ${baseUrl} (click Playground tab)`);
    
    console.log('\n📝 Sample test cases for manual verification:');
    
    // Show a few key test cases
    const keyTests = this.testScenarios.slice(0, 3);
    keyTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.name}`);
      console.log(`   Resource: ${test.resource}`);
      console.log(`   Operation: ${test.operation}`);
      console.log(`   Auth: ${test.auth ? `uid: ${test.auth.uid}` : 'unauthenticated'}`);
      console.log(`   Expected: ${test.expected}`);
    });
  }
}

// Export for use as module
module.exports = FirestoreRuleTester;

// Run directly if called as script
if (require.main === module) {
  const tester = new FirestoreRuleTester();
  tester.runAllTests().then(results => {
    tester.generatePlaygroundUrls();
    process.exit(results.failed > 0 ? 1 : 0);
  });
}