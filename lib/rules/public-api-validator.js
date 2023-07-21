/**
 * @fileoverview Check that imports come only from public api on FSD architecture
 * @author pattriarch
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const path = require('path');
const {isPathRelative} = require('../helpers');

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
                    }
                }
            }
        ],
    },

    create(context) {
        const alias = context.options[0]?.alias ?? '';

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

                if (isImportNotFromPublicApi) {
                    context.report(node, 'Абсолютный импорт разрешен только из Public API (index.ts)');
                }
            }
        };
    },
};
