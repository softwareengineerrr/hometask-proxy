INSTALLATION:
-------------

1. `npm i` - installs node packages
2. `cp .env-default .env` - copies a templated config file


DEV RUNNING:
------------

1. `npm run develop` - runs a web script in dev mode (the server will be restarted after any change in the code)


PROD BUILDING AND RUNNING:
--------------------------

1. `npm run build` - builds the typescript code into the js.
2. `npm run start` - runs a web script in prod mode 



TESTING:
--------

We use the https://jsonplaceholder.typicode.com as target resource.
You can test it using the `POSTMAN` for instance:

1. `[GET] http://localhost:3001/posts` - returns a list of posts from a proxied resource.
2. `[POST] http://localhost:3001/posts` - creates a new post. 

you should get the response from that endpoints.

FOLDERS STRUCTURE
-----------------

1. `src/interceptors` - a logic which puts cached responses into a cache from any `GET` request.
2. `src/middlewares` - a logic which checks for a cached request, and return a cached request if it exists.
3. `src/services` - keeps the logic layer, including the caching mechanism based on files.
4. `.env` - keeps list of settings which you can change, like a cache dir, ttl, source url, etc.

STRESS TESTING:
---------------

if you want to test possible race condition which might occur time to time, you can decrease the `ttl` time
in the `.env` file and run a cluster. `npm run build && node run_cluster.mjs`

then you can produce many requests using the command: `ab -n 1000 -c 10 http://localhost:3001/posts`

PS: make sure you have installed the `ab` tool 