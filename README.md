# Portfolio
Routes pass through vue.js routing unless specified in both server/server.js and server/routes
Also check web.config if hosted in iis

## Dev
To start, in a separate console windows:
* 'npm run dev-frontend' - for vue app and css with hot updates
* 'npm run dev-server' - for express server without compiling (navigate to http://localhost:3000))

## Production
* 'npm run prod-frontend' - for production/minified front end vue app and css
* 'npm run build-server' - for express server code compilation (no need for slow babel-node)
* 'npm run start' runs compiled express server code

## Docker

### Build and Run
* docker build -t portfolio .
* docker run -it -p 9000:3000 portfolio

### Helpful docker commands
* docker system prune --volumes
* docker image ls


