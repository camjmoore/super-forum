# Order of Operations for running endpoints

## 1. REGISTER THE USER
__/register__
```
{
    "email": "test@test.com",
    "userName": "testingUser",
    "password": "Test123!@#"
}
```


## 2. LOGIN
__/login__
```
{
    "userName": "testingUser",
    "password": "Test123!@#"
}
```


## 3. RUN SCRIPT TO CONFIRM THE USER
run `npm run db:confirmuser`


## 4. CREATE A THREAD
__/createthread__
```
{
    "categoryId": "1",
    "title": "Title of our first thread",
    "body": "content body for the first thread we created"
}
```


## 5. RUN SCRIPT TO INSERT SOME FILLER CATEGORIES
run `npm run db:addcategories`


## 6. REQUEST A THREAD BY CATEGORY ID
__/categorythreads__
```
{
    "categoryId": 1
}
```
