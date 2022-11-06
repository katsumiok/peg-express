// Copyright 2022 Katsumi Okuda
import { parse } from '@babel/parser';
import { parseGrammar, Peg } from 'pegisland';
import { generateSemanticsTypes } from '../bin/generateSemanticsTypes';

describe('generateSemanticsTypes', () => {
  it('should generate a valid file', () => {
    const grammar = `
    Program <- 'a'
    `;
    const peg = parseGrammar(grammar) as Peg;
    const types = generateSemanticsTypes([...peg.rules.values()]);
    const ast = parse(types, {
      plugins: ['typescript'],
      sourceType: 'module',
    });
    expect(ast.errors.length).toEqual(0);
  });
});
