import { trace, propagation, context } from "npm:@opentelemetry/api@1.9.0";
const tracer = trace.getTracer("example-tracer");

Deno.serve(async (req) => {
  console.log("Received request for", req.url);

  // Call internal function
  await doWork();

  // Call external api with fetch
  const output = {};
  propagation.inject(context.active(), output);
  const { traceparent, tracestate } = output;
  const response = await fetch("http://service2:8000",
    { headers: { "x-b3-traceid": traceparent, "x-b3-tracestate": tracestate } }
  );
  const body = new Uint8Array(await response.arrayBuffer());

  if (!response.ok) {
    return new Response("Error fetching data", { status: response.status });
  }
  const text = new TextDecoder().decode(body);
  return new Response("Hello world deno" + text);
});

// Internal function with custom trace span
async function doWork() {
  return tracer.startActiveSpan("doWork", async (span) => {
    span.setAttribute("key", "value");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    span.end();
  });
}
