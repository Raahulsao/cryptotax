# 🔥 Firestore Rules Deployment Guide

## Current Issue
Your application is getting "Missing or insufficient permissions" errors because Firestore security rules are not properly configured or deployed.

## Quick Fix (Manual Deployment)

### Option 1: Firebase Console (Recommended)

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Select project: `taxation-f3ee8`

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Update Rules**
   - Replace the existing rules with this temporary development rule:
   ```javascript
   rules_version = '2';
   
   service cloud.firestore {
     match /databases/{database}/documents {
       // TEMPORARY: Allow all authenticated users to read/write
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Publish Rules**
   - Click the "Publish" button
   - Wait for confirmation message

### Option 2: Firebase CLI (If Available)

1. **Install Firebase CLI** (if not installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Set Project**
   ```bash
   firebase use taxation-f3ee8
   ```

4. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 3: Automated Script

Run the deployment script:
```bash
node deploy-firestore-rules.js
```

## Verification Steps

After deploying the rules:

1. **Check Firebase Console**
   - Verify the new rules are showing in the Rules tab
   - Look for "Last published" timestamp

2. **Test Your Application**
   - Restart your development server: `npm run dev`
   - Navigate to the dashboard
   - Check if portfolio data loads without errors

3. **Check Browser Console**
   - Open browser developer tools
   - Look for any remaining permission errors

## Expected Results

After successful deployment:
- ✅ No more "Missing or insufficient permissions" errors
- ✅ Portfolio API returns data successfully
- ✅ Dashboard displays user portfolio information
- ✅ Transaction uploads work correctly

## Troubleshooting

### If Rules Don't Deploy
1. Check Firebase project ID is correct: `taxation-f3ee8`
2. Verify you have admin access to the Firebase project
3. Try refreshing the Firebase Console page
4. Check for any syntax errors in the rules

### If Errors Persist
1. Clear browser cache and cookies
2. Restart your development server
3. Check Firebase Console for any error messages
4. Verify user is properly authenticated

### If Still Having Issues
1. Check the browser network tab for API call details
2. Look at server logs for specific error messages
3. Verify the Firebase project configuration in `.env.local`

## Security Note

⚠️ **Important**: The current rule allows all authenticated users to access all data. This is for development only. For production, implement proper user-based access control as defined in the `firestore.rules` file.

## Production Rules (For Later)

When ready for production, use these more secure rules:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /portfolios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /processing_jobs/{jobId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    match /tax_calculations/{calculationId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```