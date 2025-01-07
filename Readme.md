//To Generate JWT_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
