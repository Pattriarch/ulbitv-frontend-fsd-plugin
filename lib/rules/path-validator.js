/**
 * @fileoverview Validates that path works as described in FSD
 * @author Daniil
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
            description: "Validates that path works as described in FSD",
            recommended: false,
            url: null,
        },
        fixable: 'code',
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
                try {
                    const value = node.source.value;
                    const importTo = alias ? value.replace(`${alias}/`, '') : value;

                    // example /Users/daniilpereverzev/ulbitv-frontend-eslint-plugin/lib/rules/path-validator.js
                    const fromFilename = context.getFilename();

                    if (shouldBeRelative(fromFilename, importTo)) {
                        context.report({
                            node,
                            message: 'В рамках одного слайса все пути должны быть относительны',
                            fix: (fixer) => {
                                // /entities/Article/Article.tsx (сюда мы делаем импорт).
                                // Избавляемся от названия файла и получаем путь к директории
                                const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
                                    .split(/\\|\//)
                                    .slice(0, -1)
                                    .join('/');
                                // нормализованный путь начинается со /, а импорт начинается с названия модуля, поэтому добавляем слэш в начало
                                let relativePath = path.relative(normalizedPath, `/${importTo}`)
                                    .split(/\\|\//)
                                    .join('/');
                                // Если путь не начинается с точки, то добавляем ./ в начало
                                if (!relativePath.startsWith('.')) {
                                    relativePath = './' + relativePath;
                                }

                                return fixer.replaceText(node.source, `'${relativePath}'`);
                            }
                        })
                    }
                } catch (e) {
                    // ignored
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

function getNormalizedCurrentFilePath(currentFilePath) {
    const normalizedPath = path?.toNamespacedPath(currentFilePath);
    const projectFrom = normalizedPath?.split('src')[1];
    return projectFrom.split(/\\|\//).join('/');
}


function shouldBeRelative(from, to) {
    if (isPathRelative(to)) {
        return false;
    }

    // example app/entities/Article
    const toArray = to.split(/\\|\//)
    const toLayer = toArray[0]; // entities
    const toSlice = toArray[1]; // Article

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }

    const projectFrom = getNormalizedCurrentFilePath(from);
    const fromArray = projectFrom?.split(/\\|\//)

    const fromLayer = fromArray?.[1];
    const fromSlice = fromArray?.[2];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }

    return fromSlice === toSlice && toLayer === fromLayer;
}
