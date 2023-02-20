

# Welcome to the NodeJS Menus API

## Intro:

This application was made with the goal to improve my skills about Swagger documentation, I spent a lot of time with the official and libraries documentation. For this project I used this collection of libraries:

> "ajv": "^8.12.0", *Checking an object to a json Schema*
> "bcrypt": "^5.1.0", *Hasching password*
> "body-parser": "^1.20.1", *To parse body application*
> "cors": "^2.8.5", *Allow external request*
> "dotenv": "^16.0.3", *To import environment variables*
> "express": "^4.18.2", *Base NodeJS router*
> "firebase-admin": "^11.5.0", *To make request to my Firebase database*
> "helmet": "^6.0.1", *Security library for headers*
> "jsonwebtoken": "^9.0.0", *Security to get informations about the user*
> "morgan": "^1.10.0", *Security library to get a log of each request*
> "swagger-autogen": "^2.23.1", *Library who parse our application for the documentation*
> "swagger-ui-express": "^4.6.0" *Library to serve the swagger interface*

## Main direction:

 1. /register `POST`
 2. /login`POST`
 3. /me `GET`
 4. /menus `GET`
 5. /menus/:menuId `GET`
 6. /createmenu `POST`
 7. /deletemenu `DELETE`
 8. /updatemenu `PUT`

## Authorization:
To authorize our application request you'll need a JWT, to get this one, you'll have to register and log with your account (/register and /login are the only one who don't need token).
To put the token, you'll have to click on the lock on the top right of the application or on a tab who need it.
When you've clicked on it your must put your bearer token like this example:

    bearer YOUR_TOKEN
If you don't do this, you'll return a 401 unauthorize.
**Don't put your token on the input authorization after opening a tab, it don't work!**

## Specials thanks:
I want to say thank you to my teacher, M. Diarra who teach us a bit about swagger, but a lesson is never enough, that cost me to spent a lot of time on documentation because I get a lot of mistakes. But it made me a good "veille".

To deploy my application, I putted it in https://render.com . You can deploy for free a small application on it, no credit card needed and deploy your application each commit you do. I really appreciate their interface wich is very intuitive.

Thanks for the reading!
