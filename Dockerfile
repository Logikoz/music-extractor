FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia nossa config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos do site
COPY . /usr/share/nginx/html

EXPOSE 80
