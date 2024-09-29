FROM pierrezemb/gostatic
COPY ./http /srv/http
CMD ["-port", "80", "-enable-health", "-fallback", "/index.html", "-enable-logging"]