# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `koinfile-crypto-tax` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's domain

## Step 3: Configure Web App

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon `</>`
4. Register your app with nickname: `koinfile-web`
5. Copy the Firebase configuration object

## Step 4: Set Up Environment Variables

1. Create `.env.local` file in your project root
2. Copy the configuration from Firebase and add to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 5: Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Find the OAuth 2.0 client ID created by Firebase
5. Add your domain to **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Add redirect URIs to **Authorized redirect URIs**:
   - `http://localhost:3000/__/auth/handler` (for development)
   - `https://yourdomain.com/__/auth/handler` (for production)

## Step 6: Set Up Firestore (Optional - for user profiles)

1. Go to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

## Step 7: Configure Security Rules

In Firestore, update the security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 8: Test the Setup

1. Start your development server: `npm run dev`
2. Try signing up with email/password
3. Try signing in with Google
4. Check Firebase Console > Authentication > Users to see registered users

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console > Authentication > Settings > Authorized domains

2. **"Firebase: Error (auth/popup-blocked)"**
   - Browser is blocking popups. Allow popups for your domain or use redirect method

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - Make sure Email/Password and Google sign-in methods are enabled in Firebase Console

4. **Environment variables not loading**
   - Make sure `.env.local` file is in the project root
   - Restart your development server after adding environment variables
   - Check that variable names start with `NEXT_PUBLIC_`

### Testing Checklist:

- [ ] Email/Password signup works
- [ ] Email/Password login works
- [ ] Google sign-in works
- [ ] User data is stored in Firestore
- [ ] Protected routes redirect unauthenticated users
- [ ] Logout works properly
- [ ] User session persists on page refresh

## Production Deployment

Before deploying to production:

1. Update authorized domains in Firebase Console
2. Set up proper Firestore security rules
3. Add production environment variables
4. Test all authentication flows in production environment

## Security Best Practices

1. **Never commit `.env.local`** - add it to `.gitignore`
2. **Use Firestore security rules** to protect user data
3. **Validate user input** on both client and server side
4. **Monitor authentication logs** in Firebase Console
5. **Set up proper CORS** for your domain
6. **Use HTTPS** in production