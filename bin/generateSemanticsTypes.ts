import { Rule } from 'pegisland';

export function generateSemanticsTypes(rules: Rule[]): string {
  return rules.map((rule) => `export type ${rule.symbol} = any;`).join('\n');
}
