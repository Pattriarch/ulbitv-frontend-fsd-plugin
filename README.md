# eslint-plugin-ulbitv-fsd

Plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-ulbitv-fsd`:

```sh
npm install eslint-plugin-ulbitv-fsd --save-dev
```

## Usage

Add `ulbitv-fsd` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "ulbitv-fsd"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "ulbitv-fsd/rule-name": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

| Name                                                       | Description                                                      |
| :--------------------------------------------------------- | :--------------------------------------------------------------- |
| [path-validator](docs/rules/path-validator.md)             | Validates that path works as described in FSD                    |
| [public-api-validator](docs/rules/public-api-validator.md) | Check that imports come only from public api on FSD architecture |

<!-- end auto-generated rules list -->


