import { traceFunc } from "@polywrap/registry-core-js";

export class SchemaComparisonService {
  @traceFunc("schema-comparison-service:are_schemas_functionally_identical")
  areSchemasFunctionallyIdentical(schemaA: string, schemaB: string): boolean {
    return schemaA === schemaB;
  }

  @traceFunc("schema-comparison-service:are_schemas_bacward_compatible")
  areSchemasBacwardCompatible(
    baseSchema: string,
    derivedSchema: string
  ): boolean {
    return true;
  }
}
