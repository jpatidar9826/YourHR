This is backend for YourHR React SPA

Backend provides 4 routes, 2 middlewares

Middlewares contiains

 1. Auth - which is to check Bearer token and retrieve userId from it
 2. File-Upload - is used to store file using multer

Routes contain
 
 1. Signup - POST - This route uses file upload middleware for resume pdf uploading and then check for if another user exist with same emailId. If true, then send error, else upload the user_name, email, hashed password using the Bcrypt and file path for resume to mongodb database. After this it will generate the Bearer Token and then send it in response which will exist for 1 hour.

 2. Login - POST - This route will fisrt check for user exist with emailID and then match the password using bcrypt with it . If match , it will generate the Bearer Token and then send it in response which will exist for 1 hour else , send error in response.

 3. GetUserByID - GET - This route uses the Auth Middlerware to check user has a bearer token and then in response it will send user from database whose id matches with it (except password).

 4. GetPdf - GET - This route uses the Auth Middlerware to check user has a bearer token and then in response it will send user_resume pdf file from uploads folder in response. 

 All this routes uses express validator for validation.