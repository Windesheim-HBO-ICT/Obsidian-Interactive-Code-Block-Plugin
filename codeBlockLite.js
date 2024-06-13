import { requestUrl } from "obsidian";

export class CodeBlock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.initialized = false;
    }

    connectedCallback() {
        // Initialize the component after the browser has finished rendering
        // This is necessary because we need the innerHTML of the component to be available
        window.requestAnimationFrame(() => {
            if (this.initialized) return;
            setTimeout(() => {
                this.init();
            });
        })
    }

    init() {
        this.initProperties();
        this.render();
        this.initializeCodeRunner();
        this.initialized = true;
    }

    initProperties() {
        this.disabled = this.getAttribute('read-only') !== null;
        this.language = this.getAttribute('language');

        const sandbox = document.createElement('div');

        let rawCode = this.getText();
        // Create a sandbox element to parse HTML entities (e.g. &lt;)
        (rawCode.match(/&.+;/ig) || []).forEach(entity => {
            // Insert the HTML entity as HTML in an HTML element:
            sandbox.setText(entity);

            // Retrieve the HTML elements innerText to get the parsed entity (the actual character):
            rawCode = rawCode.replace(entity, sandbox.getText());
        });

        this.code = rawCode;

        sandbox.remove();

        this.replaceWith = '';
    }

    render() {
        // Clear the shadow root
        this.shadowRoot.empty();

        // Create the style element
        const style = document.createElement('style');
        style.textContent = `
            .minimal {
                margin: 0 !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                border: none !important;
            }
            .coderunnerContainer {
                overflow: auto;
                resize: vertical;
                padding: 0 1rem;
            }
            .flexCol {
                border: 1px solid #ddd;
                margin: 1rem 0;
                display: flex;
                flex-direction: column;
                position: relative;
            }
        select {
            width: 20%;
            padding: 0.5rem;
            min-width: 100px;
        }
            .coderunnerHeader {
                display: flex;
                border-bottom: 1px solid #ddd;
                width: 100%;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 0.75rem 1.25rem;
            }
            .absolute {
                position: absolute;
            }
            .runButton {
                z-index: 25;
                top: 0.75rem;
                right: 1.25rem; 
                cursor: pointer;
                background: none;
                border: none;
            }
            .coderunnerOutputContainer {
                border-top: 1px solid #ddd;
                padding: 0.3rem 1rem;
            }
            .flexRow {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .clearButton {
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.25rem;
                color: #ff0000;
                font-weight: 700;
            }
            .coderunnerResult {
                padding: 1.25rem;
                border-radius: 0.5rem;
            }
            .hidden {
                display: none;
            }
            .previewWarning {
                color: gray;
                margin: 0 1rem;
            }
        `;

        // Create the main container
        const mainContainer = document.createElement('div');
        mainContainer.classList.add('flexCol');

        // Conditionally create and append the run button
        if (!this.disabled) {
            const runButton = this.createRunButton(true);
            mainContainer.appendChild(runButton);
        }

        // Create the preview warning
        const previewWarning = document.createElement('div');
        previewWarning.classList.add('previewWarning');
        previewWarning.textContent = 'Read only editor preview, niet representatief voor de web interface';
        mainContainer.appendChild(previewWarning);

        // Create the code pre element
        const codePre = document.createElement('pre');
        codePre.id = 'code';
        codePre.classList.add('coderunnerContainer');
        codePre.textContent = this.code;
        mainContainer.appendChild(codePre);

        // Create the output container
        const outputContainer = document.createElement('div');
        outputContainer.id = 'outputContainer';
        outputContainer.classList.add('coderunnerOutputContainer', 'hidden');

        // Create the flex row for output header
        const outputHeader = document.createElement('div');
        outputHeader.classList.add('flexRow');

        // Create and append the output header elements
        const outputTitle = document.createElement('h3');
        outputTitle.textContent = 'Output:';
        outputHeader.appendChild(outputTitle);

        const clearButton = document.createElement('button');
        clearButton.id = 'clearButton';
        clearButton.classList.add('clearButton');
        clearButton.textContent = 'X';
        outputHeader.appendChild(clearButton);

        // Append the header and other elements to the output container
        outputContainer.appendChild(outputHeader);
        outputContainer.appendChild(document.createElement('hr'));

        const outputPre = document.createElement('pre');
        outputPre.id = 'output';
        outputPre.classList.add('coderunnerResult');
        outputContainer.appendChild(outputPre);

        mainContainer.appendChild(outputContainer);

        // Append the main container to the shadow root
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(mainContainer);
    }

    createRunButton(absolute) {
        const button = document.createElement('button');
        button.id = 'runButton';
        button.className = absolute ? 'runButton absolute' : 'runButton';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '32px');
        svg.setAttribute('height', '32px');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'lightgreen');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('transform', 'rotate(90)');
        svg.setAttribute('stroke', '#2afa00');

        const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g1.id = 'SVGRepo_bgCarrier';
        g1.setAttribute('stroke-width', '0');

        const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g2.id = 'SVGRepo_tracerCarrier';
        g2.setAttribute('stroke-linecap', 'round');
        g2.setAttribute('stroke-linejoin', 'round');
        g2.setAttribute('stroke', '#CCCCCC');
        g2.setAttribute('stroke-width', '0.048');

        const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g3.id = 'SVGRepo_iconCarrier';

        const g4 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g4.id = 'Shape / Triangle';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.id = 'Vector';
        path.setAttribute('d', 'M4.37891 15.1999C3.46947 16.775 3.01489 17.5634 3.08281 18.2097C3.14206 18.7734 3.43792 19.2851 3.89648 19.6182C4.42204 20.0001 5.3309 20.0001 7.14853 20.0001H16.8515C18.6691 20.0001 19.5778 20.0001 20.1034 19.6182C20.5619 19.2851 20.8579 18.7734 20.9172 18.2097C20.9851 17.5634 20.5307 16.775 19.6212 15.1999L14.7715 6.79986C13.8621 5.22468 13.4071 4.43722 12.8135 4.17291C12.2957 3.94236 11.704 3.94236 11.1862 4.17291C10.5928 4.43711 10.1381 5.22458 9.22946 6.79845L4.37891 15.1999Z');
        path.setAttribute('stroke', '#2afa00');
        path.setAttribute('stroke-width', '2.4');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');

        g4.appendChild(path);
        g3.appendChild(g4);
        svg.appendChild(g1);
        svg.appendChild(g2);
        svg.appendChild(g3);
        button.appendChild(svg);

        return button;
    }

    initializeCodeRunner() {
        if (this.disabled)
            return;
        const runButton = this.shadowRoot.getElementById('runButton');
        const clearButton = this.shadowRoot.getElementById('clearButton');

        // Event listener for the clear button
        clearButton.addEventListener('click', () => {
            if (this.shadowRoot.getElementById('output').getText() === 'Running...')
                return;
            this.shadowRoot.getElementById('output').replaceWith('');
            this.shadowRoot.getElementById('outputContainer').classList.add('hidden');
        });

        // Event listener for the run button
        runButton.addEventListener('click', async (event) => {
            event.preventDefault();

            // Prepare data to send to the server
            const requestData = {
                language: this.language,
                code: this.code
            };

            // Clear the result frame before making a new request
            this.setResults('Running...');

            // Make a POST request to the server
            await requestUrl({ 
                url: 'http://localhost:8080/code',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
                .then(response => response.text)
                .then(result => {
                    // Display the result received from the server
                    this.setResults(result);
                })
                .catch(error => {
                    // Log the error
                    console.error('Error:', error);
                    this.setResults('An error occurred. Please try again.');
                });
        });
    }

    setResults(result) {
        const output = this.shadowRoot.getElementById('output');
        const outputContainer = this.shadowRoot.getElementById('outputContainer');
        console.log(output);
        outputContainer.classList.remove('hidden');
        output.setText(result);
    }
}

