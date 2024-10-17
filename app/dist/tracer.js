'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupTracing = void 0;
const opentelemetry = require('@opentelemetry/api');
// Not functionally required but gives some insight what happens behind the scenes
const { diag, DiagConsoleLogger, DiagLogLevel } = opentelemetry;
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
const instrumentation_1 = require("@opentelemetry/instrumentation");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const exporter_trace_otlp_proto_1 = require("@opentelemetry/exporter-trace-otlp-proto");
const exporter_zipkin_1 = require("@opentelemetry/exporter-zipkin");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const Exporter = (process.env.EXPORTER || '').toLowerCase().startsWith('z') ? exporter_zipkin_1.ZipkinExporter : exporter_trace_otlp_proto_1.OTLPTraceExporter;
const instrumentation_express_1 = require("@opentelemetry/instrumentation-express");
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const setupTracing = (serviceName) => {
    const provider = new sdk_trace_node_1.NodeTracerProvider({
        resource: new resources_1.Resource({
            [semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]: serviceName,
        }),
        sampler: filterSampler(ignoreHealthCheck, new sdk_trace_base_1.AlwaysOnSampler()),
    });
    (0, instrumentation_1.registerInstrumentations)({
        tracerProvider: provider,
        instrumentations: [
            // Express instrumentation expects HTTP layer to be instrumented
            HttpInstrumentation,
            instrumentation_express_1.ExpressInstrumentation,
        ],
    });
    const exporter = new Exporter({
        serviceName,
    });
    provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(exporter));
    // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
    provider.register();
    return opentelemetry.trace.getTracer(serviceName);
};
exports.setupTracing = setupTracing;
function filterSampler(filterFn, parent) {
    return {
        shouldSample(ctx, tid, spanName, spanKind, attr, links) {
            if (!filterFn(spanName, spanKind, attr)) {
                return { decision: opentelemetry.SamplingDecision.NOT_RECORD };
            }
            return parent.shouldSample(ctx, tid, spanName, spanKind, attr, links);
        },
        toString() {
            return `FilterSampler(${parent.toString()})`;
        }
    };
}
function ignoreHealthCheck(spanName, spanKind, attributes) {
    return spanKind !== opentelemetry.SpanKind.SERVER || attributes[semantic_conventions_1.SEMATTRS_HTTP_ROUTE] !== "/health";
}
