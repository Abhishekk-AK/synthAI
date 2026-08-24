FROM node

WORKDIR /app

# copy root files
COPY package*.json ./
RUN npm install

# copy services/agent files
COPY ./services/agent/package*.json ./services/agent/
RUN cd services/agent && npm install

# copy whole services/agent folder
COPY services/agent ./services/agent

# copy whole shared folder
COPY shared ./shared

WORKDIR /app/services/agent

EXPOSE 8003

CMD [ "npm","start" ]