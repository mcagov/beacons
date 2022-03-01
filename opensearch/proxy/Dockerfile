# A proxy to securely forward traffic from client applications, authenticated via Azure Active Directory, to OpenSearch,
# authenticated by a username and password set in OpenSearch
FROM nginx:1.21.6

# jq package necessary for creating JSON request bodies in create-opensearch-user.sh
RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y jq

COPY ./*.sh /docker-entrypoint.d
COPY ./default.conf /etc/nginx/templates/default.conf.template