# Firestore Setup Guide

## Issue
The application is failing with "Missing or insufficient permissions" errors because Firestore security rules are not properly configured.

## Quick Fix (For Development Only)

**⚠️ WARNING: This is for development only and should NEVER be used in production!**

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `taxation-f3ee8`
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with this temporary development rule:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules allow anyone to read/write all documents.
    // This is for development only!
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click **Publish** to deploy the rules

## Proper Production Setup

For production, use the security rules in `firestore.rules`:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init firestore
```

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Security Rules Explanation

The production rules in `firestore.rules` ensure that:

- **Users collection**: Users can only read/write their own user document
- **Transactions collection**: Users can only access transactions where `userId` matches their auth UID
- **Portfolios collection**: Users can only access their own portfolio document
- **Processing jobs collection**: Users can only access their own processing jobs
- **Tax calculations collection**: Users can only access their own tax calculations

## Testing the Fix

After updating the Firestore rules:

1. Restart your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000/dashboard`
3. The portfolio API calls should now work without permission errors

## Current Error

The current error you're seeing:
```
Error [FirebaseError]: Missing or insufficient permissions.
code: 'permission-denied'
```

This happens because the default Firestore rules deny all access. The user is authenticated (we can see the user ID in the logs), but Firestore security rules are blocking the database operations.

## Next Steps

1. Apply the quick development fix above to get the app working immediately
2. Later, implement the proper production security rules for better security
3. Test all functionality to ensure everything works correctly