<p align="center">
  <a href="https://orchard-navigator.w3bmix.ibm.com/">
    <img alt="IBM GBS orchard [CMS]" src="https://orchard-navigator.w3bmix.ibm.com/static/favicon.png" width="60" />
  </a>
</p>
<h1 align="center">
  IBM GBS orchard
</h1>


## Links 

[Client](localhost:7000)
[API](localhost:7001/graphql)
[DB GUI](localhost:7036)
[DB Postgress](postgresql://user:password@localhost:5436/orchard)

## 🚀 Quick start

1.  **Clone repos.**

    ```sh 
    git clone https://github.ibm.com/GBS-Offerings/orchard
    cd ./orchard
    git clone https://github.ibm.com/GBS-Offerings/orchard-api
    git clone https://github.ibm.com/GBS-Offerings/orchard-client
    ```

2.  **Install dependencies.**

    [Get Docker](https://www.docker.com/products/docker-desktop)
 
3.  **Install containers.**

    ```sh 
    docker-compose build && docker-compose up -d
    ```


## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── orchard-api
    ├── orchard-client
    ├── orchard-db
    ├── docker-compose.yml 
    └── README.md

  1.  **`/orchard-api`**: Graphql api for front end. Uses CMS as backend.
  2.  **`/orchard-client`**: Frontend site. Uses API as backend.
  3.  **`/orchard-db`**: Pg runs here 
  4.  **`/docker-compose.yml`**: Container configs


## 💫 Database

Uses Postgres, refer to [this](https://github.ibm.com/GBS-Design/onboarding-dev/blob/master/docs/databases.md#postgres) for a good GUI for it
