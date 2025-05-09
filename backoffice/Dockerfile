FROM node:24-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ARG feedback_email_addresses
ENV REACT_APP_FEEDBACK_EMAIL_ADDRESSES=$feedback_email_addresses

ARG mui_pro_license_key
ENV REACT_APP_MUI_PRO_LICENSE_KEY=$mui_pro_license_key

COPY . ./
RUN npm ci && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=6 CMD curl --fail http://localhost:80/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
