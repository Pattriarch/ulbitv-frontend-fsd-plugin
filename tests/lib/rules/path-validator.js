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
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/model/slices/addCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительны" }],
      options: aliasOptions
    },
  ],
});
