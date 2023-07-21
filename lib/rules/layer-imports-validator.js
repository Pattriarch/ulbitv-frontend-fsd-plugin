/**
 * @fileoverview Сhecks that overlying and adjacent layers are not in underlying layers
 * @author pattriarch
 */
"use strict";

const path = require("path");
const {isPathRelative} = require("../helpers");
const micromatch = require("micromatch");

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null,
    docs: {
      description: "Сhecks that overlying and adjacent layers are not in underlying layers",
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
          },
          ignoreImportPatterns: {
            type: 'array'
          }
        }
      }
    ],
  },

  create(context) {
    const layers = {
      'app': ['pages', 'widgets', 'features', 'entities', 'shared'],
      'pages': ['widgets', 'features', 'entities', 'shared'],
      'widgets': ['features', 'entities', 'shared'],
      'features': ['entities', 'shared'],
      'entities': ['entities', 'shared'],
      'shared': ['shared'],
    }

    const availableLayers = {
      'app': 'app',
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
      'shared': 'shared',
    }

    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename();

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\');

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/')

      return segments?.[0];
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(pattern => {
            return micromatch.isMatch(importPath, pattern)
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(node, 'Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages)');
        }
      }
    };
  },
};
