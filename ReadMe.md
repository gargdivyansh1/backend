# learning about the backend service

# bcrypt is used for hashing the password 
# storing the password in the encrypted form so that it could not be accessed directly in the string form

# jsonwebtoken for making the tokens 

# there are basically two kinds of tokens 

<!-- one is refresh token 
and other is access token 

// there is the only difference in the time they are lived 
means the access tokens are for the short period of time and after that they expires 
the refresh token are for the longer period of time and they do not expire soon 
we can use the refresh token for the validation like 
if the refresh token of the user and the saved in the database is same then the user doesnt have to login again and again 
// we will provide him the new access token each time he logined again  -->
