import { CharacterMapping } from '../assets/characters'

type TrieNode = {
  glyph?: string;
  children: Record<string, TrieNode>;
}


export class Trie {
  private root: TrieNode;

  constructor(characterMapping: CharacterMapping) {
    this.root = { glyph: undefined, children: {} }
    this.build(characterMapping)
  }

  private build(characterMapping: CharacterMapping) {
    for(const { glyph, transliteration } of characterMapping.uniliterals) {
      let node = this.root
      for(const char of transliteration) {
        if(!node.children[char]) {
          node.children[char] = { glyph: undefined, children: {} }
        }
        node = node.children[char]
      }
      node.glyph = glyph
    }
  }

  transliterate(input: string): string {
    const output: string[] = []

    let node = this.root
    let buffer = ''

    for(const char of input) {
      if(node.children[char]) {
        buffer += char // add the character to the buffer
        node = node.children[char] // move to the next node

        if(node.glyph) {
          output.push(node.glyph) // if a glyph is found, add it to the output
          buffer = '' // clear the buffer
          node = this.root // restart from the root for the next sequence
        }
      } 
      else {
        // if no match, flush the buffer to the output
        output.push(buffer)
        buffer = char
        node = this.root.children[char] || this.root
      }
    }

    // append any unmatched input in the buffer
    if(buffer) {
      output.push(buffer)
    }

    return output.join('')
  }
}


