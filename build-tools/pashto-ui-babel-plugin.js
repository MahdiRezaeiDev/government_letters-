/**
 * Wrap static UI copy in the runtime translator. This deliberately targets
 * presentation literals only, so user-entered content and API data remain intact.
 */
export default function pashtoUiBabelPlugin({ types: t }) {
    const hasArabicScript = (value) => /[\u0600-\u06ff]/u.test(value);
    const translatableAttributes = new Set([
        'alt', 'aria-label', 'placeholder', 'title', 'subtitle',
        'label', 'name', 'message', 'description',
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
                path.skip();
            },
            JSXAttribute(path) {
                const name = path.node.name.name;
                const value = path.node.value;
                if (!translatableAttributes.has(name) || !t.isStringLiteral(value) || !hasArabicScript(value.value)) return;
                path.node.value = t.jsxExpressionContainer(translationCall(value.value));
                path.skip();
            },
            StringLiteral(path) {
                if (!hasArabicScript(path.node.value)) return;

                const parent = path.parentPath;
                const isTechnicalKey = (parent.isObjectProperty() && parent.node.key === path.node)
                    || (parent.isObjectMethod() && parent.node.key === path.node)
                    || (parent.isMemberExpression() && parent.node.property === path.node);
                const isModuleSpecifier = parent.isImportDeclaration()
                    || parent.isExportNamedDeclaration()
                    || parent.isExportAllDeclaration();
                const isTypeLiteral = parent.isTSLiteralType();
                const isAlreadyTranslated = parent.isCallExpression()
                    && t.isMemberExpression(parent.node.callee)
                    && t.isIdentifier(parent.node.callee.object, { name: 'globalThis' })
                    && t.isIdentifier(parent.node.callee.property, { name: '__uiTranslate' });

                if (isTechnicalKey || isModuleSpecifier || isTypeLiteral || isAlreadyTranslated) return;
                path.replaceWith(translationCall(path.node.value));
                path.skip();
            },
            TemplateLiteral(path) {
                if (path.parentPath.isTaggedTemplateExpression()) return;
                if (!path.node.quasis.some((quasi) => hasArabicScript(quasi.value.raw))) return;

                const parts = [];
                path.node.quasis.forEach((quasi, index) => {
                    const text = quasi.value.cooked ?? quasi.value.raw;
                    if (text) {
                        parts.push(hasArabicScript(text) ? translationCall(text) : t.stringLiteral(text));
                    }
                    if (index < path.node.expressions.length) {
                        parts.push(path.node.expressions[index]);
                    }
                });

                if (parts.length === 0) return;
                const expression = parts.slice(1).reduce(
                    (left, right) => t.binaryExpression('+', left, right),
                    parts[0],
                );
                path.replaceWith(expression);
            },
        },
    };
}
