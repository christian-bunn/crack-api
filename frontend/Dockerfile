FROM pierrezemb/gostatic
COPY ./http /srv/http
CMD ["-port", "8080", "-enable-health", "-fallback", "/index.html", "-enable-logging"]