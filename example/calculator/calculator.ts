import { Expression, Factor, Parser, Term, NodeTerminal } from './parser';

export class Calculator extends Parser {
  override Expression([term, rest]: Expression) {
    return rest.reduce(
      (acc, [[add], term]): number =>
        add ? acc + term.value : acc - term.value,
      term.value
    );
  }

  override Term([factor, rest]: Term) {
    return rest.reduce(
      (acc, [[mul], factor]): number =>
        mul ? acc * factor.value : acc / factor.value,
      factor.value
    );
  }

  override Factor([number, parenthesizedExpression]: Factor) {
    if (number) {
      return number.value;
    }
    const [, expr] = parenthesizedExpression;
    return expr.value;
  }

  override Number(node: NodeTerminal) {
    return parseInt(node.text, 10);
  }
}
