import EditorViewModel from "./EditorViewModel";

export default class SideBarViewModel {
    apiUrl: string;
    editorViewModel: EditorViewModel;
    constructor() {
        this.apiUrl = "https://localhost:9000";
        this.editorViewModel = new EditorViewModel();
    }

    setTsFlagSetting(isTsPluginAllowed: boolean) {
        this.editorViewModel.setTsFlagSetting(isTsPluginAllowed);
    }

    setReactFlagSetting(isReactPluginAllowed: boolean) {
        this.editorViewModel.setReactFlagSetting(isReactPluginAllowed);
    }

    fetchPluginCode(pluginId: string) {
        return fetch(`${this.apiUrl}/api/plugins/${pluginId}`).then((res) =>
            res.json()
        );
    }

    async setPluginCodeInEditor(pluginId: string) {
        const pluginCode = await this.fetchPluginCode(pluginId);
        this.editorViewModel.setPluginCodeInEditor(pluginCode);
    }
}
