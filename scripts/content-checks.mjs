import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import {
  parseTemplate,
  TmplAstText,
  TmplAstBoundText,
  TmplAstTextAttribute,
  TmplAstIcu,
  Interpolation,
  LiteralPrimitive,
  Conditional,
  Binary,
} from '@angular/compiler';

export function readText(path) {
  return readFileSync(path, 'utf8');
}

export function sourceFiles(root = 'src') {
  return readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(root, entry.name);
      return entry.isDirectory() ? sourceFiles(path) : [path];
    })
    .sort();
}

export function checkTemplate(source, file) {
  const errors = [];
  const parsed = parseTemplate(source, file, { preserveWhitespaces: true });
  if (parsed.errors?.length) return parsed.errors.map((error) => `${file}: parse error: ${error}`);
  const visited = new Set();
  const attributes = new Set(['aria-label', 'alt', 'title', 'placeholder']);
  function checkExpression(expression) {
    if (expression instanceof LiteralPrimitive && typeof expression.value === 'string') {
      if (expression.value.trim()) errors.push(`${file}: literal text: ${expression.value.trim()}`);
    } else if (expression instanceof Conditional) {
      checkExpression(expression.trueExp);
      checkExpression(expression.falseExp);
    } else if (expression instanceof Binary && expression.operation === '+') {
      checkExpression(expression.left);
      checkExpression(expression.right);
    } else if (expression instanceof Interpolation) {
      expression.expressions.forEach(checkExpression);
    }
  }
  function walkI18n(node) {
    node.visit({
      visitText(text) {
        if (text.value.trim()) errors.push(`${file}: literal text: ${text.value.trim()}`);
      },
      visitContainer(container) {
        container.children.forEach(walkI18n);
      },
      visitIcu(icu) {
        Object.values(icu.cases).forEach(walkI18n);
      },
      visitTagPlaceholder(tag) {
        tag.children.forEach(walkI18n);
      },
      visitPlaceholder() {},
      visitIcuPlaceholder(placeholder) {
        walkI18n(placeholder.value);
      },
      visitBlockPlaceholder(block) {
        block.children.forEach(walkI18n);
      },
    });
  }
  function walk(node) {
    if (!node || typeof node !== 'object' || visited.has(node)) return;
    visited.add(node);
    if (node instanceof TmplAstText && node.value.trim())
      errors.push(`${file}: literal text: ${node.value.trim()}`);
    if (node instanceof TmplAstTextAttribute && attributes.has(node.name))
      errors.push(`${file}: literal ${node.name}: ${node.value}`);
    if (node instanceof TmplAstIcu) node.i18n.nodes.forEach(walkI18n);
    const expression = node.value?.ast;
    if (node instanceof TmplAstBoundText || attributes.has(node.name)) checkExpression(expression);
    if (
      (node instanceof TmplAstBoundText || attributes.has(node.name)) &&
      expression instanceof Interpolation
    ) {
      for (const text of expression.strings) {
        if (text.trim()) errors.push(`${file}: literal ${node.name ?? 'text'}: ${text.trim()}`);
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.endsWith('Span') || key === 'i18n') continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  }
  parsed.nodes.forEach(walk);
  return errors;
}

function parseSource(source, file) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function moduleReferences(tree) {
  const references = [];
  function walk(node) {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      const bindings = node.importClause?.namedBindings ?? node.exportClause;
      const namedTypesOnly =
        bindings &&
        (ts.isNamedImports(bindings) || ts.isNamedExports(bindings)) &&
        bindings.elements.length > 0 &&
        bindings.elements.every((item) => item.isTypeOnly);
      references.push({
        name: node.moduleSpecifier.text,
        typeOnly:
          node.isTypeOnly ||
          node.importClause?.isTypeOnly ||
          (!node.importClause?.name && namedTypesOnly),
      });
    }
    if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require')) &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    ) {
      references.push({ name: node.arguments[0].text, typeOnly: false });
    }
    if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference) &&
      node.moduleReference.expression &&
      ts.isStringLiteralLike(node.moduleReference.expression)
    ) {
      references.push({ name: node.moduleReference.expression.text, typeOnly: node.isTypeOnly });
    }
    ts.forEachChild(node, walk);
  }
  walk(tree);
  return references;
}

