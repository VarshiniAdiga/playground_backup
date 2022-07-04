import { Component } from "react";
import "@spectrum-web-components/sidenav/sp-sidenav.js";
import "@spectrum-web-components/sidenav/sp-sidenav-heading.js";
import "@spectrum-web-components/sidenav/sp-sidenav-item.js";
import { Checkbox } from "@adobe/react-spectrum";
import { SideBarState, SideNavProps, SideNavHeadingProps, SideNavItemProps } from "../model/PlaygroundTypes";
import SideBarViewModel from "../viewModel/SideBarViewModel";
import "./SidebarView.css";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "sp-sidenav": SideNavProps;
            "sp-sidenav-heading": SideNavHeadingProps;
            "sp-sidenav-item": SideNavItemProps;
        }
    }
}

export default class SideBarView extends Component<{}, SideBarState> {
    sideBarViewModel: SideBarViewModel;
    constructor(props: any) {
        super(props);
        this.sideBarViewModel = new SideBarViewModel();
        this.state = { isTsPluginAllowed: false, isReactPluginAllowed: false };
    }

    toggleTypeScriptSettings() {
        this.setState(
            { isTsPluginAllowed: !this.state.isTsPluginAllowed },
            () => {
                this.sideBarViewModel.setTsFlagSetting(
                    this.state.isTsPluginAllowed
                );
            }
        );
    }

    toggleReactSettings() {
        this.setState(
            { isReactPluginAllowed: !this.state.isReactPluginAllowed },
            () => {
                this.sideBarViewModel.setReactFlagSetting(
                    this.state.isReactPluginAllowed
                );
            }
        );
    }

    setPluginCodeInEditor(key: any) {
        if (
            key === "com.adobe.hz.petals.pg" ||
            key === "com.adobe.hz.managedUIDemo.pg"
        ) {
            if (!this.state.isReactPluginAllowed) {
                this.toggleReactSettings();
            }
        }
        this.sideBarViewModel.setPluginCodeInEditor(key);
    }

    render() {
        return (
            <sp-sidenav variant="multilevel">
                <sp-sidenav-heading label="Examples">
                    <sp-sidenav-item label="Widgets">
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.pollWidget.pg"
                            )}
                        >
                            Poll Widget
                        </sp-sidenav-item>
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.chatRoom.pg"
                            )}
                        >
                            Chat Room
                        </sp-sidenav-item>
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.ticTacToe.pg"
                            )}
                        >
                            TicTacToe
                        </sp-sidenav-item>
                    </sp-sidenav-item>
                    <sp-sidenav-item label="Plugins">
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.petals.pg"
                            )}
                        >
                            Petals
                        </sp-sidenav-item>
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.managedUIDemo.pg"
                            )}
                        >
                            Managed UI
                        </sp-sidenav-item>
                        <sp-sidenav-item
                            onClick={this.setPluginCodeInEditor.bind(
                                this,
                                "com.adobe.hz.createShapes.pg"
                            )}
                        >
                            Shapes Creator
                        </sp-sidenav-item>
                    </sp-sidenav-item>
                </sp-sidenav-heading>
                <sp-sidenav-heading label="Settings">
                    <sp-sidenav-item class="settings">
                        <Checkbox
                            isEmphasized
                            onChange={this.toggleTypeScriptSettings.bind(this)}
                        >
                            TS
                        </Checkbox>
                    </sp-sidenav-item>
                    <sp-sidenav-item class="settings">
                        <Checkbox
                            isSelected={this.state.isReactPluginAllowed}
                            isEmphasized
                            onChange={this.toggleReactSettings.bind(this)}
                        >
                            React
                        </Checkbox>
                    </sp-sidenav-item>
                </sp-sidenav-heading>
            </sp-sidenav>
        );
    }
}
