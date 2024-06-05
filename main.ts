import { Plugin } from "obsidian";

export default class SyntaxCheckerPlugin extends Plugin {

	async onload() {
		const script = document.createElement("script");
		script.type = "module";
		script.src = "https://cdn.jsdelivr.net/gh/windesheim-hbo-ict/deeltaken@latest/CodeBlock/codeBlockLite.js"
		document.head.appendChild(script);
		
		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.querySelectorAll("pre > code");
			for (let i = 0; i < codeblocks.length; i++) {
				const codeblock = codeblocks[i];
				const language = codeblock.className.split("-")[1];
				const code = codeblock.innerHTML;
				element.innerHTML = `<code-block language=${language}>${code}</code-block>`;
			}
		});
	}
}
