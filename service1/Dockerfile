FROM denoland/deno:2.2.1
WORKDIR /app
COPY . .
RUN deno cache main.ts
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--unstable-otel", "server.ts"]