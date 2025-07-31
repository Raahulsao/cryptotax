#!/usr/bin/env node

/**
 * Comprehensive Firestore Rules Suite
 * Combined validation and testing for Firestore security rules
 */

const FirestoreRuleValidator = require('./lib/utils/firestore-rule-validator');
const FirestoreRuleTester = require('./lib/utils/firestore-rule-tester');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    validate: args.includes('--validate') || args.length === 0,
    test: args.includes('--test') || args.length === 0,
    json: args.includes('--json'),
    category: args.find(arg => arg.startsWith('--category='))?.split('=')[1],
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    console.log(`
🔥 Firestore Rules Suite - Complete Validation & Testing

Usage: node firestore-rules-suite.js [options]

Options:
  --validate               Run rule validation only
  --test                   Run rule testing only
  --category=<name>        Test specific category only
  --json                   Output results in JSON format
  --help, -h               Show this help message

Examples:
  node firestore-rules-suite.js                    # Run both validation and testing
  node firestore-rules-suite.js --validate         # Validation only
  node firestore-rules-suite.js --test             # Testing only
  node firestore-rules-suite.js --category=authenticated
  node firestore-rules-suite.js --json

Description:
  Comprehensive suite for Firestore security rules that includes:
  
  1. VALIDATION - Checks rule syntax, deployment status, and configuration
  2. TESTING - Runs automated tests against rules with different scenarios
  
  This ensures your Firestore rules are both properly deployed and
  working correctly for all user scenarios.
`);
    return;
  }

  const results = {
    validation: null,
    testing: null,
    overall: {
      status: 'unknown',
      issues: [],
      recommendations: []
    }
  };

  try {
    console.log('🔥 Firestore Rules Comprehensive Suite');
    console.log('='.repeat(50));
    console.log(`📅 Execution Time: ${new Date().toISOString()}\n`);

    // Run validation
    if (options.validate) {
      console.log('🔍 PHASE 1: RULE VALIDATION');
      console.log('='.repeat(30));
      
      const validator = new FirestoreRuleValidator();
      results.validation = await validator.validate();
      
      console.log('\n' + '='.repeat(50));
    }

    // Run testing
    if (options.test) {
      console.log('🧪 PHASE 2: RULE TESTING');
      console.log('='.repeat(30));
      
      const tester = new FirestoreRuleTester();
      
      // Filter by category if specified
      if (options.category) {
        tester.testScenarios = tester.testScenarios.filter(t => t.category === options.category);
      }
      
      results.testing = await tester.runAllTests();
      
      console.log('\n' + '='.repeat(50));
    }

    // Generate overall assessment
    generateOverallAssessment(results);

    if (options.json) {
      console.log('\n📋 JSON Results:');
      console.log(JSON.stringify(results, null, 2));
    }

    // Exit with appropriate code
    const hasIssues = results.overall.issues.length > 0;
    process.exit(hasIssues ? 1 : 0);

  } catch (error) {
    console.error('❌ Suite execution failed:', error.message);
    process.exit(1);
  }
}

/**
 * Generate overall assessment combining validation and testing results
 */
function generateOverallAssessment(results) {
  console.log('🎯 OVERALL ASSESSMENT');
  console.log('='.repeat(30));

  const issues = [];
  const recommendations = [];

  // Analyze validation results
  if (results.validation) {
    if (results.validation.errors.length > 0) {
      issues.push(`Validation errors: ${results.validation.errors.length}`);
      recommendations.push('Fix validation errors before proceeding');
    }
    
    if (results.validation.warnings.length > 0) {
      issues.push(`Validation warnings: ${results.validation.warnings.length}`);
      recommendations.push('Review and address validation warnings');
    }

    if (!results.validation.rulesDeployed) {
      issues.push('Rules may not be properly deployed');
      recommendations.push('Run: firebase deploy --only firestore:rules');
    }
  }

  // Analyze testing results
  if (results.testing) {
    if (results.testing.failed > 0) {
      issues.push(`Failed tests: ${results.testing.failed}/${results.testing.totalTests}`);
      
      // Analyze failure patterns
      const failedTests = results.testing.tests.filter(t => !t.passed && !t.skipped);
      const categories = [...new Set(failedTests.map(t => t.category))];
      
      if (categories.includes('unauthenticated')) {
        recommendations.push('Consider implementing authentication-required rules for production');
      }
      
      if (categories.includes('cross-user')) {
        recommendations.push('Implement user-specific access controls');
      }
    }

    if (results.testing.skipped > 0) {
      issues.push(`Skipped tests: ${results.testing.skipped}`);
      recommendations.push('Ensure all test prerequisites are met');
    }
  }

  // Determine overall status
  let status = 'HEALTHY';
  if (issues.length === 0) {
    status = 'HEALTHY';
  } else if (issues.length <= 2 && results.testing?.failed === 0) {
    status = 'MINOR_ISSUES';
  } else {
    status = 'NEEDS_ATTENTION';
  }

  results.overall = { status, issues, recommendations };

  // Display results
  console.log(`📊 Status: ${getStatusIcon(status)} ${status.replace('_', ' ')}`);
  
  if (issues.length > 0) {
    console.log('\n⚠️ Issues Identified:');
    issues.forEach(issue => console.log(`   - ${issue}`));
  }

  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.forEach(rec => console.log(`   - ${rec}`));
  }

  // Summary stats
  console.log('\n📈 Summary:');
  if (results.validation) {
    const validationStatus = results.validation.errors.length === 0 ? '✅' : '❌';
    console.log(`   Validation: ${validationStatus} ${results.validation.errors.length} errors, ${results.validation.warnings.length} warnings`);
  }
  
  if (results.testing) {
    const testingStatus = results.testing.failed === 0 ? '✅' : '❌';
    const passRate = results.testing.totalTests > 0 ? 
      (results.testing.passed / results.testing.totalTests * 100).toFixed(1) : 0;
    console.log(`   Testing: ${testingStatus} ${results.testing.passed}/${results.testing.totalTests} passed (${passRate}%)`);
  }

  // Next steps
  if (status === 'HEALTHY') {
    console.log('\n🎉 Your Firestore rules are properly configured and working correctly!');
  } else {
    console.log('\n🔧 Next Steps:');
    console.log('   1. Address the issues identified above');
    console.log('   2. Re-run this suite to verify fixes');
    console.log('   3. Consider implementing more restrictive rules for production');
  }
}

/**
 * Get status icon
 */
function getStatusIcon(status) {
  switch (status) {
    case 'HEALTHY': return '✅';
    case 'MINOR_ISSUES': return '⚠️';
    case 'NEEDS_ATTENTION': return '❌';
    default: return '❓';
  }
}

// Run the suite
main();