function compilerOptions(root = process.cwd()) {
  const path = join(root, 'tsconfig.json');
  if (!existsSync(path)) return {};
  const config = ts.readConfigFile(path, ts.sys.readFile);
  if (config.error)
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  if (parsed.errors.length)
    throw new Error(
      parsed.errors
        .map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n'))
        .join('\n'),
    );
  return parsed.options;
}

export function checkSource(source, file, loadTemplate = readText, options = compilerOptions()) {
  if (file.endsWith('.spec.ts')) return [];
  const errors = [];
  const tree = parseSource(source, file);
  for (const diagnostic of tree.parseDiagnostics)
    errors.push(
      `${file}: parse error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
    );
  for (const { name, typeOnly } of moduleReferences(tree)) {
    if (typeOnly) continue;
    const resolved =
      ts.resolveModuleName(name, resolve(file), options, ts.sys).resolvedModule?.resolvedFileName ??
      name;
    if (
      /\.content(?:\.ts)?$/.test(resolved) &&
      resolve(file) !== resolve('src/app/core/content/content-facade.ts')
    )
      errors.push(`${file}: raw content ${name} must be imported through the facade`);
  }
  const components = new Set();
  const namespaces = new Set();
  for (const statement of tree.statements) {
    if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== '@angular/core')
      continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamespaceImport(bindings)) namespaces.add(bindings.name.text);
    if (bindings && ts.isNamedImports(bindings)) {
      for (const item of bindings.elements)
        if ((item.propertyName ?? item.name).text === 'Component') components.add(item.name.text);
    }
  }
  function walk(node) {
    if (ts.isDecorator(node) && ts.isCallExpression(node.expression)) {
      const call = node.expression;
      const name = call.expression;
      const component =
        (ts.isIdentifier(name) && components.has(name.text)) ||
        (ts.isPropertyAccessExpression(name) &&
          ts.isIdentifier(name.expression) &&
          namespaces.has(name.expression.text) &&
          name.name.text === 'Component');
      if (component) {
        const metadata = call.arguments[0];
        if (!metadata || !ts.isObjectLiteralExpression(metadata))
          errors.push(`${file}: Component metadata must be static`);
        else
          for (const property of metadata.properties) {
            if (ts.isSpreadAssignment(property))
              errors.push(`${file}: Component metadata spread must be static`);
            if (
              ts.isShorthandPropertyAssignment(property) &&
              ['template', 'templateUrl'].includes(property.name.text)
            ) {
              errors.push(`${file}: ${property.name.text} must be static`);
            }
            if (!ts.isPropertyAssignment(property)) continue;
            const propertyName = ts.isComputedPropertyName(property.name)
              ? property.name.expression
              : property.name;
            if (!ts.isIdentifier(property.name) && !ts.isStringLiteralLike(propertyName)) {
              errors.push(`${file}: Component metadata key must be static`);
              continue;
            }
            const key = propertyName.text;
            if (key !== 'template' && key !== 'templateUrl') continue;
            if (!ts.isStringLiteralLike(property.initializer))
              errors.push(`${file}: ${key} must be static`);
            else {
              try {
                const target =
                  key === 'template' ? file : resolve(dirname(file), property.initializer.text);
                errors.push(
                  ...checkTemplate(
                    key === 'template' ? property.initializer.text : loadTemplate(target),
                    target,
                  ),
                );
              } catch (error) {
                errors.push(`${file}: template failure: ${error.message}`);
              }
            }
          }
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(tree);
  return errors;
}

export function runStaticVerificationFixture(contamination = '', mutateHtml = (html) => html) {
  const project = process.cwd();
  const workspace = join(project, '.agents/workspace');
  mkdirSync(workspace, { recursive: true });
  const fixture = mkdtempSync(join(workspace, 'static-verifier-'));
  try {
    const browser = join(fixture, 'dist/agency-portfolio/browser');
    const fonts = join(browser, 'media/fonts');
    mkdirSync(fonts, { recursive: true });
    mkdirSync(join(fixture, 'src'), { recursive: true });
    writeFileSync(join(fixture, 'src/main.ts'), 'export {};');
    for (const name of ['quicksand', 'outfit']) {
      copyFileSync(
        join(project, `public/media/fonts/${name}-latin-wght.woff2`),
        join(fonts, `${name}-latin-wght.woff2`),
      );
    }
    writeFileSync(join(browser, 'media/kva-icon.png'), 'fixture');
    writeFileSync(
      join(browser, 'index.html'),
      mutateHtml(
        `<html lang="es-MX"><head><base href="/octo-robot-kva/">
      <title>kVA Instalaciones | Fixture</title><link rel="icon" href="media/kva-icon.png">
      <link rel="preload" as="image" type="image/avif" imagesrcset="media/backgrounds/cover-blueprint-tools-320.avif 320w" imagesizes="100vw" fetchpriority="high">
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'">
      </head><body><app-root ng-server-context="ssg"><section id="inicio"><h1>kVA Instalaciones</h1><a href="#contacto">Cotiza tu proyecto</a></section>
      <section id="contacto"><img class="contact-logo" src="media/logo/kva-logo-white-40.png" alt=""><h2 id="contacto-title" tabindex="-1">Contacto</h2><h3>Ing. Alfredo Hernández</h3><button class="copy-button" hidden></button><a class="contact-cta" href="mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto">Cotiza tu proyecto</a></section>
      <section id="aviso"></section><footer>
      <a href="mailto:proyectos1@kvainstalaciones.mx?subject=%5Bkvainstalaciones.mx%5D%20Contacto">e</a>
      <a href="tel:+525640003344">t</a><a href="#aviso">a</a></footer></app-root>
      <script id="ng-state" type="application/json">{}</script></body></html>`,
      ),
    );
    writeFileSync(join(browser, 'main.js'), contamination || 'console.log("fixture");');
    const result = spawnSync(process.execPath, [join(project, 'scripts/verify-static-build.mjs')], {
      cwd: fixture,
      encoding: 'utf8',
    });
    if (result.error) throw result.error;
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

export function scanContentProject(root = process.cwd()) {
  const options = compilerOptions(root);
  return sourceFiles(join(root, 'src'))
    .filter((file) => file.endsWith('.ts'))
    .flatMap((file) => checkSource(readText(file), file, readText, options));
}

function forbiddenDependency(name) {
  return (
    /(?:^|\/)ajv(?:-formats)?(?:\/|$)/.test(name) ||
    /(?:^|\/)sharp(?:\/|$)|@img\/sharp|build-images|images\.manifest/.test(name) ||
    /(?:^|\/)schemas\/|\.schema\.json$|content-checks/.test(name)
  );
}

export function validationLeaks({
  sources = {},
  artifacts = {},
  entries = ['src/main.ts', 'src/main.server.ts'],
  options = compilerOptions(),
} = {}) {
  const errors = [];
  const normalized = new Map(
    Object.entries(sources).map(([file, source]) => [resolve(file), source]),
  );
  const visited = new Set();
  function walk(file) {
    file = resolve(file);
    if (visited.has(file) || !normalized.has(file)) return;
    visited.add(file);
    const tree = parseSource(normalized.get(file), file);
    for (const diagnostic of tree.parseDiagnostics)
      errors.push(
        `${file}: parse error: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`,
      );
    for (const { name, typeOnly } of moduleReferences(tree)) {
      if (typeOnly) continue;
      const resolved = ts.resolveModuleName(name, file, options, ts.sys).resolvedModule
        ?.resolvedFileName;
      if (forbiddenDependency(name) || (resolved && forbiddenDependency(resolved)))
        errors.push(`${relative(process.cwd(), file)}: runtime validation dependency ${name}`);
      const candidate = resolved ?? resolve(dirname(file), name);
      const target = [candidate, `${candidate}.ts`, join(candidate, 'index.ts')].find((path) =>
        normalized.has(path),
      );
      if (target) walk(target);
    }
  }
  entries.forEach(walk);
  for (const [file, text] of Object.entries(artifacts)) {
    if (
      /\.schema\.json$/.test(file) ||
      /ajv-formats|node_modules\/ajv(?:\/|\b)|json-schema\.org\/draft\/2020-12|\.schema\.json|validateFormats|must pass .* keyword validation|node_modules\/(?:sharp\/|@img\/sharp)|build-images\.mjs|images\.manifest\.json|libvips/.test(
        text,
      )
    )
      errors.push(`${file}: emitted validation code or content schema`);
  }
  return errors;
}
