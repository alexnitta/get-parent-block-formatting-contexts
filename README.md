# get-parent-block-formatting-contexts
Get the block formatting context for all the parents of a given DOM element.

## Why this is useful

Sooner or later, you may come across unexpected results when working with floats or overflow within a flexbox item. From googling around, you'll run across [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context) with some rules on it which describe how a new block formatting context can be created.

That's when you'll realize that you can't keep all these rules in your head as you look over the DOM structure and try to figure out what's wrong. You might want a bit of code you can run in your browser that will tell you which elements of a specific DOM element are creating a new block formatting context.

## How to use it

1. Open the page you're debugging in the browser and make sure the desired element is present in the DOM
2. Open the JavaScript console
3. Copy/paste the code in [getParentBlockFormattingContexts.js](getParentBlockFormattingContexts.js) into the console
4. Call `getParentBlockFormattingContexts` with a query selector that matches the desired element, like this:
    ```javascript
    getParentBlockFormattingContexts('#wiki-content');
    ```
5. You will see an array of objects, each one representing a DOM element. They are listed from the `<html>` root inwards, so your desired element will be at the end of the array. Each object looks like this:
    ```javascript
        {
            "id": "wiki-column-container",
            "className": "wiki-left-present",
            "tagName": "DIV",
            "newBFC": true,
            "newBFCReasons": [
                "blockElementWithoutOverflowVisible"
            ]
        },
    ```
    The `newBFC` boolean tells you whether this element establishes a new block formatting context. The `newBFCReasons` array tells you the list of matching rules that explain why a new block formatting context is established. For more on how these work, see the source code.

## Troubleshooting

`getParentBlockFormattingContexts` is using `document.querySelector` to find your element. If you're having trouble, make sure that the argument you pass to `getParentBlockFormattingContexts` works with `document.querySelector`.

## Caveats

This script implements these rules as listed on [this page on MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context), which states that it was updated as of August 5th, 2019.

If the rules haved changed since then, then the script will be out of date. Make sure you understand the rules behind how block formatting contexts work before you depend on this script.

## Credits

This script is based on [this answer](https://stackoverflow.com/a/30895821) to a StackOverflow question. The answer was out of date and coded in a compact, but less informative style. I updated it and improved the output so that it shows the reasons why each new block formatting context is established.
