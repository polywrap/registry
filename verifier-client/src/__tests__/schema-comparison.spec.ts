jest.setTimeout(200000);
import * as fs from 'fs';
import { areSchemasFunctionallyIdentical } from '../schema-comparison/areSchemasFunctionallyIdentical';

describe("Schema comparison", () => {
  beforeAll(async () => {
  });

  afterAll(async () => {
  });

  const dirs = fs.readdirSync(`${__dirname}/schemas/is-patch`);

  for (const dir of dirs) {

    it(`can compare patch versions - ${dir}`, () => {
      const patchSchemaFiles = fs.readdirSync(`${__dirname}/schemas/is-patch/${dir}`);

      const patchSchemas = patchSchemaFiles.map((file, i) => {
        return {
          index: i,
          file: file,
          schema: fs.readFileSync(`${__dirname}/schemas/is-patch/${dir}/${file}`, 'utf-8')
        }
      });

      for (let i = 0; i < patchSchemas.length; i++) {
        const schema1 = patchSchemas[i].schema;

        for (let j = 0; j < patchSchemas.length; j++) {
          if (i === j) {
            continue;
          }

          const schema2 = patchSchemas[j].schema;

          expect(areSchemasFunctionallyIdentical(schema1, schema2)).toBeTruthy();
        }
      }
    });
  }
});
