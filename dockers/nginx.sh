#link all file in sites-available folder to sites-enabled folder
# https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04
#!/bin/bash
search_dir=/etc/nginx/sites-available
for entry in "$search_dir"/*
do
    ln -s $entry /etc/nginx/sites-enabled/
done
nginx -g "daemon off;"
