# Khanban

The wrath of Kanban.


## Deploy To Heroku

- Fork Khanban on Github.
- Create app via the Heroku dashboard.
- Select Github as deployment method, select your fork.
- Manually deploy the master branch.
- Add a Heroku Postgres database via the Add-ons interface.
- Run migrations via Heroku CLI: `heroku run "python manage.py migrate" --app=APP_NAME`
- Load initial data via Heroku CLI: `heroku run "python manage.py loaddata initial_data" --app=APP_NAME`


## Run Development Server

- Install and start up Docker.
- Clone Khanban and `cd` into the project directory.
- Web server runs on port `8000` by default. Change in `docker-compose.yml` as needed.
- Build Docker containers: `docker-compose build`
- Run Docker containers: `docker-compose up`
- Open a new tab and run bash in the Django container: `docker exec -it khanban_web_1 bash`
- Run migrations: `python manage.py migrate`
- Load initial data: `python manage.py loaddata initial_data`


## Frontend Development

- Install [Node Version Manager](https://github.com/creationix/nvm).
- Run `nvm use` in project directory to use the correct NPM version.
- Install dependencies: `npm install`
- Compile assets for local debugging: `npm run dev`
- Compile assets for production: `npm run prod`
