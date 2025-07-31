#!/usr/bin/env node

/**
 * CLI wrapper for Firestore Rule Validator
 * Simple command-line interface for rule validation
 */

const FirestoreRuleValidator = require('./lib/utils/firestore-rule-validator');

async function main() {
  const args = process.argv.slice(2);
  const options = {
    json: args.includes('--json'),
    verbose: args.includes('--verbose'),
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help) {
    console.log(`
🔥 Firestore Rule Validator

Usage: node validate-firestore-rules.js [options]

Options:
  --json      Output results in JSON format
  --verbose   Show detailed validation steps
  --help, -h  Show this help message

Examples:
  node validate-firestore-rules.js
  node validate-firestore-rules.js --json
  node validate-firestore-rules.js --verbose

Description:
  Validates Firestore security rules deployment status, syntax,
  and configuration. Checks Firebase CLI availability and
  authentication status.
`);
    return;
  }

  try {
    const validator = new FirestoreRuleValidator();
    const results = await validator.validate();

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    }

    // Exit with error code if validation failed
    const hasErrors = results.errors.length > 0;
    process.exit(hasErrors ? 1 : 0);

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run the CLI
main();