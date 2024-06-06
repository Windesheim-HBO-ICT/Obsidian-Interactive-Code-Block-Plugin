import { Plugin } from "obsidian";
import { CodeBlock } from "codeBlockLite";

export default class InteractiveCodeBlock extends Plugin {

	async onload() {
        window.customElements.define("code-block", CodeBlock);
		
		this.registerMarkdownPostProcessor((element, context) => {
            const ignoredLanguages = ["yaml"];
			const codeblocks = element.querySelectorAll("pre > code");
			for (let i = 0; i < codeblocks.length; i++) {
				const codeblock = codeblocks[i];
				const language = codeblock.className.split("-")[1];
				const code = codeblock.getText();

                if (ignoredLanguages.contains(language)) return;

                const el = document.createElement("code-block");
                el.setAttribute("language", language);
                el.setText(code);
                element.replaceChildren(el);
			}
		});
	}
}
