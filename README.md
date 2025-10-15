## Node.js, Express, MongoDB Course

### Deleting and reuploading DB data
1. Move to directory: ```cd .\dev-data\data```
2. Delete MongoDB data: ```node import-dev-data.js --delete```
3. Comment the following pre-save middleware in ```\models\userModel.js```:

   ```javascript
   userSchema.pre('save', async function (next) {
     if (!this.isModified('password')) return next();
     this.password = await bcrypt.hash(this.password, 12);
     this.passwordConfirm = undefined;
     next();
   });
   ```

5. Reuploading data: ```node import-dev-data.js --import```
6. Remove comments so encryption works normally again when signing up as a new user.
7. Check with MongoDB Compass just to make sure: Ctrl + R for a refresh.
