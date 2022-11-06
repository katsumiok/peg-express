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
    return parseInt(node.text);
  }
}
