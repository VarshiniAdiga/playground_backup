import * as monaco from "monaco-editor";
import JSZip from "jszip";
import YAML from "js-yaml";
import { prettyPrint } from "html";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { types } from '../../types/TypeDefns';
import { transform } from "@babel/standalone";
import {
    HTML_CODE,
    CSS_CODE,
    JAVASCRIPT_CODE,
    SCRIPT_CODE,
    JSON_CODE,
} from "../model/ExampleScript";
import {
    EditorData,
    SnippetStructure,
    Tab,
    PluginData
} from "../model/PlaygroundTypes"

toast.configure();

export const tabs = [
    {
        id: "html",
        name: "HTML",
        label: "Template",
        language: "html",
        fileName: "index.html",
        defaultValue: HTML_CODE,
    },
    {
        id: "css",
        name: "CSS",
        label: "Style",
        language: "css",
        fileName: "style.css",
        defaultValue: CSS_CODE,
    },
    {
        id: "javascript",
        name: "UI Javascript",
        label: "UI Javascript",
        language: "javascript",
        fileName: "ui_index.js",
        defaultValue: JAVASCRIPT_CODE,
    },
    {
        id: "script",
        name: "Script",
        label: "Script",
        language: "javascript",
        fileName: "index.js",
        defaultValue: SCRIPT_CODE,
    },
    {
        id: "manifest",
        name: "Manifest",
        label: "Manifest",
        language: "json",
        fileName: "manifest.json",
        defaultValue: JSON_CODE,
    },
];

export const defaultTabId = tabs[0].id;
export const monacoTheme = {
    light: "vs",
    dark: "vs-dark",
};

export default class EditorViewModel {
    selectedTabId = defaultTabId;
    static instance: EditorViewModel;
    apiUrl!: string;
    compilerOptions!: monaco.languages.typescript.CompilerOptions;
    isReactPluginAllowed!: boolean;
    isTsPluginAllowed!: boolean;
    tabs!: Tab[];
    editorInstance: any;
    editorData!: EditorData;

    constructor() {
        if (EditorViewModel.instance instanceof EditorViewModel) {
            return EditorViewModel.instance;
        }
        this.apiUrl = "https://localhost:9000";
        this.compilerOptions =
            monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
        this.isReactPluginAllowed = false;
        this.isTsPluginAllowed = false;
        this.tabs = tabs;
        this.editorInstance = null;
        // this.addExtraLibraries();
        setTimeout(() => {
            this.editorData = this.createDefaultEditorModels();
        }, 100);
        EditorViewModel.instance = this;
    }

    mount(element: HTMLElement | null) {
        const editorInstance = monaco.editor.create(element!, {
            model: this.editorData[this.selectedTabId].model,
            theme: "light",
        });
        editorInstance.focus();
        const resizeObserver = new ResizeObserver(() => {
            editorInstance.layout();
        });
        this.editorInstance = editorInstance;
        return resizeObserver;
    }

    // async addExtraLibraries() {
    //   for (const moduleName in types) {
    //       const libSource = types[moduleName];
    //       const libUri = `ts:types/${moduleName}.d.ts`;
    //       // support intellisense - peek definitions/references
    //       monaco.languages.typescript.javascriptDefaults.addExtraLib(
    //           libSource,
    //           libUri
    //       );
    //       monaco.editor.createModel(
    //           libSource,
    //           "typescript",
    //           monaco.Uri.parse(libUri)
    //       );
    //   }
    // }

    createDefaultEditorModels() {
        const editorData: EditorData = {
            html: { model: null, state: null, defaultCode: "" },
            css: { model: null, state: null, defaultCode: "" },
            javascript: { model: null, state: null, defaultCode: "" },
            script: { model: null, state: null, defaultCode: "" },
            manifest: { model: null, state: null, defaultCode: "" },
        };
        for (const { id, language, defaultValue } of tabs) {
            editorData[id] = { model: null, state: null, defaultCode: "" };
            editorData[id].model = monaco.editor.createModel(
                defaultValue,
                language
            );
            editorData[id].defaultCode = defaultValue;
        }
        return editorData;
    }

    unmount() {
        this.editorInstance.dispose();
    }

