/**
 * @fileoverview Disallows invalid binding positions in templates
 * @author James Garbutt <https://github.com/43081j>
 */

import {Rule} from 'eslint';
import * as ESTree from 'estree';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Disallows invalid binding positions in templates',
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/43081j/eslint-plugin-lit/blob/master/docs/rules/binding-positions.md'
    }
  },

  create(context): Rule.RuleListener {
    // variables should be defined here
    const tagPattern = /<\/?$/;
    const attrPattern = /^=/;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      TaggedTemplateExpression: (node: ESTree.Node): void => {
        if (
          node.type === 'TaggedTemplateExpression' &&
          node.tag.type === 'Identifier' &&
          node.tag.name === 'html'
        ) {
          for (let i = 0; i < node.quasi.expressions.length; i++) {
            const expr = node.quasi.expressions[i];
            const prev = node.quasi.quasis[i];
            const next = node.quasi.quasis[i + 1];
            if (tagPattern.test(prev.value.raw)) {
              context.report({
                node: expr,
                message: 'Bindings cannot be used in place of tag names.'
              });
            } else if (next && attrPattern.test(next.value.raw)) {
              context.report({
                node: expr,
                message: 'Bindings cannot be used in place of attribute names.'
              });
            }
          }
        }
      }
    };
  }
};

export = rule;
