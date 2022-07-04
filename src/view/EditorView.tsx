import React, { Key } from "react";
import ReactDOM from "react-dom";
import Run from "@spectrum-icons/workflow/Play";
import ShowMenu from "@spectrum-icons/workflow/ShowMenu";
import Reset from "@spectrum-icons/workflow/Refresh";
import Export from "@spectrum-icons/workflow/Export";
import {
    Item,
    TabList,
    Tabs,
    Flex,
    View,
    Text,
    ActionButton,
    TooltipTrigger,
    Tooltip,
    Menu,
    MenuTrigger
} from "@adobe/react-spectrum";
import EditorViewModel from "../viewModel/EditorViewModel";
// import { Theme } from "@react-types/provider";
import "./EditorView.css";
import SideBarView from "./SideBarView";
import { EditorState, ControlProps } from "../model/PlaygroundTypes";

export default class EditorView extends React.Component<{}, EditorState> {
    containerId: string;
    editorId: string;
    editorViewModel: EditorViewModel;
    resizeObserver: any;
    constructor(props: any) {
        super(props);
        this.containerId = `playground`;
        this.editorId = `${this.containerId}-editor`;
        this.editorViewModel = new EditorViewModel();
        this.state = { isMenuBarOpen: false };
    }

    componentDidMount() {
        setTimeout(() => {
            const resizeObserver = this.editorViewModel.mount(
                document.getElementById(this.editorId)
            );
            const containerElement = document.getElementById(this.containerId);
            if (containerElement) {
                resizeObserver.observe(containerElement);
                this.resizeObserver = resizeObserver;
            }
        }, 200);
    }

    componentWillUnmount() {
        this.editorViewModel.unmount();
        this.resizeObserver.disconnect();
    }

    handleTabChange(key: any) {
        this.editorViewModel.setTab(key);
    }

    handleReset() {
        this.editorViewModel.resetCode();
    }

    handlePlay() {
        this.editorViewModel.sendPluginToParent();
    }

    handleMenu() {
        this.setState({ isMenuBarOpen: !this.state.isMenuBarOpen });
        ReactDOM.render(
            this.state.isMenuBarOpen === true ? <SideBarView /> : <div />,
            document.getElementById("sideBar")
        );
    }

    handleSharePlugin(key: Key) {
        key === "clipboard copy"
            ? this.editorViewModel.copyToClipboard()
            : this.editorViewModel.downloadPlugin();
    }

    render() {
        return (
            <Flex
                marginX="size-100"
                direction="column"
                height="100%"
                id={this.containerId}
            >
                <Flex
                    marginTop="size-125"
                    marginX="size-100"
                    direction="column"
                >
                    <Tabs
                        defaultSelectedKey={this.editorViewModel.selectedTabId}
                        onSelectionChange={this.handleTabChange.bind(this)}
                        isQuiet
                    >
                        <Flex
                            direction="row"
                            marginTop="size-100"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <TooltipTrigger delay={0}>
                                <ActionButton
                                    isQuiet
                                    onPress={this.handleMenu.bind(this)}
                                >
                                    <ShowMenu />
                                </ActionButton>
                                <Tooltip>
                                    {this.state.isMenuBarOpen
                                        ? "Hide Menu"
                                        : "Show Menu"}
                                </Tooltip>
                            </TooltipTrigger>
                            <View marginStart="size-500">
                                <TabList height="size-400">
                                    {this.editorViewModel!.tabs!.map(
                                        ({ id, name }) => (
                                            <Item key={id}>{name}</Item>
                                        )
                                    )}
                                </TabList>
                            </View>
                            <View marginStart="size-200">
                                <Control
                                    onPress={this.handlePlay.bind(this)}
                                    variant="secondary"
                                    isQuiet
                                >
                                    <Run />
                                    <Text>Run</Text>
                                </Control>
                                <Control
                                    variant="secondary"
                                    isQuiet
                                    onPress={this.handleReset.bind(this)}
                                >
                                    <Reset />
                                    <Text>Reset</Text>
                                </Control>
                                <MenuTrigger>
                                    <TooltipTrigger delay={0}>
                                        <ActionButton isQuiet>
                                            <Export />
                                        </ActionButton>
                                        <Tooltip>Share</Tooltip>
                                    </TooltipTrigger>
                                    <Menu
                                        onAction={this.handleSharePlugin.bind(
                                            this
                                        )}
                                    >
                                        <Item key="clipboard copy">
                                            Copy to clipboard
                                        </Item>
                                        <Item key="export file">
                                            Export to file
                                        </Item>
                                    </Menu>
                                </MenuTrigger>
                            </View>
                        </Flex>
                    </Tabs>
                </Flex>
                <Flex direction="row">
                    <div id="sideBar" />
                    <div id={this.editorId} className="playground-editor" />
                </Flex>
            </Flex>
        );
    }
}

class Control extends React.Component<ControlProps> {
    render() {
        const icon = this.props.children[0];
        const text = this.props.children[1];
        return (
            <TooltipTrigger delay={0}>
                <ActionButton {...this.props}>{icon}</ActionButton>
                <Tooltip>{text}</Tooltip>
            </TooltipTrigger>
        );
    }
}
