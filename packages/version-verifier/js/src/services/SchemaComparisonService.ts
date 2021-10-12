import { traceFunc } from "@polywrap/registry-core-js";

export class SchemaComparisonService {
  @traceFunc("schema-comparison-service:are_schemas_functionally_identical")
  areSchemasFunctionallyIdentical(
    schemaA: string | undefined,
    schemaB: string | undefined
  ): boolean {
    return schemaA !== undefined && schemaB !== undefined
      ? schemaA === schemaB
      : false;
  }

  @traceFunc("schema-comparison-service:are_schemas_bacward_compatible")
  areSchemasBacwardCompatible(
    baseSchema: string | undefined,
    derivedSchema: string | undefined
  ): boolean {
    return baseSchema !== undefined && derivedSchema !== undefined;
  }
}
