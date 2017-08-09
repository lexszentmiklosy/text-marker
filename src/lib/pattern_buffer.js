// sorting function for an array of tokens
export function tokenSort(a, b) {
  let aPriority = a.priority || 0;
  let bPriority = b.priority || 0;
  if (aPriority < bPriority) return -1;
  if (aPriority > bPriority) return 1;
  return 0;
}

export function offsetSort(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// Manages queues of tokens to be flushed when scanning a specific index OR character
export default class PatternBuffer {
  constructor() {
    // used for looking up tokens by the string index they are associated with
    this.atOffset = {};
    // the string offsets that are associated  with tokens
    this.offsets = [];
  }

  on(when, index) {
    let key = `${index}`;
    if (!this.atOffset[key]) return;
    return this.atOffset[key][when].sort(tokenSort);
  }

  getOffsets() {
    return this.offsets.sort(offsetSort);
  }

  push(matches) {
    let count;
    let index;
    if (matches instanceof Array === false) {
      index = this.getTokenIndex(matches.index);
      index[matches.handle].push(matches);
      this.offsets.push(matches.index);
    } else {
      count = matches.length;
      while (count--) {
        index = this.getTokenIndex(matches[count].index);    
        index[matches[count].handle].push(matches[count]);
        this.offsets.push(matches[count].index);
      }
    }
  }

  getTokenIndex(key) {
    let index = this.atOffset;
    let i = typeof index === 'number' ? `${key}` : key;
    if (!index[i]) {
      this.atOffset[i] = {
        before: [], // tokens intended to be inserted before a char at index is processed
        at: [], // tokens intended to replace char at index 
        after: [] // tokens intended to be inserted before a char at index is processed
      };
    }
    return this.atOffset[i];
  }
}
