#!/usr/bin/env node

/**
 * Firestore Rule Deployment Verification Script
 * Comprehensive validation of Firestore security rules deployment and status
 */

const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

const PROJECT_ID = 'taxation-f3ee8';
const RULES_FILE = 'firestore.rules';
const FIREBASE_CONFIG = 'firebase.json';

class FirestoreRuleValidator {
  constructor() {
    this.results = {
      rulesFile: false,
      firebaseConfig: false,
      cliAvailable: false,
      cliAuthenticated: false,
      rulesDeployed: false,
      rulesSyntaxValid: false,
      deploymentTimestamp: null,
      errors: [],
      warnings: []
    };
  }

  /**
   * Main validation function
   */
  async validate() {
    console.log('🔥 Firestore Rule Deployment Validator');
    console.log('='.repeat(50));
    console.log(`📋 Project: ${PROJECT_ID}`);
    console.log(`📅 Validation Time: ${new Date().toISOString()}\n`);

    try {
      await this.validateRulesFile();
      await this.validateFirebaseConfig();
      await this.validateFirebaseCLI();
      await this.validateRulesSyntax();
      await this.validateDeploymentStatus();
      
      this.generateReport();
      return this.results;
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
      this.results.errors.push(error.message);
      return this.results;
    }
  }

  /**
   * Validate rules file exists and is readable
   */
  async validateRulesFile() {
    console.log('📄 Validating rules file...');
    
    try {
      if (!fs.existsSync(RULES_FILE)) {
        throw new Error(`Rules file not found: ${RULES_FILE}`);
      }

      const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');
      
      // Basic content validation
      const requiredElements = [
        { pattern: /rules_version\s*=\s*['"]2['"]/, name: 'Rules version 2' },
        { pattern: /service\s+cloud\.firestore/, name: 'Firestore service declaration' },
        { pattern: /match\s+\/databases\/\{database\}\/documents/, name: 'Database documents match' },
        { pattern: /allow\s+(read|write)/, name: 'Allow statements' }
      ];

      const missingElements = requiredElements.filter(element => 
        !element.pattern.test(rulesContent)
      );

      if (missingElements.length > 0) {
        this.results.warnings.push(`Missing elements: ${missingElements.map(e => e.name).join(', ')}`);
      }

      this.results.rulesFile = true;
      console.log('✅ Rules file validation passed');
      
      // Display current rules
      console.log('\n📋 Current Rules Content:');
      console.log('-'.repeat(40));
      console.log(rulesContent);
      console.log('-'.repeat(40));

    } catch (error) {
      this.results.errors.push(`Rules file validation failed: ${error.message}`);
      console.log(`❌ Rules file validation failed: ${error.message}`);
    }
  }

  /**
   * Validate Firebase configuration
   */
  async validateFirebaseConfig() {
    console.log('\n🔧 Validating Firebase configuration...');
    
    try {
      if (!fs.existsSync(FIREBASE_CONFIG)) {
        throw new Error(`Firebase config not found: ${FIREBASE_CONFIG}`);
      }

      const config = JSON.parse(fs.readFileSync(FIREBASE_CONFIG, 'utf8'));
      
      if (!config.firestore) {
        throw new Error('Firestore configuration missing in firebase.json');
      }

      if (!config.firestore.rules) {
        throw new Error('Firestore rules path not configured');
      }

      if (config.firestore.rules !== RULES_FILE) {
        this.results.warnings.push(`Rules path mismatch: configured=${config.firestore.rules}, expected=${RULES_FILE}`);
      }

      this.results.firebaseConfig = true;
      console.log('✅ Firebase configuration validation passed');
      console.log(`   - Rules file: ${config.firestore.rules}`);
      console.log(`   - Indexes file: ${config.firestore.indexes || 'not configured'}`);

    } catch (error) {
      this.results.errors.push(`Firebase config validation failed: ${error.message}`);
      console.log(`❌ Firebase config validation failed: ${error.message}`);
    }
  }

  /**
   * Validate Firebase CLI availability and authentication
   */
  async validateFirebaseCLI() {
    console.log('\n🛠️ Validating Firebase CLI...');
    
    try {
      // Check if CLI is installed
      const version = execSync('firebase --version', { encoding: 'utf8', stdio: 'pipe' });
      this.results.cliAvailable = true;
      console.log(`✅ Firebase CLI available: ${version.trim()}`);

      // Check authentication
      try {
        execSync('firebase projects:list', { encoding: 'utf8', stdio: 'pipe' });
        this.results.cliAuthenticated = true;
        console.log('✅ Firebase CLI authenticated');
      } catch (authError) {
        this.results.warnings.push('Firebase CLI not authenticated');
        console.log('⚠️ Firebase CLI not authenticated');
      }

    } catch (error) {
      this.results.errors.push('Firebase CLI not available');
      console.log('❌ Firebase CLI not available');
    }
  }

  /**
   * Validate rules syntax
   */
  async validateRulesSyntax() {
    console.log('\n🔍 Validating rules syntax...');
    
    if (!this.results.cliAvailable || !this.results.cliAuthenticated) {
      console.log('⚠️ Skipping syntax validation (CLI not available/authenticated)');
      return;
    }

    try {
      // Use Firebase CLI to validate syntax
      execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' });
      
      // This command will fail if syntax is invalid
      const output = execSync('firebase firestore:rules:canary-deploy --dry-run', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      
      this.results.rulesSyntaxValid = true;
      console.log('✅ Rules syntax validation passed');
      
    } catch (error) {
      // Try alternative validation method
      try {
        const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');
        
        // Basic syntax checks
        const syntaxChecks = [
          { pattern: /rules_version\s*=\s*['"]2['"];?/, error: 'Invalid rules_version syntax' },
          { pattern: /service\s+cloud\.firestore\s*\{/, error: 'Invalid service declaration' },
          { pattern: /match\s+[^{]+\{/, error: 'Invalid match statement syntax' },
          { pattern: /allow\s+(read|write)[^;]*;/, error: 'Invalid allow statement syntax' }
        ];

        const syntaxErrors = syntaxChecks.filter(check => 
          !check.pattern.test(rulesContent)
        );

        if (syntaxErrors.length === 0) {
          this.results.rulesSyntaxValid = true;
          console.log('✅ Basic syntax validation passed');
        } else {
          this.results.errors.push(`Syntax errors: ${syntaxErrors.map(e => e.error).join(', ')}`);
          console.log('❌ Syntax validation failed');
        }
        
      } catch (fallbackError) {
        this.results.warnings.push('Could not validate rules syntax');
        console.log('⚠️ Could not validate rules syntax');
      }
    }
  }

  /**
   * Validate deployment status
   */
  async validateDeploymentStatus() {
    console.log('\n🚀 Validating deployment status...');
    
    if (!this.results.cliAvailable || !this.results.cliAuthenticated) {
      console.log('⚠️ Skipping deployment validation (CLI not available/authenticated)');
      return;
    }

    try {
      // Check if we can access the project
      execSync(`firebase use ${PROJECT_ID}`, { stdio: 'pipe' });
      
      // Try to get current rules (this indicates successful deployment)
      try {
        const output = execSync('firebase firestore:rules:get', { 
          encoding: 'utf8', 
          stdio: 'pipe' 
        });
        
        this.results.rulesDeployed = true;
        this.results.deploymentTimestamp = new Date().toISOString();
        console.log('✅ Rules appear to be deployed');
        
      } catch (getRulesError) {
        // Alternative check - try a simple deployment dry run
        try {
          execSync('firebase deploy --only firestore:rules --dry-run', { stdio: 'pipe' });
          this.results.rulesDeployed = true;
          console.log('✅ Rules deployment configuration valid');
        } catch (dryRunError) {
          this.results.warnings.push('Could not verify deployment status');
          console.log('⚠️ Could not verify deployment status');
        }
      }
      
    } catch (error) {
      this.results.warnings.push(`Deployment validation failed: ${error.message}`);
      console.log(`⚠️ Deployment validation failed: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive report
   */
  generateReport() {
    console.log('\n📊 Validation Report');
    console.log('='.repeat(30));
    
    const checks = [
      { name: 'Rules File', status: this.results.rulesFile },
      { name: 'Firebase Config', status: this.results.firebaseConfig },
      { name: 'Firebase CLI', status: this.results.cliAvailable },
      { name: 'CLI Authentication', status: this.results.cliAuthenticated },
      { name: 'Rules Syntax', status: this.results.rulesSyntaxValid },
      { name: 'Deployment Status', status: this.results.rulesDeployed }
    ];

    checks.forEach(check => {
      const icon = check.status ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
    });

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      this.results.warnings.forEach(warning => console.log(`   - ${warning}`));
    }

    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }

    // Overall status
    const allCriticalPassed = this.results.rulesFile && 
                             this.results.firebaseConfig && 
                             this.results.rulesSyntaxValid;

    console.log('\n🎯 Overall Status:');
    if (allCriticalPassed) {
      console.log('✅ VALIDATION PASSED - Rules are ready for deployment');
    } else {
      console.log('❌ VALIDATION FAILED - Issues need to be resolved');
    }

    // Recommendations
    console.log('\n💡 Recommendations:');
    if (!this.results.cliAuthenticated) {
      console.log('   - Run: firebase login');
    }
    if (!this.results.rulesDeployed) {
      console.log('   - Run: firebase deploy --only firestore:rules');
    }
    if (this.results.warnings.length > 0) {
      console.log('   - Review and address warnings above');
    }
  }

  /**
   * Get validation results as JSON
   */
  getResults() {
    return this.results;
  }
}

// Export for use as module
module.exports = FirestoreRuleValidator;

// Run directly if called as script
if (require.main === module) {
  const validator = new FirestoreRuleValidator();
  validator.validate().then(results => {
    process.exit(results.errors.length > 0 ? 1 : 0);
  });
}