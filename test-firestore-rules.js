#!/usr/bin/env node

/**
 * CLI wrapper for Firestore Rule Tester
 * Command-line interface for running rule tests
 */

const FirestoreRuleTester = require('./lib/utils/firestore-rule-tester');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    json: args.includes('--json'),
    category: args.find(arg => arg.startsWith('--category='))?.split('=')[1],
    playground: args.includes('--playground'),
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    console.log(`
🧪 Firestore Rule Tester

Usage: node test-firestore-rules.js [options]

Options:
  --json                    Output results in JSON format
  --category=<name>         Run tests for specific category only
                           (authenticated, cross-user, unauthenticated, edge-case)
  --playground             Show Firebase Rules Playground URLs for manual testing
  --help, -h               Show this help message

Examples:
  node test-firestore-rules.js
  node test-firestore-rules.js --category=authenticated
  node test-firestore-rules.js --json
  node test-firestore-rules.js --playground

Description:
  Runs comprehensive tests against Firestore security rules to verify
  they work correctly for different user scenarios including:
  
  - Authenticated users accessing their own data
  - Cross-user access attempts (should be denied)
  - Unauthenticated access attempts (should be denied)
  - Edge cases and error conditions

Categories:
  authenticated    - Tests for authenticated users accessing own data
  cross-user      - Tests for users trying to access other users' data
  unauthenticated - Tests for unauthenticated access attempts
  edge-case       - Tests for edge cases and error conditions
`);
    return;
  }

  if (options.playground) {
    const tester = new FirestoreRuleTester();
    tester.generatePlaygroundUrls();
    return;
  }

  try {
    const tester = new FirestoreRuleTester();
    
    // Filter tests by category if specified
    if (options.category) {
      const validCategories = ['authenticated', 'cross-user', 'unauthenticated', 'edge-case'];
      if (!validCategories.includes(options.category)) {
        console.error(`❌ Invalid category: ${options.category}`);
        console.error(`Valid categories: ${validCategories.join(', ')}`);
        process.exit(1);
      }
      
      // Filter test scenarios
      tester.testScenarios = tester.testScenarios.filter(t => t.category === options.category);
      console.log(`🎯 Running tests for category: ${options.category}`);
    }

    const results = await tester.runAllTests();

    if (options.json) {
      console.log('\n' + JSON.stringify(results, null, 2));
    }

    // Exit with error code if tests failed
    const hasFailures = results.failed > 0;
    process.exit(hasFailures ? 1 : 0);

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run the CLI
main();