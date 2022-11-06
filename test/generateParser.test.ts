// Copyright 2022 Katsumi Okuda
import { parse } from '@babel/parser';
import assert from 'assert';
import { parseGrammar } from 'pegisland';
import { generateParser } from '../bin/generateParser';

describe('generateParser', () => {
  it('should parse', () => {
    const grammar = `
        Program <- <<>> 'a' ('a' / 'b') 'a'* 'a'+ 'a'? !'a' &'a' 'a':'a' 'a':!'b' (A -> 'b')
        A <- 'a'
        `;
    const peg = parseGrammar(grammar);
    assert(!(peg instanceof Error));
    const parser = generateParser(
      [...peg.rules.values()],
      JSON.stringify(grammar)
    );
    const ast = parse(parser, {
      plugins: ['typescript'],
      sourceType: 'module',
    });
    expect(ast.errors.length).toEqual(0);
  });
});
