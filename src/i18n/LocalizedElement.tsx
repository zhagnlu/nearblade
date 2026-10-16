import { cloneElement, createContext, createElement, forwardRef, Fragment, isValidElement, useContext } from "react";
import type { ElementType, ReactElement, ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { translateText } from "./languages";
import type { Dictionary } from "./languages";

const TranslationDisabled = createContext(false);
const translateChildren = (children: ReactNode, dictionary: Dictionary): ReactNode => {
  if (typeof children === "string") return translateText(children, dictionary);
  if (Array.isArray(children)) return children.map(child => translateChildren(child, dictionary));
  if (isValidElement(children) && children.type === Fragment) {
    const fragment = children as ReactElement<{ children?: ReactNode }>;
    return cloneElement(fragment, undefined, translateChildren(fragment.props.children, dictionary));
  }
  return children;
};

// The build transform keeps native DOM nodes owned by React, including refs and form values.
export const LocalizedElement = forwardRef<Element, { as: ElementType; children?: ReactNode }>(function LocalizedElement({ as, children, ...props }, ref) {
  const { dictionary } = useLanguage();
  const inherited = useContext(TranslationDisabled);
  const attributes: Record<string, unknown> = { ...props, ref };
  const disabled = inherited || attributes.translate === "no" || attributes["data-no-translate"] !== undefined;
  if (!disabled) {
    for (const name of ["placeholder", "aria-label", "alt", "title"]) {
      if (typeof attributes[name] === "string") attributes[name] = translateText(attributes[name], dictionary);
    }
  }
  const content = disabled || as === "textarea" ? children : translateChildren(children, dictionary);
  const element = createElement(as, attributes, content);
  return disabled && !inherited ? <TranslationDisabled.Provider value>{element}</TranslationDisabled.Provider> : element;
});
