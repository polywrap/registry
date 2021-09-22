import { traceFunc } from "@polywrap/registry-core-js";

export class SchemaComparisonService {
  @traceFunc("SchemaComparisonService:areSchemasFunctionallyIdentical")
  areSchemasFunctionallyIdentical(schemaA: string, schemaB: string): boolean {
    return schemaA === schemaB;
  }

  @traceFunc("SchemaComparisonService:areSchemasBacwardCompatible")
  areSchemasBacwardCompatible(
    baseSchema: string,
    derivedSchema: string
  ): boolean {
    return true;
  }
}
