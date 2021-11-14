# Vending Machine task

This project aims to build a Vending machine where a user can buy products and sellers can add products and gain money from sells.

## Project Setup 

### First run this command to run database
```
    sudo docker-compose up -d
```

### To run the server
```
    npm start
```

### To run tests 
```
    npm test
```

## API Routes

### Register Route
```
    Route : /api/user/login
    Method : POST
    Body : {username, password, role}  // role = SELLER or BUYER
    Response :
        201 success : {user, token}
        400 Fail : wrong format
        500 Fail : Internal server Error
```

### Login Route
```
    Route : /api/user/login
    Method : POST
    Body : {username, password}
    Response :
        200 success : {client, accesstoken, refreshtoken}
        400 Fail : wrong credentials
```

### Get User Route
```
    Route : /api/user/
    Method : GET
    Headers : {token}
    Response :
        200 success : { user}
        401 Fail : Authentication error
        500 Fail : Internal server Error
```

### Update User Route
```
    Route : /api/user/
    Method : PUT
    Headers : {token}
    Body : {username?, password?}
    Response :
        200 success: Success
        401 Fail : Authentication error
        500 Fail : Internal server Error
```

### Delete User Route
```
    Route : /api/user/
    Method : DELETE
    Headers : {token}
    Response :
        200 success: {Success, ReturnedMoney}
        401 Fail : Authentication error
        500 Fail : Internal server Error
```


### Deposit Route
```
    Route : /api/user/deposit
    Method : POST
    Header : {token}
    Body : {deposit} [] array of 5 numbers
    Response :
        200 success: Success
        401 Fail : Authentication error
        500 Fail : Internal server Error
```


### Buy Route
```
    Route : /api/user/buy
    Method : POST
    Header : {token}
    Body : {productId, amount}
    Response :
        200 success: {Success, product, change}
        400 Fail : Can not purchase this product
        401 Fail : Authentication error
        500 Fail : Internal server Error
```

### Reset Route
```
    Route : /api/user/reset
    Method : GET
    Header : {token}
    Response :
        200 success: {Success, change}
        401 Fail : Authentication error
        500 Fail : Internal server Error
```


### GET Product
```
    Route : /api/product/:id
    Method : GET
    Response :
        200 success: {Success, product}
        500 Fail : Internal server Error
```

### GET Products
``` 
    Route : /api/product/viewAll/:page     // page used for pagination every page 10 products
    Method : GET
    Response :
        200 success: {Success, products}
        500 Fail : Internal server Error
```


### Post product
```
    Route : /api/product/
    Method : POST
    Header : {token} // has to be a seller
    Body : {name, cost, stock}
    Response :
        201 success: {Success, product}
        400 Fail : format error
        401 Fail : Authentication error
        500 Fail : Internal server Error
```

### Update product
```
    Route : /api/product/:id
    Method : PUT
    Header : {token} // has to be the same seller
    Body : {name?, cost?, stock?}
    Response :
        201 success: {Success, product}
        400 Fail : format error
        401 Fail : Authentication error
        500 Fail : Internal server Error
```

### Delete product
```
    Route : /api/product/:id
    Method : DELETE
    Header : {token} // has to be the same seller
    Response :
        200 success: {Success}
        401 Fail : Authentication error
        500 Fail : Internal server Error
```


    