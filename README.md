# peg-express

[![ok-da](https://circleci.com/gh/ok-da/peg-express.svg?style=svg)](https://app.circleci.com/pipelines/github/ok-da/peg-express)
[![Maintainability](https://api.codeclimate.com/v1/badges/278c3b46670c9a82a797/maintainability)](https://codeclimate.com/github/ok-da/peg-express/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/278c3b46670c9a82a797/test_coverage)](https://codeclimate.com/github/ok-da/peg-express/test_coverage)
[![DeepScan grade](https://deepscan.io/api/teams/19126/projects/22871/branches/681480/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=19126&pid=22871&bid=681480)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/3e0ed516b42246079248870153b2817e)](https://www.codacy.com/gh/ok-da/peg-express/dashboard?utm_source=github.com&utm_medium=referral&utm_content=ok-da/peg-express&utm_campaign=Badge_Grade)

<br>
peg-express is a parser generator for TypeScript.
It applies separation of concerns: grammar definition and semantic actions are separated.
Grammar definition is written in pure Parsing Expression Grammar (PEG), and semantic actions are written in TypeScript.
Since peg-express generates support code for semantic actions, it is possible to write semantic actions with type-guided IDE support, such as code completion.

## Installation

To install peg-express, run the following command in the project directory:

```sh
$ npm install peg-express
```

## Getting Started

To use peg-express, you need to write a grammar definition and optional semantic actions.
Without semantics actions, generated parsers create a parse tree of the input.
The user can easily write their semantic actions by extending the generated parser class.

Typical steps to use peg-express are:

1. Write a grammar definition in PEG.
2. Generate a parser from the grammar definition.
3. Write semantic actions by inheriting the generated parser.
4. Use the parser.

### Step1: Write a grammar definition in PEG

peg-express uses PEG for grammar definition.
PEG is a simple and powerful grammar definition language.

You can write a grammar definition for a simple calculator as follows in `calculator.peg`:

```peg
Expression <- Term (('+' / '-') Term)*
Term       <- Factor (('*' / '/') Factor)*
Factor     <- Number / '(' Expression ')'
Number     <- r'\d+'
```

The start symbol of the grammar is `Expression`, which matches an arithmetic expression like `(1+2)*3`.
Note that you can use regular expressions in the grammar definition.
`r'\d+'` is a regular expression that matches a sequence of one or more digits.
`r` is a prefix of a regular expression literal.
You can write arbitrary JavaScript regular expressions between the prefix `r'` and `'`.

### Step2: Generate a parser from the grammar definition

To generate a parser from the grammar definition, run the following command:

```sh
peg-express <grammar>
```

`<grammar>` is a path to a grammar definition file.
The above command generates a file named 'parser.ts'.

For example, if you save the grammar definition in Step 2 as `calculator.peg`, you can generate a parser as follows:

```sh
peg-express calculator.peg
```

This generates a parser file `parser.ts` in the current directory.

### Step3: Write semantic actions by inheriting the generated parser

This step is optional.
If you do not write semantic actions, the generated parser creates a parse tree of the input.
You can write semantic actions by extending the generated parser class.

For example, if you want to evaluate the input expression, you can write semantic actions as follows:

```ts
import { Expression, Factor, Parser, Term, NodeTerminal } from './parser';

export class Calculator extends Parser {
  override Factor([number, parenthesizedExpression]: Factor) {
    if (number) {
      return number.value;
    }
    const [, expr] = parenthesizedExpression;
    return expr.value;
  }

  override Term([factor, rest]: Term) {
    return rest.reduce(
      (acc, [[mul], factor]): number =>
        mul ? acc * factor.value : acc / factor.value,
      factor.value
    );
  }

  override Expression([term, rest]: Expression) {
    return rest.reduce(
      (acc, [[add], term]): number =>
        add ? acc + term.value : acc - term.value,
      term.value
    );
  }

  override Number(node: NodeTerminal) {
    return parseInt(node.text);
  }
}
```

When you write the above code, the IDE (e.g., VSCode) can provide code completion and type-checking for semantic actions as follows:

<img src="https://github.com/ok-da/peg-express/blob/main/images/screen.gif?raw=true" width="550">

The `parser` class implements default semantic actions that you can override.

### Step4: Use the parser

You can use the generated parser by instantiating the parser class and calling `parse()` method.
If you extend the generated parser class, you need to instantiate the extended class.

For example, if you save the semantic actions above as `calculator.ts`, you can use the parser as follows:

```ts
import { Calculator } from './calculator';

const parser = new Calculator();
const result = parser.parse('(1+2)*3', 'Expression');
if (result instanceof Error) {
  console.error(result.message);
} else {
  console.log(result.value);
}
```

The output of the above program is `9`.

## PEG Syntax

A rule in PEG is defined as follows:

```peg
name <- parsing_expression
```

`name` is a rule name called a nonterminal symbol.
`parsing_expression` is a sequence of one or more parsing expressions.

`peg-express` supports the following parsing expressions:

| Expression         | Example   | Description                             |
| ------------------ | --------- | --------------------------------------- |
| wildcard           | .         | matches any character                   |
| string             | `'abc'`   | Matches the character string `abc`.     |
| regular expression | `r'abc'`  | Matches the regular expression `/abc/`. |
| nonterminal symbol | `name`    | Matches the rule `name`.                |
| ordered choice     | `e1 / e2` | Matches `e1` or `e1`.                   |
| sequence           | `e1 e2`   | Matches `e1` and `e2`.                  |
| zero or more       | `e*`      | Matches zero or more `e`.               |
| one or more        | `e+`      | Matches one or more `e`.                |
| optional           | `e?`      | Matches `e` or nothing.                 |
| grouping           | `(e)`     | Matches `e`.                            |
| and predicate      | `&e`      | Matches if `e` matches.                 |
| not predicate      | `!e`      | Matches if `e` does not match.          |

## Generating a Parser

Generated parsers consist of the following two files:

- `parser.ts`: The generated parser class.
- `SemanticValue.ts`: The types of semantic values for each node in the parse tree.

### Parser Class `parser.ts`

`peg-express` generates a parser class from a grammar definition.
The generated parser implements default semantic actions that you can override.
A semantic action is a method that is called when a node in the parse tree is matched.
The name of the semantic action is the same as the name of the node in the parse tree.
In other words, the name of the semantic action is the same as the name of the rule in the grammar definition.
The return value of the semantic action is the semantic value of the node in the parse tree.
The parameter of the semantic action is a collection of placeholders, each of which holds the semantic value of a child node in the parse tree.
Its type depends on the right-hand side of the rule in the grammar definition.
For example, if the right-hand side of the rule is `A B` where `A` and `B` are nonterminal symbols, the parameter of the semantic action is `[item0, item1]: [Value<SemanticValue.A>, Value<SemanticValue.B>]`.
The type of each parsing expression is defined as follows:

| Expression         | Example   | Type                                                 |
| ------------------ | --------- | ---------------------------------------------------- |
| wildcard           | .         | `NodeTerminal`                                       |
| string             | `'abc'`   | `NodeTerminal`                                       |
| regular expression | `r'abc'`  | `NodeTerminal`                                       |
| nonterminal symbol | `name`    | `Value<SemanticType.name>`                           |
| ordered choice     | `e1 / e2` | `[e1:Type(e1), e2: null] \| [e1:null, e2: Type(e2)]` |
| sequence           | `e1 e2`   | `[e1:Type(e1), e2: Type(e2)]`                        |
| zero or more       | `e*`      | `Type(e)[]`                                          |
| one or more        | `e+`      | `Type(e)[]`                                          |
| optional           | `e?`      | `Type(e)[]`                                          |
| grouping           | `(e)`     | `Type(e)`                                            |
| and predicate      | `&e`      | `null`                                               |
| not predicate      | `!e`      | `null`                                               |

In the above table, `Type(e)` is the type of the semantic value of the parsing expression `e`.

## License

MIT License

## Feedback

If you have any questions or comments, please contact me at [peg-express@okuda.xyz](mailto:peg-express@okuda.xyz)
