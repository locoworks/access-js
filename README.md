```
yarn turbo run build --filter=@locoworks/access-sdk...
```

First Time Set Password

- password_set = false
- After login, user gets a token
- After authorize, user shouldn't be authorized till the password_set = true
- Call set password with authorize token which will work by default
- But, nothing else should work
