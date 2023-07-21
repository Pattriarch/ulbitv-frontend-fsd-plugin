/**
 * @fileoverview Сhecks that overlying and adjacent layers are not in underlying layers
 * @author pattriarch
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports-validator"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const aliasOptions = [
  {
    alias: '@'
  }
]

const aliasOptionsWithIgnoredProvider = [
  {
    alias: '@',
    ignoreImportPatterns: ['**/StoreProvider']
  }
]

const ruleTester = new RuleTester({
  parserOptions: {ecmaVersion: 6, sourceType: 'module'}
});
ruleTester.run("layer-imports-validator", rule, {
  valid: [
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/shared/Button'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\features\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Button'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\widgets\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Button'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\widgets\\Article',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Button'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\widgets\\Article',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: aliasOptionsWithIgnoredProvider
    }
  ],

  invalid: [
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Button'",
      errors: [{ message: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages)' }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\features\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Button'",
      errors: [{ message: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages)' }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\entities\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Button'",
      errors: [{ message: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages)' }],
      options: aliasOptions
    },
    {
      filename: 'C:\\Users\\pattriarch\\Desktop\\ulbitv-frontend\\src\\widgets\\Article.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/app/Button'",
      errors: [{ message: 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages)' }],
      options: aliasOptions
    }
  ],
});
