import fastifyPlugin from "fastify-plugin";
import cors from "@fastify/cors";

// Para que el navegador deje al frontend (ng serve) llamar a la api
export default fastifyPlugin(async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: "http://localhost:4200",
    methods: "*",
  });
});
