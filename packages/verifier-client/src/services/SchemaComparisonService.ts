export class SchemaComparisonService {
  areSchemasFunctionallyIdentical(schemaA: string, schemaB: string): boolean {
    return schemaA === schemaB;
  }

  areSchemasBacwardCompatible(
    baseSchema: string,
    derivedSchema: string
  ): boolean {
    return true;
  }
}
