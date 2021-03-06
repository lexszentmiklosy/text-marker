# Text Marker
Text Marker is a lexical analysis library for identifying regions of text according to the custom rules supplied.  It accepts a string and array of rules as input and produces an tree of token objects for output.

## Use Cases
Since the library only returns regular javascript objects it is not tied to a specific rendering framework. While this introduces a requirement to implement your own view component to render the tokens, it leaves the library flexible enough so that you can apply the same rules to parsing text when you eventually need to swap out your view library or have to operate in a mixed environment that uses multiple rendering frameworks.

Since Text Marker only outputs plain javascript objects the tokens can be parsed & cached before a view render is called. This can allow you to render more efficiently since you dont have to parse your tokens again every time you are asked to render your text. For an example please see **[the rendering example](./examples/render.html)**

Pros:
  - Flexible and extensible via middleware and plain javascript.
  - Supports defining a simple mark up language and identifying patterns in text.
  - View agnostic.

 Cons:
  - Probably overkill if all you need is a simple word highlighter.
  - You need to write you own view to render the token tree. You can refer to **[the rendering example](./examples/render.html)**

## Basic usage
Text Marker exposes an object with methods that provides basic functionality. See below to get started and the **[examples](https://github.com/Paul-Guerra/text-marker/tree/master/examples)** page for more details.

### textMarker.parse
Accepts accepts a string and arrays of rules and middleware and returns an tree of tokens.
````javascript
  let tokens = textMarker.parse('I have a *block* token', [rules], [middleware]);
````

### textMarker.block
Blocks are visible characters that should be REPLACED by tokens. It accepts an object with open and close string properties and a name for the token. If a close property is not provided it will default to the same value as the open property. By default blocks will only detect a match if it finds both and opening AND matching closing string. Blocks are case insensitive.

````javascript
let openAndCloseTags = {open: '*', close: '*'};
let name = 'MyBlock';
let blockRule = textMarker.block(openAndCloseTags, name);
let tokens = textMarker.parse('I have a *block* token', [blockRule]);
````

Since blocks will only detect a match if it finds both and opening AND matching closing string, in the example below no block tokens will be found.

````javascript
let openAndCloseTags = {open: '*', close: '*'};
let name = 'MyBlock';
let blockRule = textMarker.block(openAndCloseTags, name);
let tokens = textMarker.parse('I have a * no block tokens', [blockRule]);
````

The block function can also accept a regular expression, instead of a string as it's first argument. When providing your own regular expression please note:
- Blocks are pairs and the pattern is expected to match the beginning and end tokens as a group.
- The regular expression MUST wrap the open match as the first group and close match as the second group.
- An unoptimized regular expression MAY have adverse performance affects based on the size of the text being parsed and how greedy the regular expression match is.


#### Reserved Block Names
When giving your block a name please note that "TABLE", "TABLE_ROW" and "TABLE_CELL" have a special meaning. See [Nesting in Tables](#nesting-in-tables)

### textMarker.range
Ranges are patterns of text that need to be wrapped by tokens. They do not replace any text. For example, you would use a range if you want to define a word to be highlighted. Ranges are case insensitive.

````javascript
let name = 'MyHighlight';
let rangeRule = textMarker.range('foo', name);
let tokens = textMarker.parse('I have foo range tokens', [rangeRule]);
````

The range function can also accept a regular expression, instead of a string as it's first argument.

### textMarker.keyword
Keywords are special characters that will be replaced by a token. This can be useful if you want to replace certain words with other forms of output (images, etc.) or trigger other effects.

````javascript
let name = 'MyKeyword';
let keywordRule = textMarker.keyword('foo', name);
let tokens = textMarker.parse('I have a foo keyword token', [keywordRule]);
````

you can also pass in an array of strings. This may be useful if, for example, you want both :) and :P to resolve as an emoticon token but you dont want to make a separate rule for each string.

````javascript
let name = 'MyKeyword';
let keywordRules = textMarker.keyword(['foo', 'bar'], name);
let tokens = textMarker.parse('I have a foo bar keyword tokens', [keywordRules]);
````

Keywords must be words separated by spaces from their neighbors or by themselves on a line. They will not match if embedded in another word. The following example will not match a keyword


````javascript
let name = 'MyKeyword';
let keywordRules = textMarker.keyword(['FOO', name);
let tokens = textMarker.parse('I have no match forFOObecause it was not a standalone word', [keywordRules]);
````

### textMarker.symbol
Symbols are VERY similar to keywords except on how they match. A symbol will match anywhere it is found, even if it is part of a larger word.

````javascript
let name = 'MySymbol';
let symbolRule = textMarker.symbol('FOO', name);
let tokens = textMarker.parse('I have aFOOsymbol token', [symbolRule]);
````

## Overlapping blocks and ranges
Text Marker will also ensure the generated tokens are properly nested and do not overlap with each other. If it does detect overlapping blocks or ranges of text it will attempt insert tokens that create a valid tree. It makes it easier to work with libraries like React that require a component to be valid html.

Basically, it will provide a token tree to help prevent you from rendering this
````
<b>foo <u>bar</b> baz</u>
````
and instead help you render this
````
<b>foo <u>bar</u></b><u> baz</u>
````

### Nesting in Tables
If a block or range span is not closed when an end of a TABLE_CELL (token.name === 'TABLE_CELL') is parsed it will automatically be closed and not continued.

## Modules
Text Marker supports CommonJS, AMD and good old fashioned script tags. 

## Middleware
Middleware is an array of functions applied prior to searching for any tokens. Each middleware function will receive a text string as an argument and is expected to return a text string. The test provided in the argument may be the original text supplied or the output of the middleware that executed earlier.

If any middleware throws and error Text Marker will stop executing all middleware and apply the provided token rules using the **original** text supplied to the parse function.

See the [middleware example](https://github.com/Paul-Guerra/text-marker/blob/master/examples/middleware.html) for more details

## Custom Attributes
The keyword, block and range rule functions accept an optional third arguments. It is expected to be an object. If the setAttributes property is a function, it will be passed a regular expression match result. The return value of that function will be assigned to the node attributes property. This can be useful for relating metadata to a node.
