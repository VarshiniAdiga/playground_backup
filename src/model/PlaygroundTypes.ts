import { ReactNode } from "react";

export type EditorState = {
    isMenuBarOpen: boolean;
};

export type ControlProps = {
    children: Array<ReactNode>;
    variant: string;
    isQuiet: boolean;
    onPress: any;
};

export type SideBarState = {
    isTsPluginAllowed: boolean;
    isReactPluginAllowed: boolean;
};

export interface SideNavProps {
    children: React.ReactNode;
    variant: string;
}

export interface SideNavHeadingProps {
    children: React.ReactNode;
    label: string;
}

export interface SideNavItemProps {
    children?: React.ReactNode;
    onClick?: any;
    label?: string;
    class?: string;
}

type EditorModel = {
    [key: string]: any,
    model: any,
    state: any,
    defaultCode: string,
};

export type EditorData = {
    [key: string]: EditorModel,
    html: EditorModel,
    css: EditorModel,
    javascript: EditorModel,
    script: EditorModel,
    manifest: EditorModel,
};

type SnippetContent = {
    [key: string]: string,
    content: string,
    language: string,
};

export type SnippetStructure = {
    [key: string]: SnippetContent,
    Template: SnippetContent,
    Script: SnippetContent,
    Manifest: SnippetContent,
};

export type Tab = {
    id: string,
    name: string,
    label: string,
    language: string,
    fileName: string,
    defaultValue: string
};

export type PluginData = {
    [key: string]: string | null | undefined,
    html: string | null | undefined,
    css: string | null | undefined,
    javascript: string | null | undefined,
    script: string | null | undefined,
    manifest: string | null | undefined,
};