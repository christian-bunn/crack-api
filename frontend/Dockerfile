FROM alpine:3.20.2 AS base
RUN apk add --no-cache gcc musl-dev perl git linux-headers make

FROM base AS build
RUN git clone https://github.com/mirror/busybox.git
WORKDIR /busybox
COPY busybox-httpd-config .config
RUN make -j && make -j install && adduser -D static
RUN ls -R /busybox/_install/ && ls -R /busybox

FROM alpine:3.20.2 AS final
COPY --from=build /busybox/_install/bin/busybox /bin/busybox
COPY --from=build /etc/passwd /etc/passwd
COPY httpd.conf /httpd.conf
COPY ./http /home/static
CMD ["/bin/busybox", "httpd", "-p", "80", "-v", "-f", "httpd.conf"]
EXPOSE 80
USER static