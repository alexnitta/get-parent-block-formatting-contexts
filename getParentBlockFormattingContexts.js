

const testParentPropertyValue = (element, propertyName, propertyValueTest) => {
    if (element.parentElement) {
        const parentElementStyle = window.getComputedStyle(element.parentElement);

        return propertyValueTest(parentElementStyle.getPropertyValue(propertyName));
    }

    return false;
};

const testPropertyValue = (element, propertyName, propertyValueTest) => {
    const elementStyle = window.getComputedStyle(element);

    return propertyValueTest(elementStyle.getPropertyValue(propertyName));
};

const blockLevelElementTags = [
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "BLOCKQUOTE",
    "DETAILS",
    "DIALOG",
    "DD",
    "DIV",
    "DL",
    "DT",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HGROUP",
    "HR",
    "LI",
    "MAIN",
    "NAV",
    "OL",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "UL",
];

const isBlockLevelElement = element => blockLevelElementTags.indexOf(element.tagName) !== -1;

const isRoot = element => element.tagName === 'HTML';

const hasFloat = element =>
    testPropertyValue(element, 'float', value => value !== 'none');

const positionAbsolute = element =>
    testPropertyValue(element, 'position', value => value === 'absolute');

const positionFixed = element =>
    testPropertyValue(element, 'position', value => value === 'fixed');

const displayInlineBlock = element =>
    testPropertyValue(element, 'display', value => value === 'inline-block');

const displayTableCell = element =>
    testPropertyValue(element, 'display', value => value === 'table-cell');

const displayTableCaption = element =>
    testPropertyValue(element, 'display', value => value === 'table-caption');

const displayTable = element =>
    testPropertyValue(element, 'display', value => value === 'table');

const displayTableRow = element =>
    testPropertyValue(element, 'display', value => value === 'table-row');

const displayTableRowGroup = element =>
    testPropertyValue(element, 'display', value => value === 'table-row-group');

const displayTableHeaderGroup = element =>
    testPropertyValue(element, 'display', value => value === 'table-header-group');

const displayTableFooterGroup = element =>
    testPropertyValue(element, 'display', value => value === 'table-footer-group');

const displayInlineTable = element =>
    testPropertyValue(element, 'display', value => value === 'table-inline-table');

const blockElementWithoutOverflowVisible = element => {
    return isBlockLevelElement(element) &&
        testPropertyValue(element, 'overflow', value => value !== 'visible');
}

const displayFlowRoot = element =>
    testPropertyValue(element, 'display', value => value === 'flow-root');

const containLayout = element =>
    testPropertyValue(element, 'contain', value => value === 'layout');

const containContent = element =>
    testPropertyValue(element, 'contain', value => value === 'content');

const containPaint = element =>
    testPropertyValue(element, 'contain', value => value === 'paint');

const flexItem = element =>
    testParentPropertyValue(element, 'display', value => value === 'flex');

const inlineFlexItem = element =>
    testParentPropertyValue(element, 'display', value => value === 'inline-flex');

const gridItem = element =>
    testParentPropertyValue(element, 'display', value => value === 'grid');

const inlineGridItem = element =>
    testParentPropertyValue(element, 'display', value => value === 'inline-grid');

const multicolContainerByColumnCount = element =>
    testParentPropertyValue(element, 'column-count', value => value !== 'auto');

const multicolContainerByColumnWidth = element =>
    testParentPropertyValue(element, 'column-width', value => value !== 'auto');

const columnSpanAll = element =>
    testParentPropertyValue(element, 'column-span', value => value === 'all');

const rules = {
    isRoot,
    hasFloat,
    positionAbsolute,
    positionFixed,
    displayInlineBlock,
    displayTableCell,
    displayTableCaption,
    displayTable,
    displayTableRow,
    displayTableRowGroup,
    displayTableHeaderGroup,
    displayTableFooterGroup,
    displayInlineTable,
    blockElementWithoutOverflowVisible,
    displayFlowRoot,
    containLayout,
    containContent,
    containPaint,
    flexItem,
    inlineFlexItem,
    gridItem,
    inlineGridItem,
    multicolContainerByColumnCount,
    multicolContainerByColumnWidth,
    columnSpanAll,
};

const checkIfElementEstablishesNewBlockFormattingContext = element => {
    const newBFCReasons = [];

    for (const ruleKey in rules) {
        const rule = rules[ruleKey];

        if (rule(element)) {
            newBFCReasons.push(ruleKey);
        }
    }

    const newBFC = newBFCReasons.length > 0;

    return { newBFC, newBFCReasons };
};

const getParentBlockFormattingContexts = selector => {
    const startElement = document.querySelector(selector);

    if (!startElement) {
        throw new Error('No element found - check your query selector argument.');
    }

    const walkUpDOMAndGetBlockFormattingContexts = (element, result = []) => {
        const { id, className, tagName } = element;
        const { newBFC, newBFCReasons } =
            checkIfElementEstablishesNewBlockFormattingContext(element);

        const elementResult = {
            id,
            className,
            tagName,
            newBFC,
            newBFCReasons,
        };

        result.unshift(elementResult);

        if (element.parentElement) {
            return walkUpDOMAndGetBlockFormattingContexts(element.parentElement, result);
        }

        return result;
    };

    return walkUpDOMAndGetBlockFormattingContexts(startElement);
};
