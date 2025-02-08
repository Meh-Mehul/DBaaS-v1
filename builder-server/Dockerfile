## This File is used to create mongo-worker-node image (for one time use only)
FROM mongo:latest
ENV MONGO_INITDB_ROOT_USERNAME=guddb
ENV MONGO_INITDB_ROOT_PASSWORD=gudig
ENV MONGO_INITDB_DATABASE=db1
EXPOSE 27017
CMD ["mongod", "--bind_ip_all"]
