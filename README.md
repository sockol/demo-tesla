<p align="center">
  <img alt="Tesla Demo" src="https://www.tesla.com/themes/custom/tesla_frontend/assets/favicons/favicon.ico" width="60" /> 
</p>
<h1 align="center">
  Tesla Demo
</h1>


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
    ├── client
    ├── db
    ├── docker-compose.yml 
    └── README.md

  1.  **`/api`**: Graphql api for front end. Uses CMS as backend.
  2.  **`/client`**: Frontend site. Uses API as backend.
  3.  **`/db`**: Pg runs here 
  4.  **`/docker-compose.yml`**: Container configs
