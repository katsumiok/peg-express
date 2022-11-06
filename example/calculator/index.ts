import { Calculator } from './calculator';

const parser = new Calculator();
const result = parser.parse('(1+2)*3', 'Expression');
if (result instanceof Error) {
  console.error(result.message);
} else {
  console.log(result.value);
}
