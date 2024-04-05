/**
 * Wraps the given HTML content in a body tag with some default styles.
 */
export function wrapHTML(html: string) {
  return `<body style="padding:20px;font-family:sans-serif;height:100vh;">
            ${html}</body>`;
}
