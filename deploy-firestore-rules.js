#!/usr/bin/env node

/**
 * Firebase Firestore Rules Deployment Script
 * This script helps deploy and verify Firestore security rules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_ID = 'taxation-f3ee8';
const RULES_FILE = 'firestore.rules';

console.log('🔥 Firebase Firestore Rules Deployment Script');
console.log('='.repeat(50));

// Check if Firebase CLI is installed
function checkFirebaseCLI() {
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    console.log('✅ Firebase CLI is installed');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI is not installed');
    console.log('📦 Install it with: npm install -g firebase-tools');
    return false;
  }
}

// Check if rules file exists
function checkRulesFile() {
  if (fs.existsSync(RULES_FILE)) {
    console.log(`✅ Rules file found: ${RULES_FILE}`);
    return true;
  } else {
    console.log(`❌ Rules file not found: ${RULES_FILE}`);
    return false;
  }
}

// Validate rules syntax
function validateRules() {
  try {
    const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');
    console.log('📋 Current rules content:');
    console.log('-'.repeat(30));
    console.log(rulesContent);
    console.log('-'.repeat(30));
    
    // Basic syntax validation
    if (!rulesContent.includes('rules_version')) {
      console.log('⚠️  Warning: No rules_version specified');
    }
    
    if (!rulesContent.includes('service cloud.firestore')) {
      console.log('❌ Error: Invalid Firestore service declaration');
      return false;
    }
    
    console.log('✅ Basic rules syntax validation passed');
    return true;
  } catch (error) {
    console.log('❌ Error reading rules file:', error.message);
    return false;
  }
}

// Deploy rules
function deployRules() {
  try {
    console.log('🚀 Deploying Firestore rules...');
    
    // First, set the project
    execSync(`firebase use ${PROJECT_ID}`, { stdio: 'inherit' });
    
    // Deploy only firestore rules
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
    
    console.log('✅ Rules deployed successfully!');
    return true;
  } catch (error) {
    console.log('❌ Error deploying rules:', error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log(`🎯 Target project: ${PROJECT_ID}`);
  console.log('');
  
  // Step 1: Check prerequisites
  if (!checkFirebaseCLI()) {
    process.exit(1);
  }
  
  if (!checkRulesFile()) {
    process.exit(1);
  }
  
  // Step 2: Validate rules
  if (!validateRules()) {
    process.exit(1);
  }
  
  // Step 3: Deploy rules
  if (!deployRules()) {
    process.exit(1);
  }
  
  console.log('');
  console.log('🎉 Deployment completed successfully!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Verify rules in Firebase Console');
  console.log('2. Test your application endpoints');
  console.log('3. Check for any remaining permission errors');
  console.log('');
  console.log('🔗 Firebase Console: https://console.firebase.google.com/project/taxation-f3ee8/firestore/rules');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkFirebaseCLI, checkRulesFile, validateRules, deployRules };