// Copyright 2022 Katsumi Okuda
import { parseGrammar } from 'pegisland';
import { readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';
import { generateParser } from './generateParser';
import { generateSemanticsTypes } from './generateSemanticsTypes';

export function generateFiles(grammar: string) {
  const grammarText = readFileSync(grammar, 'utf8');
  const grammarJson = JSON.stringify(grammarText);
  const peg = parseGrammar(grammarText);
  if (peg instanceof Error) {
    console.log(peg.message);
    exit(0);
  }

  const rules = [...peg.rules.values()];
  const parserText = generateParser(rules, grammarJson);
  writeFileSync('parser.ts', parserText);
  const semanticsTypes = generateSemanticsTypes(rules);
  writeFileSync('SemanticValue.ts', semanticsTypes);
}
