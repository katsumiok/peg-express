// Copyright 2022 Katsumi Okuda
import { BaseParser } from '../src';

describe('BaseParser', () => {
  it('should parse', () => {
    const grammar = `
      Program <- '12'
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
        Program <- '1' '2'
      `;
    const parser = new (class extends BaseParser {
      Program([a, b]: any) {
        return parseInt(a.text, 10) * 10 + parseInt(b.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- '34' / '12'
    `;
    const parser = new (class extends BaseParser {
      Program([, b]: any) {
        return parseInt(b.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- '34' / '12'
    `;
    const parser = new (class extends BaseParser {
      Program([, b]: any) {
        return parseInt(b.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- ('12')
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- '12' -> '21'
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- !'34' '12'
    `;
    const parser = new (class extends BaseParser {
      Program([, node]: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- &'12' '12'
    `;
    const parser = new (class extends BaseParser {
      Program([, node]: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- r'\\d'*
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.map((x: any) => x.text).join(''), 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- r'\\d'+
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.map((x: any) => x.text).join(''), 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- r'\\d+'?
    `;
    const parser = new (class extends BaseParser {
      Program([node]: any) {
        return parseInt(node.text, 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- <<r'\\d'>>
    `;
    const parser = new (class extends BaseParser {
      Program(node: any) {
        return parseInt(node.map((x: any) => x.text).join(''), 10);
      }
    })(grammar);
    const x = parser.parse('12', 'Program');
    expect(x.value).toBe(12);
  });

  it('should parse', () => {
    const grammar = `
      Program <- '123'
    `;
    const parser = new BaseParser(grammar);
    const x = parser.parse('abc', 'Program');
    expect(x).toBeInstanceOf(Error);
  });
});
