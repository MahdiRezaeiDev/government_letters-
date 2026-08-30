/**
 * Wrap static UI copy in the runtime translator. This deliberately targets
 * presentation literals only, so user-entered content and API data remain intact.
 */
export default function pashtoUiBabelPlugin({ types: t }) {
    const hasArabicScript = (value) => /[\u0600-\u06ff]/u.test(value);
    const displayProperties = new Set([
        'label', 'title', 'subtitle', 'description', 'desc', 'placeholder',
        'message', 'emptyText', 'confirmText', 'cancelText', 'text',
    ]);
    const translatableAttributes = new Set([
        'alt', 'aria-label', 'placeholder', 'title',
    ]);

    const translationCall = (value) => t.callExpression(
        t.memberExpression(t.identifier('globalThis'), t.identifier('__uiTranslate')),
        [t.stringLiteral(value)],
    );

    return {
        name: 'pashto-static-ui-copy',
        visitor: {
            JSXText(path) {
                if (!hasArabicScript(path.node.value)) return;
                path.replaceWith(t.jsxExpressionContainer(translationCall(path.node.value)));
            },
            JSXAttribute(path) {
                const name = path.node.name.name;
                const value = path.node.value;
                if (!translatableAttributes.has(name) || !t.isStringLiteral(value) || !hasArabicScript(value.value)) return;
                path.node.value = t.jsxExpressionContainer(translationCall(value.value));
            },
            StringLiteral(path) {
                if (!hasArabicScript(path.node.value)) return;

                const parent = path.parentPath;
                const isDisplayProperty = parent.isObjectProperty()
                    && parent.node.value === path.node
                    && ((t.isIdentifier(parent.node.key) && displayProperties.has(parent.node.key.name))
                        || (t.isStringLiteral(parent.node.key) && displayProperties.has(parent.node.key.value)));
                const isJsxExpression = parent.isJSXExpressionContainer();
                const isConditionalCopy = parent.isConditionalExpression()
                    && (parent.node.consequent === path.node || parent.node.alternate === path.node);
                const isToastCopy = parent.isCallExpression()
                    && t.isIdentifier(parent.node.callee)
                    && ['showToast', 'alert', 'confirm'].includes(parent.node.callee.name);

                if (!isDisplayProperty && !isJsxExpression && !isConditionalCopy && !isToastCopy) return;
                path.replaceWith(translationCall(path.node.value));
                path.skip();
            },
        },
    };
}
