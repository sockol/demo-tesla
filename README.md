<p align="center">
  <img alt="Tesla Demo" src="https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon.ico" width="60" /> 
</p>
<h1 align="center">
  Tesla Demo
</h1>

So this was an interesting experiment.
This app will load a WebGL canvas with Mars in it, place Tesla images around it.
Car colors will update every .5s, color titles and locations can be updated by the user.
Car attributes are broadcast over a load balanced set of websocket services, so changes from userA will propagate to userB. Web sockets are synchronized over Redis, so separate Socket nodes stay in sync. 

## Links 

  1. [UI](http://localhost:80)
  2. [API](http://localhost:81)
  3. [Socket Service Proxy](http://localhost:82)
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
    // spin up all services, make 2 instances of the web socket service for scale
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
1. Add/Update/Delete Config. Use the form & click on a car to edit/delete
2. View streaming data. Car colors will change every .5s

## Components
1. Uses MaterialUI for the front end 
2. Nodejs/Express backend 
3. Redis for data store 

## Bonus
1. Docker for infrastructure
2. Can set the car location using the react form 
3. WebGL rendering of the map 
4. A push notification will show if you add more than MARKER_LIMIT=10 markers

## Notes
1. "Add" will place a new car on the globe. NOTE: You can set the location of your car, but the x/y coordinate values have to be between 0 and 1, so it will not be easy to place cars where you expect them to appear. Drag/Drop is not trivial when moving objects around a sphere, so that is not implemented.
2. Zoom and rotate the globe using a mouse/keyboard
3. Edit the `SEED_DB=true` variable and restart the `api` app to seed demo data in. 

## Architecture 

```
            Redis
              |
         ------------
        |            |
UI --- API <......>   Nginx --> [Socket Service, Socket Service]
|                    |
 --------------------
```

1. UI is the entry point that renders the CRUD forms and the WebGL Canvas. API and Sockets have CORS enabled, so only localhost:80 is allowed to make requests
2. UI makes CRUD requests to API, which updates Redis
3. Socket Service emits CHANGE_COLOR events to alter car colors. It also broadcasts CRUD to other UI clients, all data changes in the UI come through sockets
4. When an API action is made, it communicates with the SocketService to emit updates to the car attributes through Redis, using the Pub/Sub pattern. Since Redis is the central point of communication, more SocketServices can be added to support a higher load (currently there are 2). Each one is identical, so we can load balance across them using Nginx & Load Balance by IP. When a new CRUD operation is performed, API publishes an event with Redis. All socket service instances listen to these events and issue updates to their respective clients. 
5. The main UI home page consists of 2 components. The index and the CanvasController. Index handles the rendering of the main react wrapper + CRUD forms. It also hooks up to SocketIO for data transfer and loads up the initial car objects with a GET call. 
CanvasController handles the WebGL. It also stores a list of cars and their attributes. Initially it used to be a React component, and accepted a list of cars as a prop. This was more decoupled, but also slow. I had to ditch the react state and save data (title, id, longitude, latitude) directly in webgl for speed.  

## Considerations

1. This is a demo app. So I am running each environment in dev mode. 
2. docker-compose provides a scale=N option which lets you spin up N services. But load balancing across them with Nginx and making sure that sessions are sticky is more complicated than I thought. So for the purposes of this demo, there are 2 Socket Instances. 
3. The main home page could be split out into separate components, given more time. 
4. Drag and drop for cars was not implemented. It is not trivial to drag elements while restricting them to a sphere