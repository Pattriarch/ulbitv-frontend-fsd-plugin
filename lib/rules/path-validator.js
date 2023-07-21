/**
 * @fileoverview Validates that path works as described in FSD
 * @author Daniil
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const path = require('path');
const { isPathRelative } = require('../helpers');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: "Validates that path works as described in FSD",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias ?? ''
    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example /Users/daniilpereverzev/ulbitv-frontend-eslint-plugin/lib/rules/path-validator.js
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'В рамках одного слайса все пути должны быть относительны');
        }
      }
    };
  },
};

const layers = {
  'pages': 'pages',
  'widgets': 'widgets',
  'features': 'features',
  'entities': 'entities',
  'shared': 'shared',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  // example app/entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split('src')[1];
  const fromArray = projectFrom.split(/\\|\//)

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}

// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'entities/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'entities/ASdasd/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article', 'features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'app/index.tsx'))
// console.log(shouldBeRelative('C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/entities/Article', 'entities/Article/asfasf/asfasf'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', '../../model/selectors/getSidebarItems'))
// console.log(shouldBeRelative('/Users/daniilpereverzev/now/ulbitv-frontend/src/entities/Article', 'entities/Article/getArticle'))
