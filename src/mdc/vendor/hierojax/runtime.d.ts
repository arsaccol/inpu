// Types for the small portion of the pinned upstream used by the Inpu adapter.
interface Lexer {
  EOF: number
  yytext: string
  setInput(source: string, yy?: object): Lexer
  lex(): number | string
}

export interface MdcPart {
  toString(): string
}

export class MdcFragment implements MdcPart {
  toString(): string
}

export const mdcsyntax: {
  parse(source: string): { parts: MdcPart[] }
  lexer: Lexer
  terminals_: Record<number, string>
}

export const syntax: {
  parse(unicode: string): {
    toString(): string
    print(element: HTMLElement, options: {
      type: 'svg'
      dir: 'hlr'
      fontsize: number
      signcolor: string
      bracketcolor: string
      separated: 'true'
    }): void
  }
}

export const MdcSign: {
  nameToChar(name: string): string
}
export const mdcNames: Record<string, { str: string; kind: string } | undefined>
export const mdcNamesUniKemet: Record<string, { str: string } | undefined>
export const Shapes: { PLACEHOLDER: string }
