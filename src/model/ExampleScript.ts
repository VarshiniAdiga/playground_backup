export const HTML_CODE = `<!DOCTYPE html>
<html>
    <body>
        <header id="greeting" style="color: #00f" onclick="changeColor()">Hello World!</header>
        <hr />
    </body>
</html>`;

export const JAVASCRIPT_CODE = `function changeColor() {
    document.getElementById("greeting").style = "#f0f";
}`;

export const SCRIPT_CODE = `/* global Adobe: readonly -- Declared by the iframe.ts runtime */
/* global __html__: readonly -- Declared by the iframe.ts runtime */
if (Adobe.editorType === 'canvas') {
    Adobe.showUI(__html__);
}`;

export const CSS_CODE = `@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
* {
    margin: 0;
    font-family: "Poppins", sans-serif;
}
body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}
header {
    font-size: large;
    font-style: 600;
}
input[type="text"],
button {
    margin: 5px;
    padding: 5px;
}`;

export const JSON_CODE = `{
  "editorType": [
      "canvas"
  ],
  "icon": {
      "light": "icon-light.png",
      "dark": "icon-dark.png"
  },
  "id": "Hello World Widget",
  "main": "code.js",
  "name": "Hello World Widget",
  "type": "widget",
  "ui": "ui.html"
}`;
