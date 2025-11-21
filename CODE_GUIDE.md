# Code Guide

1. When declaring a component type, the type keyword is used by default (not the interface keyword).

2. When declaring a component prop, the type name is declared as Prop within the file by default (e.g., simply "Prop" instead of "LoginButtonProp").

3. By default, arrow function expressions are used when declaring functions. For default exports, specify the "export default" component name at the bottom of the file. For named exports, specify the export directly on the declaration line.

4. In page.tsx, default exports are performed according to Next.js rules. In all other files not included in Next.js rules, named exports are used.
