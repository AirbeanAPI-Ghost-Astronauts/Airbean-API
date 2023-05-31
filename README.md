# Airbean API

RESTful API for AirBean application. It provides endpoints to create users,check the menu and order from the menu.

## Developers

- [Shahin](https://www.github.com/shahfarzane)
- [Freija](https://www.github.com/FreijaL)
- [Linda](https://www.github.com/lindakahju)

## Installation

Install Airbean-api with npm

```bash
  npm install

```

## Run Locally

Start the server

```bash
  npm run dev
```

## Tech Stack

**Server:** Node, Express , MongoDB, Bcrypt, Moment , Nodemon

## Endpoints

List of available Endpoints :

**GET "/api/beans/"** : to load the menu

![resonse example](https://raw.githubusercontent.com/AirbeanAPI-Ghost-Astronauts/Airbean-API/main/screenshots/screenshot1.png)

**POST "/api/user/signup"** :

#### to signup in the app

#### example body object

```http

  {
	"email": "name@email.com",
	"password": "1234"
}

```

| Parameter  | Type     | Description   |
| :--------- | :------- | :------------ |
| `email`    | `string` | **Required**. |
| `password` | `string` | **Required**. |

**POST "/api/user/login"** :

to login in the app

#### example body object

```http

  {
	"email": "name@email.com",
	"password": "1234"
}

```

**POST "/api/beans/orders"** : To create a new order in the app.

If you wanna create an order as a registered user , you need to add the userId from MongoDbs database.

| Parameter  | Type     | Description                          |
| :--------- | :------- | :----------------------------------- |
| `userId`   | `string` | **Required**. Users ID               |
| `id`       | `string` | **Required**. Items ID from the menu |
| `quantity` | `number` | **Required**.                        |

for example :

```bash

{
  "userId": "6477483c98f2ef34a36b755c",
  "cart": [
    {
      "id": "6475a8dbbe0c82ff4cf1fc34",
      "quantity": 1

    },
       {
      "id": "6475a8dbbe0c82ff4cf1fc35",
      "quantity": 2

    }
  ]
}

```

if you want to create a new order as a guest you need to have :

| Parameter    | Type     | Description                            |
| :----------- | :------- | :------------------------------------- |
| `guestEmail` | `string` | **Required**. Add an email to checkout |
| `id`         | `string` | **Required**. Items ID from the menu   |
| `quantity`   | `number` | **Required**.                          |

```bash

{
 "guestEmail": "guest@email.com",
"cart": [
    {
      "id": "6475a8dbbe0c82ff4cf1fc30",
      "quantity": 2

    },
		  {
      "id": "6475a8dbbe0c82ff4cf1fc31",
      "quantity": 5

    }
  ]
}

```

**GET "/api/user/${id}/history"** :
to check the orders history you can use this method. You need to add the users id from Mongos database.

example url :

```bash
http://localhost:5000/api/user/6477483c98f2ef34a36b755c/history/

```

**GET /api/user/status/:id"** : To check your orders status you can use this route.

Each coffees delivery time is 10 minutes , so this route compares the current time with estimated delivery time and shows if the order has been deliverd or still ongoing.

![resonse example](https://raw.githubusercontent.com/AirbeanAPI-Ghost-Astronauts/Airbean-API/main/screenshots/screenshot1.png)
