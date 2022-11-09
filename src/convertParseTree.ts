// Copyright 2022 Katsumi Okuda
import {
  IParseTree,
  IParseTreeVisitor,
  NodeAnd,
  NodeGrouping,
  NodeLake,
  NodeNonterminal,
  NodeNot,
  NodeOneOrMore,
  NodeOptional,
  NodeOrderedChoice,
  NodeRewriting,
  NodeSequence,
  NodeTerminal,
  NodeZeroOrMore,
} from 'pegisland';
import { Value } from './BaseParser';

class Converter implements IParseTreeVisitor<[object], unknown> {
  visitTerminal(node: NodeTerminal, _visitor: object): unknown {
    return node;
  }

  visitNonterminal(node: NodeNonterminal, visitor: object): unknown {
    const methodName = node.symbol;
    const func = visitor[methodName as keyof typeof visitor] as any;
    return new Value(
      func.call(visitor, node.childNodes[0].accept(this, visitor)),
      node
    );
  }

  visitSequence(node: NodeSequence, visitor: object): unknown {
    return node.childNodes.map((child) => child.accept(this, visitor));
  }

  visitOrderedChoice(node: NodeOrderedChoice, visitor: object): unknown {
    return [...Array(node.index + 1)].map((_, i) =>
      node.index === i ? node.childNodes[0].accept(this, visitor) : null
    );
  }

  visitZeroOrMore(node: NodeZeroOrMore, visitor: object): unknown {
    return this.#visitRepetition(node, visitor);
  }

  visitOneOrMore(node: NodeOneOrMore, visitor: object): unknown {
    return this.#visitRepetition(node, visitor);
  }

  visitOptional(node: NodeOptional, visitor: object): unknown {
    return this.#visitRepetition(node, visitor);
  }

  visitLake(node: NodeLake, visitor: object): unknown {
    return this.#visitRepetition(node, visitor);
  }

  visitAnd(node: NodeAnd, visitor: object): unknown {
    return this.#visitPredicate(node, visitor);
  }

  visitNot(node: NodeNot, visitor: object): unknown {
    return this.#visitPredicate(node, visitor);
  }

  visitGrouping(node: NodeGrouping, visitor: object): unknown {
    return this.#visitGroupingOrRewriting(node, visitor);
  }

  visitRewriting(node: NodeRewriting, visitor: object): unknown {
    return this.#visitGroupingOrRewriting(node, visitor);
  }

  #visitGroupingOrRewriting(
    node: NodeGrouping | NodeRewriting,
    visitor: object
  ): unknown {
    return node.childNodes[0].accept(this, visitor);
  }

  #visitRepetition(
    node: NodeZeroOrMore | NodeOneOrMore | NodeOptional | NodeLake,
    visitor: object
  ): unknown {
    return node.childNodes.map((child) => convertParseTree(child, visitor));
  }

  #visitPredicate(_node: NodeAnd | NodeNot, _visitor: object): unknown {
    return null;
  }
}

export function convertParseTree(
  parseTree: IParseTree,
  visitor: object
): unknown {
  return parseTree.accept(new Converter(), visitor);
}
