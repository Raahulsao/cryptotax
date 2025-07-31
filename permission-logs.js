#!/usr/bin/env node

/**
 * Permission Logs CLI
 * Command-line interface for viewing and analyzing permission logs
 */

const { PermissionLogger } = require('./lib/utils/permission-logger');

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const options = {
    user: args.find(arg => arg.startsWith('--user='))?.split('=')[1],
    operation: args.find(arg => arg.startsWith('--operation='))?.split('=')[1],
    result: args.find(arg => arg.startsWith('--result='))?.split('=')[1],
    since: args.find(arg => arg.startsWith('--since='))?.split('=')[1],
    limit: parseInt(args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || '50'),
    format: args.find(arg => arg.startsWith('--format='))?.split('=')[1] || 'table',
    help: args.includes('--help') || args.includes('-h')
  };

  if (options.help || !command) {
    showHelp();
    return;
  }

  try {
    switch (command) {
      case 'list':
        await listLogs(options);
        break;
      case 'summary':
        await showSummary(options);
        break;
      case 'user':
        await showUserActivity(options);
        break;
      case 'report':
        await generateReport(options);
        break;
      case 'export':
        await exportLogs(options);
        break;
      case 'clear':
        await clearLogs();
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🔐 Permission Logs CLI

Usage: node permission-logs.js <command> [options]

Commands:
  list        Show recent permission attempts
  summary     Show permission activity summary
  user        Show activity for specific user
  report      Generate comprehensive report
  export      Export logs to file
  clear       Clear all logs

Options:
  --user=<id>         Filter by user ID
  --operation=<op>    Filter by operation name
  --result=<result>   Filter by result (success|denied|error)
  --since=<time>      Show logs since timestamp (ISO format)
  --limit=<n>         Limit number of results (default: 50)
  --format=<fmt>      Output format (table|json|csv)
  --help, -h          Show this help message

Examples:
  node permission-logs.js list --limit=20
  node permission-logs.js summary --since=2025-01-01T00:00:00Z
  node permission-logs.js user --user=user123
  node permission-logs.js list --result=denied --limit=10
  node permission-logs.js export --format=csv > logs.csv

Filter Options:
  --result values: success, denied, error
  --format values: table, json, csv
`);
}

async function listLogs(options) {
  console.log('🔐 Permission Logs');
  console.log('='.repeat(50));

  const filter = {
    userId: options.user,
    operation: options.operation,
    result: options.result,
    since: options.since,
    limit: options.limit
  };

  const logs = PermissionLogger.getLogs(filter);

  if (logs.length === 0) {
    console.log('📭 No logs found matching the criteria');
    return;
  }

  if (options.format === 'json') {
    console.log(JSON.stringify(logs, null, 2));
    return;
  }

  if (options.format === 'csv') {
    console.log(PermissionLogger.exportLogs('csv'));
    return;
  }

  // Table format
  console.log(`📊 Showing ${logs.length} log entries\n`);

  logs.forEach((log, index) => {
    const icon = getResultIcon(log.result);
    const timestamp = new Date(log.timestamp).toLocaleString();
    const duration = log.duration ? ` (${log.duration}ms)` : '';
    
    console.log(`${index + 1}. ${icon} ${timestamp}`);
    console.log(`   Operation: ${log.operation}`);
    console.log(`   Resource: ${log.resource}`);
    console.log(`   User: ${log.userId || 'N/A'}`);
    console.log(`   Result: ${log.result}${duration}`);
    
    if (log.errorMessage) {
      console.log(`   Error: ${log.errorMessage}`);
    }
    
    if (log.collection) {
      console.log(`   Collection: ${log.collection}`);
    }
    
    if (log.documentId) {
      console.log(`   Document: ${log.documentId}`);
    }
    
    console.log('');
  });
}

async function showSummary(options) {
  console.log('📊 Permission Activity Summary');
  console.log('='.repeat(40));

  const summary = PermissionLogger.getLogSummary(options.since);

  if (options.format === 'json') {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log(`📅 Time Range: ${summary.timeRange.start} to ${summary.timeRange.end}`);
  console.log(`📈 Total Attempts: ${summary.totalAttempts}`);
  console.log(`✅ Successful: ${summary.successfulAttempts} (${getPercentage(summary.successfulAttempts, summary.totalAttempts)}%)`);
  console.log(`🚫 Denied: ${summary.deniedAttempts} (${getPercentage(summary.deniedAttempts, summary.totalAttempts)}%)`);
  console.log(`❌ Errors: ${summary.errorAttempts} (${getPercentage(summary.errorAttempts, summary.totalAttempts)}%)`);
  console.log(`👥 Unique Users: ${summary.uniqueUsers}`);

  if (summary.topOperations.length > 0) {
    console.log('\n🔝 Top Operations:');
    summary.topOperations.forEach((op, i) => {
      console.log(`   ${i + 1}. ${op.operation}: ${op.count} attempts`);
    });
  }

  if (summary.topErrors.length > 0) {
    console.log('\n⚠️ Top Errors:');
    summary.topErrors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.error}: ${err.count} occurrences`);
    });
  }
}

async function showUserActivity(options) {
  if (!options.user) {
    console.error('❌ User ID required. Use --user=<id>');
    process.exit(1);
  }

  console.log(`👤 User Activity: ${options.user}`);
  console.log('='.repeat(40));

  const activity = PermissionLogger.getUserActivity(options.user, options.limit);

  if (options.format === 'json') {
    console.log(JSON.stringify(activity, null, 2));
    return;
  }

  console.log(`📊 Summary:`);
  console.log(`   Total Attempts: ${activity.summary.totalAttempts}`);
  console.log(`   Success Rate: ${activity.summary.successRate}%`);
  
  if (activity.summary.commonOperations.length > 0) {
    console.log(`   Common Operations: ${activity.summary.commonOperations.join(', ')}`);
  }
  
  if (activity.summary.recentErrors.length > 0) {
    console.log(`   Recent Errors: ${activity.summary.recentErrors.slice(0, 3).join(', ')}`);
  }

  if (activity.recentAttempts.length > 0) {
    console.log(`\n📋 Recent Activity (${activity.recentAttempts.length} entries):`);
    
    activity.recentAttempts.slice(0, 10).forEach((log, index) => {
      const icon = getResultIcon(log.result);
      const timestamp = new Date(log.timestamp).toLocaleTimeString();
      const duration = log.duration ? ` (${log.duration}ms)` : '';
      
      console.log(`   ${index + 1}. ${icon} ${timestamp} - ${log.operation} → ${log.resource}${duration}`);
      
      if (log.errorMessage && log.result !== 'success') {
        console.log(`      Error: ${log.errorMessage}`);
      }
    });
  }
}

async function generateReport(options) {
  console.log('📋 Generating Permission Report...\n');

  const report = PermissionLogger.generateReport(options.since);
  console.log(report);
}

async function exportLogs(options) {
  const format = options.format || 'json';
  const exported = PermissionLogger.exportLogs(format);
  
  console.log(exported);
  
  // Log to stderr so it doesn't interfere with piped output
  console.error(`📤 Exported ${PermissionLogger.getLogs().length} logs in ${format} format`);
}

async function clearLogs() {
  console.log('🧹 Clearing all permission logs...');
  PermissionLogger.clearLogs();
  console.log('✅ All logs cleared');
}

function getResultIcon(result) {
  switch (result) {
    case 'success': return '✅';
    case 'denied': return '🚫';
    case 'error': return '❌';
    default: return '❓';
  }
}

function getPercentage(value, total) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

// Run the CLI
main();