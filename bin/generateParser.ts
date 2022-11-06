// Copyright 2022 Katsumi Okuda
import {
  And,
  Colon,
  ColonNot,
  Grouping,
  IParsingExpressionVisitor,
  Lake,
  NodeTerminal,
  Nonterminal,
  Not,
  OneOrMore,
  Optional,
  OrderedChoice,
  Rewriting,
  Rule,
  Sequence,
  Terminal,
  ZeroOrMore,
} from 'pegisland';
import prettier from 'prettier';

class TypeGenerator implements IParsingExpressionVisitor<[], string> {
  visitNonterminal(pe: Nonterminal): string {
    return `Value<sv.${pe.rule.symbol}>`;
  }

  visitTerminal(_pe: Terminal): string {
    return `${NodeTerminal.name}`;
  }

  visitZeroOrMore(pe: ZeroOrMore): string {
    return `Array<${pe.operand.accept(this)}>`;
  }

  visitOneOrMore(pe: OneOrMore): string {
    return `Array<${pe.operand.accept(this)}>`;
  }

  visitOptional(pe: Optional): string {
    return `Array<${pe.operand.accept(this)}>`;
  }

  visitAnd(_pe: And): string {
    return 'null';
  }

  visitNot(_pe: Not): string {
    return 'null';
  }

  visitSequence(pe: Sequence): string {
    return `[${pe.operands.map((operand) => operand.accept(this)).join(', ')}]`;
  }

  visitOrderedChoice(pe: OrderedChoice): string {
    return `[${pe.operands
      .map((operand) => `${operand.accept(this)}?`)
      .join(', ')}]`;
  }

  visitGrouping(pe: Grouping): string {
    return pe.operand.accept(this);
  }

  visitColon(pe: Colon): string {
    return pe.rhs.accept(this);
  }

  visitColonNot(pe: ColonNot): string {
    return pe.lhs.accept(this);
  }

  visitLake(pe: Lake): string {
    return pe.operand.accept(this);
  }

  visitRewriting(pe: Rewriting): string {
    return pe.operand.accept(this);
  }
}

function generateTypes(rules: Rule[]): string {
  const typeGenerator = new TypeGenerator();
  return rules
    .map(
      (rule) => `export type ${rule.symbol} = ${rule.rhs.accept(typeGenerator)}`
    )
    .join('\n');
}

function generateVisitor(rules: Rule[]): string {
  const body = rules
    .map(
      (rule) =>
        `${rule.symbol}(node: ${rule.symbol}): sv.${rule.symbol}{return node as any}`
    )
    .join('\n');
  return `
  export class Parser extends BaseParser {
    constructor() { super(grammar); }
    ${body}
  }
`;
}

export function generateParser(rules: Rule[], grammarJson: string) {
  const types = generateTypes(rules);
  const visitor = generateVisitor(rules);
  const s = `import { NodeTerminal } from 'pegisland';
  export { NodeTerminal, NodeNonterminal } from 'pegisland';
  import { BaseParser, Value } from 'peg-express';
  export { Value } from 'peg-express';
  import * as sv from './SemanticValue';
  export const grammar: string = ${grammarJson}
${types}
${visitor} 

`;
  const formattedText = prettier.format(s, { semi: true, parser: 'babel-ts' });
  return formattedText;
}
