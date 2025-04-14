FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package* ./

COPY prisma ./prisma

RUN npm install
RUN npm install typescript --save-dev

RUN openssl genpkey -algorithm RSA -out /app/private.key -pkeyopt rsa_keygen_bits:2048

RUN openssl rsa -pubout -in /app/private.key -out /app/public.key

COPY . .

RUN npx prisma generate

RUN npm run build


EXPOSE 3000

CMD [ "node","dist/index.js" ]