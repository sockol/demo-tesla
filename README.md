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

[UI](localhost:80)

[API](localhost:81)

[Socket Service](localhost:81)

[DB GUI](http://localhost:8081/)

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

    Wait for a success message for localhost:80 to show up, then navigate to [here](localhost:80)


## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── api
    ├── socket
    ├── ui
    ├── docker-compose.yml 
    └── README.md

  1.  **`/api`**: REST endpoints here
  2.  **`/socket`**: Handles async communication
  3.  **`/ui`**: All the client code is here
  4.  **`/docker-compose.yml`**: Container configs

## Architecture 

            Redis
              |
         ------------
        |            |
UI --- API <......> Socket Service
|                    |
 --------------------

1. UI is the entry point that renders the CRUD forms and the WebGL Canvas
2. UI makes CRUD requests to API, which updates Redis
3. Socket Service emits CHANGE_COLOR events to alter car colors. It also syncs other UI clients 
4. When an API action is made, it communicates with the SocketService to emit updates to the car attributes through Redis, using it as an Event Queue. Since Redis is the central point of communication, more SocketServices can be added to support a higher load. Each one is identical, so we can load balance across them using round robin. 