FROM node

WORKDIR /app

# copy root files
COPY package*.json ./
RUN npm install

# copy gateway files
COPY ./gateway/package*.json ./gateway/
RUN cd gateway && npm install

# copy whole gateway folder
COPY gateway ./gateway

# copy whole shared folder
COPY shared ./shared

WORKDIR /app/gateway

EXPOSE 8000

CMD [ "npm","start" ]
# or CMD [ "node index.js" ]

# build command
# we will build from root to access shared folder
# docker build -f ./gateway/Dockerfile -t gateway .
# docker build -f ./gateway/Dockerfile(path to Dockerfile from root) -t(tag->to give imageName) gateway(imageName) .(root)

# command to check image container run on command prompt
# docker run -it -p 8000:8000 gateway