/**
 * @fileoverview Validates that path works as described in FSD
 * @author Daniil
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-validator"),
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

ruleTester.run("path-validator", rule, {
  valid: [
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительны" }],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from 'entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительны" }],
      output: "import { addCommentFormActions, addCommentFormReducer } from './Article/model/slices/addCommentFormSlice'"
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительны" }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from './Article/model/slices/addCommentFormSlice'"
    },
    {
      filename: 'C:\\Users\\Pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article\\ui\\ArticleDetails\\ArticleDetails.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slice/articleDetailsSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительны" }],
      options: aliasOptions,
      output: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slice/articleDetailsSlice'"
    },
  ],
});
