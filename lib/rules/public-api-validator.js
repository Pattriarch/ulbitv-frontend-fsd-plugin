/**
 * @fileoverview Check that imports come only from public api on FSD architecture
 * @author pattriarch
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null,
        docs: {
            description: "Check that imports come only from public api on FSD architecture",
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
                    testFilesPatterns: {
                        type: 'array'
                    }
                }
            }
        ],
    },

    create(context) {
        const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

        const allowedLayers = {
            'pages': 'pages',
            'widgets': 'widgets',
            'features': 'features',
            'entities': 'entities',
        };

        return {
            ImportDeclaration(node) {
                // example app/entities/Article
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, '') : value;

                if (isPathRelative(importTo)) {
                    return;
                }

                // [entities, article, model, types]
                const segments = importTo.split('/')
                const layer = segments[0];

                if (!allowedLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = segments.length > 2;
                // [entities, article, model, types]
                // сегментов должно быть 3
                const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)');
                }

                if (isTestingPublicApi) {
                    const currentFilePath = context.getFilename();

                    const isCurrentFileTesting = testFilesPatterns.some(
                        pattern => micromatch.isMatch(currentFilePath, pattern)
                    )

                    if (!isCurrentFileTesting) {
                        context.report(node, 'Тестовые данные необходимо импортировать из publicApi/testing.ts');
                    }
                }
            }
        };
    },
};
