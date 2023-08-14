FROM nginx:1.17.5-alpine
LABEL MAINTAINER="guofangchao"

ENV RUN_GROUP nginx
ENV DATA_DIR /home/dist

# 复制源码到容器的/home目录
COPY ./dist /home/dist
COPY ./docker/nginx/conf.d /etc/nginx/conf.d

# 指定执行的工作目录
WORKDIR /home/dist

EXPOSE 8082

#CMD 运行以下命令
CMD ["nginx", "-g", "daemon off;"]
