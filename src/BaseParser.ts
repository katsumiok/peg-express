// Copyright 2022 Katsumi Okuda
import { createParser, IParseTree, NodeNonterminal, Parser } from 'pegisland';
import { convertParseTree } from './convertParseTree';

export class BaseParser {
  #parser;

  constructor(grammar: string) {
    this.#parser = createParser(grammar) as Parser;
  }

  parse(text: string, start: string): Error | any {
    const parseTree = this.#parser.parse(text, start) as IParseTree;
    if (parseTree instanceof Error) {
      return parseTree;
    }
    return convertParseTree(parseTree, this);
  }
}

export class Value<T> {
  constructor(
    public readonly value: T,
    public readonly node: NodeNonterminal
  ) {}
}
