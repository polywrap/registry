import { Tracer } from "@web3api/tracing-js";

export * from "@web3api/tracing-js";

export function traceFunc(name: string) {
  return function (
    target: unknown,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      Tracer.startSpan(name);
      const result = original.apply(this, args);
      Tracer.endSpan();
      return result;
    };

    return descriptor;
  };
}
