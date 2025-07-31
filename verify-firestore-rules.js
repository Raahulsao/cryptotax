#!/usr/bin/env node

/**
 * Firestore Rules Verification Script
 * This script helps verify the current state of Firestore rules and provides deployment guidance
 */

const fs = require('fs');
const https = require('https');

const PROJECT_ID = 'taxation-f3ee8';
const RULES_FILE = 'firestore.rules';

console.log('🔥 Firestore Rules Verification Script');
console.log('='.repeat(50));

// Check if rules file exists and validate syntax
function checkRulesFile() {
  console.log('📋 Checking rules file...');
  
  if (!fs.existsSync(RULES_FILE)) {
    console.log(`❌ Rules file not found: ${RULES_FILE}`);
    return false;
  }
  
  try {
    const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');
    console.log('✅ Rules file found and readable');
    console.log('\n📄 Current rules content:');
    console.log('-'.repeat(40));
    console.log(rulesContent);
    console.log('-'.repeat(40));
    
    // Basic syntax validation
    const validations = [
      { check: rulesContent.includes('rules_version'), message: 'Rules version specified' },
      { check: rulesContent.includes('service cloud.firestore'), message: 'Firestore service declaration found' },
      { check: rulesContent.includes('match /databases/{database}/documents'), message: 'Database match pattern found' },
      { check: rulesContent.includes('request.auth'), message: 'Authentication checks present' }
    ];
    
    console.log('\n🔍 Syntax validation:');
    validations.forEach(({ check, message }) => {
      console.log(`${check ? '✅' : '❌'} ${message}`);
    });
    
    return validations.every(v => v.check);
  } catch (error) {
    console.log('❌ Error reading rules file:', error.message);
    return false;
  }
}

// Check Firebase configuration
function checkFirebaseConfig() {
  console.log('\n🔧 Checking Firebase configuration...');
  
  const configFiles = [
    { file: 'firebase.json', required: true },
    { file: '.firebaserc', required: false },
    { file: 'firestore.indexes.json', required: false }
  ];
  
  configFiles.forEach(({ file, required }) => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} found`);
      if (file === 'firebase.json') {
        try {
          const config = JSON.parse(fs.readFileSync(file, 'utf8'));
          console.log(`   - Firestore rules: ${config.firestore?.rules || 'not configured'}`);
          console.log(`   - Firestore indexes: ${config.firestore?.indexes || 'not configured'}`);
        } catch (error) {
          console.log(`   - Error parsing ${file}: ${error.message}`);
        }
      }
    } else {
      console.log(`${required ? '❌' : '⚠️'} ${file} ${required ? 'missing (required)' : 'not found (optional)'}`);
    }
  });
}

// Provide deployment instructions
function provideDeploymentInstructions() {
  console.log('\n🚀 Deployment Instructions:');
  console.log('='.repeat(30));
  
  console.log('\n📋 Manual Deployment (Recommended):');
  console.log('1. Open Firebase Console: https://console.firebase.google.com/');
  console.log(`2. Select project: ${PROJECT_ID}`);
  console.log('3. Go to Firestore Database → Rules');
  console.log('4. Copy the rules from firestore.rules file');
  console.log('5. Paste into the Firebase Console rules editor');
  console.log('6. Click "Publish" button');
  console.log('7. Wait for confirmation message');
  
  console.log('\n💻 CLI Deployment (If authenticated):');
  console.log('1. Install Firebase CLI: npm install -g firebase-tools');
  console.log('2. Login: firebase login');
  console.log(`3. Set project: firebase use ${PROJECT_ID}`);
  console.log('4. Deploy: firebase deploy --only firestore:rules');
  
  console.log('\n🔍 Verification Steps:');
  console.log('1. Check Firebase Console for "Last published" timestamp');
  console.log('2. Test your application endpoints');
  console.log('3. Check browser console for permission errors');
  console.log('4. Verify authenticated users can access their data');
}

// Check if Firebase CLI is available
function checkFirebaseCLI() {
  console.log('\n🛠️ Checking Firebase CLI...');
  
  try {
    const { execSync } = require('child_process');
    const version = execSync('firebase --version', { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ Firebase CLI installed: ${version.trim()}`);
    
    try {
      execSync('firebase projects:list', { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ Firebase CLI authenticated');
      return 'authenticated';
    } catch (error) {
      console.log('⚠️ Firebase CLI not authenticated');
      console.log('   Run: firebase login');
      return 'not-authenticated';
    }
  } catch (error) {
    console.log('❌ Firebase CLI not installed');
    console.log('   Install with: npm install -g firebase-tools');
    return 'not-installed';
  }
}

// Main verification function
function main() {
  console.log(`🎯 Target project: ${PROJECT_ID}\n`);
  
  const rulesValid = checkRulesFile();
  checkFirebaseConfig();
  const cliStatus = checkFirebaseCLI();
  
  console.log('\n📊 Summary:');
  console.log('='.repeat(20));
  console.log(`Rules file valid: ${rulesValid ? '✅' : '❌'}`);
  console.log(`Firebase CLI: ${cliStatus === 'authenticated' ? '✅ Ready' : cliStatus === 'not-authenticated' ? '⚠️ Not authenticated' : '❌ Not installed'}`);
  
  if (rulesValid && cliStatus === 'authenticated') {
    console.log('\n🎉 Ready for automatic deployment!');
    console.log('Run: firebase deploy --only firestore:rules');
  } else {
    console.log('\n📋 Manual deployment required');
  }
  
  provideDeploymentInstructions();
  
  console.log('\n🔗 Useful Links:');
  console.log(`- Firebase Console: https://console.firebase.google.com/project/${PROJECT_ID}/firestore/rules`);
  console.log('- Firebase CLI Documentation: https://firebase.google.com/docs/cli');
  console.log('- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { checkRulesFile, checkFirebaseConfig, checkFirebaseCLI };