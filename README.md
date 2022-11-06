# peg-express

[![DeepScan grade](https://deepscan.io/api/teams/19126/projects/22871/branches/681480/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=19126&pid=22871&bid=681480)

peg-express is a parser generator for TypeScript.
It applies separation of concerns: grammar definition and semantic actions are separated.
Grammar definition is written in pure Parsing Expression Grammar (PEG) and semantic actions are written in TypeScript.
Since peg-express generates support code for semantic actions, it is possible to write semantic actions with type-guided IDE support such as code completion.

## Installation

To install peg-express, run the following command in the project directory:

```sh
$ npm install peg-express
```

## Usage

To use peg-express, you need to write a grammar definition and optional semantic actions.
Without semantics actions, generated parsers create a parse tree of the input.
The user can easily write their semantic actions by extending the generated parser class.

Typical steps to use peg-express are:

1. Write a grammar definition in PEG.
2. Generate a parser from the grammar definition.
3. Write semantic actions by inheriting the generated parser.
4. Use the parser.

## Step1: Write a grammar definition in PEG

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

## Step2: Generate a parser from the grammar definition

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

## Step3: Write semantic actions by inheriting the generated parser

This step is optional.
If you do not write semantic actions, the generated parser creates a parse tree of the input.
You can write semantic actions by extending the generated parser class.

For example, if you want to evaluate the input expression, you can write semantic actions as follows:

```ts
import assert from 'assert';
import { Expression, Factor, Parser, Term, NodeTerminal } from './parser';

export class Calculator extends Parser {
  override Factor(node: Factor) {
    const [number, parenthesizedExpression] = node;
    if (number) {
      return number.value;
    }
    assert(parenthesizedExpression);
    const [, expr] = parenthesizedExpression;
    return expr.value;
  }

  override Term(node: Term) {
    const [factor, rest] = node;
    return rest.reduce(
      (acc, [[mul], factor]): number =>
        mul ? acc * factor.value : acc / factor.value,
      factor.value
    );
  }

  override Expression(node: Expression) {
    const [term, rest] = node;
    return rest.reduce(
      (acc, [[add], term]): number =>
        add ? acc + term.value : acc - term.value,
      term.value
    );
  }

  override Number(node: NodeTerminal) {
    return parseInt(node[0].text);
  }
}
```

## Step4: Use the parser

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
