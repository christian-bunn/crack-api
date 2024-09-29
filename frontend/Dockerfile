FROM pierrezemb/gostatic
COPY ./http /srv/http
CMD ["-port", "80", "-enable-health", "-fallback", "/login.html", "-enable-logging"]