    disableDefaultIntellisense() {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noLib: true,
            allowNonTsExtensions: true,
        });
    }

    enableDefaultIntellisense() {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
            this.compilerOptions
        );
    }

    downloadPlugin() {
        const zip = new JSZip();
        const zipFolder = zip.folder("Playground_Plugin");
        var pluginCode = "";
        for (let { id, fileName } of tabs) {
            if (id === "css" || id === "javascript") {
                continue;
            }
            if (id === "html") {
                pluginCode = this.generateMergedUiFile();
            } else {
                pluginCode = this.editorData[id].model.getValue();
            }
            if (id === "script") {
                if (this.isReactPluginAllowed && this.isTsPluginAllowed) {
                    fileName =
                        fileName.substring(0, fileName.lastIndexOf(".")) +
                        ".tsx";
                } else if (
                    this.isReactPluginAllowed &&
                    !this.isTsPluginAllowed
                ) {
                    fileName =
                        fileName.substring(0, fileName.lastIndexOf(".")) +
                        ".jsx";
                } else if (
                    !this.isReactPluginAllowed &&
                    this.isTsPluginAllowed
                ) {
                    fileName =
                        fileName.substring(0, fileName.lastIndexOf(".")) +
                        ".ts";
                }
            }
            zipFolder!.file(fileName, pluginCode);
        }
        zip.generateAsync({ type: "blob" }).then(function (content) {
            var blob = new Blob([content], { type: "application/zip" });
            var url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = "Playground_Plugin.zip";
            anchor.setAttribute("style", "display: none");
            anchor.click();
        });
    }

    resetCode() {
        for (const { id } of tabs) {
            const tabData = this.editorData[id];
            tabData.model.setValue(tabData.defaultCode);
        }
    }

    sendPluginToParent() {
        const pluginData: PluginData = {
            html: "",
            css: "",
            javascript: "",
            script: "",
            manifest: "",
        };
        for (const { id } of tabs) {
            if (id !== "css" && id !== "javascript") {
                pluginData[id] = this.editorData[id].model.getValue();
            }
        }
        pluginData["html"] = this.generateMergedUiFile();
        var iframe = document.createElement("iframe");
        iframe.srcdoc = `<html><script>() => {${pluginData["script"]}}</script></html>`;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        var hasErrorOccurred = false;
        const scriptCode = pluginData["script"] || "";
        iframe.contentWindow!.onerror = async (error) => {
            if (error.toString().includes("Unexpected token '<'")) {
                if (this.isReactPluginAllowed) {
                    // import(/* webpackChunkName: "babel-standalone" */ '@babel/standalone').then(babel => {
                    //   // pluginData["script"] = babel.transform(pluginData["script"], { presets: ["react", "es2015", "typescript"], filename: "example.tsx" }.code)
                    //   // window.parent.postMessage(pluginData, '*');
                    // });
                    pluginData["script"] = transform(scriptCode, {
                        presets: ["react", "es2015", "typescript"],
                        filename: "example.tsx",
                    }).code;
                } else {
                    hasErrorOccurred = true;
                    toast.error(
                        "Looks like a react plugin, enable react settings and try again!!",
                        { autoClose: false }
                    );
                }
            } else if (error.toString().includes("Unexpected token ':'")) {
                if (this.isTsPluginAllowed) {
                    pluginData["script"] = transform(scriptCode, {
                        presets: ["react", "es2015", "typescript"],
                        filename: "example.tsx",
                    }).code;
                } else {
                    hasErrorOccurred = true;
                    toast.error(
                        "Looks like a ts plugin, enable ts settings and try again!!",
                        { autoClose: false }
                    );
                }
            } else {
                hasErrorOccurred = true;
                toast.error(error.toString(), { autoClose: false });
            }
        };
        iframe.contentWindow!.onload = () => {
            if (!hasErrorOccurred) {
                window.parent.postMessage(pluginData, "*");
            }
        };
    }

    createSnippetFromPlugin() {
        var snippet: SnippetStructure = {
            Template: { content: "", language: "" },
            Script: { content: "", language: "" },
            Manifest: { content: "", language: "" },
        };
        for (var { id, label, language } of tabs) {
            if (id !== "css" && id !== "javascript") {
                language =
                    id === "script" && this.isTsPluginAllowed
                        ? "typescript"
                        : language;
                snippet[label] = {
                    content: this.editorData[id].model.getValue(),
                    language: language,
                };
            }
            snippet["Template"] = {
                content: this.generateMergedUiFile(),
                language: "html",
            };
        }
        return YAML.dump(snippet);
    }

    copyToClipboard() {
        const yamlSnippet = this.createSnippetFromPlugin();
        navigator.clipboard
            .writeText(yamlSnippet)
            .then(() =>
                toast.success("Copied to clipboard", { autoClose: false })
            )
            .catch(() =>
                toast.error("Copy to clipboard failed", { autoClose: false })
            );
    }

    setReactFlagSetting(isReactPluginAllowed: boolean) {
        this.isReactPluginAllowed = isReactPluginAllowed;
    }

    setTsFlagSetting(isTsPluginAllowed: boolean) {
        this.isTsPluginAllowed = isTsPluginAllowed;
    }

    async setPluginCodeInEditor(pluginCode: any) {
        for (const { id } of tabs) {
            if (id !== "manifest" && id !== "script") {
                this.editorData[id].model.setValue(pluginCode.ui[id]);
            } else {
                this.editorData[id].model.setValue(pluginCode[id]);
            }
        }
    }

    saveTab(editorInstance: any, id: string) {
        const currTab = this.editorData[id];
        currTab.model = editorInstance.getModel();
        currTab.state = editorInstance.saveViewState();
    }

    restoreTab(editorInstance: any, id: string) {
        const newTab = this.editorData[id];
        editorInstance.setModel(newTab.model);
        editorInstance.restoreViewState(newTab.state);
    }

    generateMergedUiFile() {
        var htmlCode = this.editorData["html"].model.getValue();
        const cssCode = this.editorData["css"].model.getValue();
        const uiJsCode = this.editorData["javascript"].model.getValue();
        const bodyTagIndex = htmlCode.lastIndexOf("<body>");
        if (bodyTagIndex !== -1) {
            htmlCode = prettyPrint(
                htmlCode.substring(0, bodyTagIndex + 6) +
                    `\n<style>${"\n" + cssCode + "\n"}</style>` +
                    `\n<script>${"\n" + uiJsCode + "\n"}</script>` +
                    htmlCode.substring(bodyTagIndex + 6)
            );
        }
        return htmlCode;
    }

    setTab(id: string) {
        id === "javascript"
            ? this.disableDefaultIntellisense()
            : this.enableDefaultIntellisense();
        this.saveTab(this.editorInstance, this.selectedTabId);
        this.restoreTab(this.editorInstance, id);
        this.editorInstance?.focus();
        this.selectedTabId = id;
    }
}
