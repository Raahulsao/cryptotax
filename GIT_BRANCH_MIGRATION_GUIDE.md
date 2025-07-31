# 🔄 Git Branch Migration: Master → Main

## 📋 **Current Situation**
- Your code is currently on `master` branch
- Need to migrate to `main` branch (modern standard)
- Ensure all changes are properly pushed

## 🚀 **Step-by-Step Migration Process**

### **Step 1: Check Current Status**
```bash
# Check current branch
git branch

# Check if you have uncommitted changes
git status

# Check remote repository
git remote -v
```

### **Step 2: Commit Any Pending Changes**
```bash
# Add all changes
git add .

# Commit with a meaningful message
git commit -m "feat: Complete crypto tax dashboard with portfolio insights and route fixes

- Fixed React Hooks order error in InsightsDashboard
- Enhanced portfolio section with real data integration
- Fixed overview API route type mismatches
- Added comprehensive insights dashboard
- Updated all components to use consistent data sources
- Ready for production deployment"

# Push current changes to master
git push origin master
```

### **Step 3: Create and Switch to Main Branch**
```bash
# Create new main branch from current master
git checkout -b main

# Verify you're on main branch
git branch
# Should show: * main
```

### **Step 4: Push Main Branch to Remote**
```bash
# Push main branch to remote repository
git push origin main

# Set main as the upstream branch
git push --set-upstream origin main
```

### **Step 5: Update Default Branch on GitHub/GitLab**

**For GitHub:**
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Default branch** section
4. Click the switch icon next to `master`
5. Select `main` from dropdown
6. Click **Update**
7. Confirm the change

**For GitLab:**
1. Go to your repository on GitLab
2. Go to **Settings** → **Repository**
3. Expand **Default Branch**
4. Select `main` from dropdown
5. Click **Save changes**

### **Step 6: Delete Old Master Branch (Optional)**
```bash
# Delete local master branch
git branch -d master

# Delete remote master branch (be careful!)
git push origin --delete master
```

## ⚡ **Quick Migration Script**

Here's a complete script to do everything at once:

```bash
#!/bin/bash
echo "🔄 Migrating from master to main branch..."

# Check current status
echo "📊 Current git status:"
git status

# Add and commit any pending changes
echo "💾 Committing pending changes..."
git add .
git commit -m "feat: Complete crypto tax dashboard - ready for production

- Fixed React Hooks order error in InsightsDashboard
- Enhanced portfolio section with real data integration  
- Fixed overview API route type mismatches
- Added comprehensive insights dashboard
- Updated all components to use consistent data sources
- Deployed environment variables configuration
- Ready for Vercel deployment"

# Push current master
echo "⬆️ Pushing to master..."
git push origin master

# Create and switch to main
echo "🌟 Creating main branch..."
git checkout -b main

# Push main branch
echo "🚀 Pushing main branch..."
git push origin main
git push --set-upstream origin main

# Verify
echo "✅ Migration complete!"
echo "Current branch:"
git branch
echo "Remote branches:"
git branch -r

echo "🎉 Successfully migrated to main branch!"
echo "📝 Next steps:"
echo "1. Update default branch on GitHub/GitLab"
echo "2. Deploy to Vercel using main branch"
echo "3. Optionally delete master branch"
```

## 🔍 **Verification Steps**

### **1. Check Local Branches**
```bash
git branch
# Should show: * main
```

### **2. Check Remote Branches**
```bash
git branch -r
# Should show both origin/master and origin/main
```

### **3. Check Git Log**
```bash
git log --oneline -5
# Should show your recent commits
```

### **4. Verify Remote Connection**
```bash
git remote show origin
# Should show main as HEAD branch (after updating default)
```

## 🚨 **Troubleshooting Common Issues**

### **Issue 1: Uncommitted Changes**
```bash
# If you have uncommitted changes
git stash
# Follow migration steps
git stash pop
```

### **Issue 2: Permission Denied**
```bash
# If push fails due to permissions
git remote set-url origin https://your-username@github.com/your-username/your-repo.git
```

### **Issue 3: Branch Already Exists**
```bash
# If main branch already exists
git checkout main
git pull origin main
git merge master
git push origin main
```

### **Issue 4: Large Files**
```bash
# If you have large files causing push issues
git lfs track "*.csv"
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Add LFS tracking"
```

## 📱 **Mobile-Friendly Commands**

If you're using a mobile terminal:

```bash
# Short version
git add . && git commit -m "Ready for production" && git push origin master
git checkout -b main && git push origin main && git push --set-upstream origin main
```

## 🔗 **Integration with Vercel**

After migration, update your Vercel deployment:

1. **If using GitHub integration:**
   - Vercel will automatically detect the new main branch
   - Update production branch in Vercel settings if needed

2. **If using CLI:**
   ```bash
   # Deploy from main branch
   vercel --prod
   ```

## 📋 **Pre-Migration Checklist**

- [ ] All changes committed locally
- [ ] Working directory clean (`git status`)
- [ ] Remote repository accessible
- [ ] Backup of important changes (optional)
- [ ] Team members notified (if applicable)

## 📋 **Post-Migration Checklist**

- [ ] Main branch created and pushed
- [ ] Default branch updated on GitHub/GitLab
- [ ] Vercel deployment updated
- [ ] CI/CD pipelines updated (if any)
- [ ] Documentation updated
- [ ] Team members informed

## 🎯 **Final Commands to Run**

Execute these commands in order:

```bash
# 1. Save current work
git add .
git commit -m "feat: Complete crypto tax dashboard - ready for production"
git push origin master

# 2. Create main branch
git checkout -b main
git push origin main
git push --set-upstream origin main

# 3. Verify
git branch
git log --oneline -3

echo "✅ Migration complete! Update default branch on GitHub/GitLab"
```

## 🚀 **Ready for Vercel Deployment**

After migration, your repository will be ready for Vercel deployment with:
- ✅ Clean main branch
- ✅ All latest changes
- ✅ Proper commit history
- ✅ Environment variables guide ready
- ✅ Production-ready codebase

---

**🎉 Your code will be perfectly organized on the main branch and ready for deployment!**