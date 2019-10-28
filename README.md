<p align="center">
  <img alt="Tesla Demo" src="https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon.ico" width="60" /> 
</p>
<h1 align="center">
  Tesla Demo
</h1>

Load a WebGL canvas with Mars in it, place Tesla images around it. 
Car colors will update every .5s, color titles and locations can be updated by the user.
Car attributes are broadcast over a websocket connection, so changes from userA will propagate to userB.

## Links 

  1. [UI](http://localhost:80)
  2. [API](http://localhost:81)
  3. [Socket Service](http://localhost:81)
  4. [DB GUI](http://localhost:8081/)

## 🚀 Quick start

1.  **Clone repos.**

    ```sh 
    git clone https://github.com/sockol/demo-tesla
    ```

2.  **Install dependencies.**

    [Get Docker](https://www.docker.com/products/docker-desktop)
 
3.  **Install containers.**

    ```sh 
    docker-compose build && docker-compose up
    ```
4.  **Install containers.**

    Wait for a success message for localhost:80 to show up, then navigate to [here](http://localhost:80)


## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── api
    ├── socket
    ├── ui
    ├── docker-compose.yml 
    └── README.md

  1.  **`/api`**: Express & Node. REST endpoints here. 
  2.  **`/socket`**: Express & Node & SocketIO. Handles async communication
  3.  **`/ui`**: NextJS & React. All the client code is here
  4.  **`/docker-compose.yml`**: Docker & Docker Compose. All container configs are here

## Features 
1. CRUD for cars.
2. Click on a car to edit/remove.
3. "Add" will place a new car on the globe. NOTE: You can set location of your car, but the x/y coordinate values have to be between 0 and 1, so it will not be easy to place cars where you expect them to appear. Drag/Drop is not trivial when moving objects around a sphere, so that is not implemented.
4. Zoom and rotate the globe using a mouse/keyboard
5. Real time color changes, real time CRUD with WebSockets 

## Architecture 

```
            Redis
              |
         ------------
        |            |
UI --- API <......> Socket Service
|                    |
 --------------------
```

1. UI is the entry point that renders the CRUD forms and the WebGL Canvas
2. UI makes CRUD requests to API, which updates Redis
3. Socket Service emits CHANGE_COLOR events to alter car colors. It also broadcasts CRUD to other UI clients, all data changes in the UI come through sockets
4. When an API action is made, it communicates with the SocketService to emit updates to the car attributes through Redis, using it as an Event Queue. Since Redis is the central point of communication, more SocketServices can be added to support a higher load. Each one is identical, so we can load balance across them using round robin. 
5. The main UI home page consists of 2 components. The index and the CanvasController. Index handles the rendering of the main react wrapper + CRUD forms. It also hooks up to SocketIO for data transfer and loads up the initial car objects with a GET call. 
CanvasController handles the WebGL. It also stores a list of cars and their attributes. Initially it used to be a React component, and accepted a list of cars as a prop. This was more decoupled, but also slow. I had to ditch the react state and save data (title, id, longitude, latitude) directly in webgl for speed.  