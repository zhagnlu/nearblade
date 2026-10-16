import type { PluginObj, PluginPass } from "@babel/core";
import type * as BabelTypes from "@babel/types";

interface State extends PluginPass {
  localizedName?: BabelTypes.Identifier;
  localizedUsed?: boolean;
  skipLocalization?: boolean;
}

export default function localizeJsx({ types: t }: { types: typeof BabelTypes }): PluginObj<State> {
  return {
    name: "nearblade-localized-elements",
    visitor: {
      Program: {
        enter(path, state) {
          const filename = (state.filename || "").replace(/\\/g, "/");
          state.skipLocalization = !filename.includes("/src/") || filename.includes("/src/i18n/") || filename.endsWith("/PageMeta.tsx");
          state.localizedName = path.scope.generateUidIdentifier("LocalizedElement");
        },
        exit(path, state) {
          if (!state.localizedUsed || !state.localizedName) return;
          path.unshiftContainer("body", t.importDeclaration([t.importSpecifier(state.localizedName, t.identifier("LocalizedElement"))], t.stringLiteral("@/i18n/LocalizedElement")));
        },
      },
      JSXElement: {
        exit(path, state) {
          if (state.skipLocalization || !state.localizedName) return;
          const name = path.node.openingElement.name;
          if (!t.isJSXIdentifier(name) || (!/^[a-z]/.test(name.name) && !["Link", "NavLink"].includes(name.name)) || ["script", "style", "meta", "link", "title"].includes(name.name)) return;
          const component = /^[a-z]/.test(name.name) ? t.stringLiteral(name.name) : t.jsxExpressionContainer(t.identifier(name.name));
          path.node.openingElement.attributes.unshift(t.jsxAttribute(t.jsxIdentifier("as"), component));
          path.node.openingElement.name = t.jsxIdentifier(state.localizedName.name);
          if (path.node.closingElement) path.node.closingElement.name = t.jsxIdentifier(state.localizedName.name);
          state.localizedUsed = true;
        },
      },
    },
  };
}
