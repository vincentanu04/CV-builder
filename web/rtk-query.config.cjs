/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
const config = {
  schemaFile: '../server/api/openapi.yml',
  apiFile: './src/store/api.ts',
  apiImport: 'baseApi',
  outputFile: './src/api/client.ts',
  exportName: 'api',
  hooks: true,
  tag: true,
};

module.exports = config;
