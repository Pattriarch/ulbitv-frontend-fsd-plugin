/**
 * @fileoverview Check that imports come only from public api on FSD architecture
 * @author pattriarch
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-validator"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});

const aliasOptions = [
  {
    alias: '@'
  }
]

const testingAliasOptions = [
  {
    alias: '@',
    testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
  }
]

ruleTester.run("public-api-validator", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Dekstop\\ulbitv-frontend\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testingAliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Dekstop\\ulbitv-frontend\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testingAliasOptions
    },
  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/file.ts'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)" }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'"
    },
    {
      filename: 'C:\\Users\\pattriarch\\Dekstop\\ulbitv-frontend\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.ts'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)" }],
      options: testingAliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article'"
    },
    {
      filename: 'C:\\Users\\pattriarch\\Dekstop\\ulbitv-frontend\\src\\entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{ message: "Тестовые данные необходимо импортировать из publicApi/testing.ts" }],
      options: testingAliasOptions
    },
  ],
});
