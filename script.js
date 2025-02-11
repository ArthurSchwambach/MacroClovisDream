class MacroExtension {
    constructor() {
      this.id = 'macro-extension';
      this.name = 'Macro Extension';
      this.version = '1.0';
      this.macros = JSON.parse(localStorage.getItem('macros')) || [];
    }
  
    async init() {
      console.log('Macro Extension carregada!');
  
      // Configura a ação
      await OBR.action.setIcon('macro-action', 'dice'); // Ícone da ação
      await OBR.action.setTitle('macro-action', 'Macros'); // Título da ação
      await OBR.action.setWidth('macro-action', 450); // Largura do popover
      await OBR.action.setHeight('macro-action', 400); // Altura do popover
  
      // Injeta o HTML no popover
      await OBR.action.setContent('macro-action', this.createMacroUI());
  
      // Callback para quando a ação é aberta/fechada
      OBR.action.onOpenChange('macro-action', (isOpen) => {
        if (isOpen) {
          this.loadMacros();
        }
      });
    }
  
    // Cria a interface do usuário para os macros
    createMacroUI() {
      const container = document.createElement('div');
      container.innerHTML = `
        <h1>Clovisdream</h1>
        <form id="macroForm">
          <label for="macroName">Nome da Macro:</label>
          <input type="text" id="macroName" placeholder="Ex: Acerto" required>
          <label for="macroFormula">Fórmula:</label>
          <input type="text" id="macroFormula" placeholder="Ex: 1d20+5" required>
          <button type="submit" class="add-button">Adicionar Macro</button>
        </form>
        <div id="macroButtons"></div>
      `;
  
      // Aplica o CSS
      const style = document.createElement('style');
      style.textContent = `
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #2c2f33;
          color: #ffffff;
          margin: 0;
          text-align: center;
          padding: 20px;
        }
        h1 {
          color: #a29bfe;
          font-size: 2.8em;
          margin-bottom: 30px;
        }
        form {
          margin: 20px auto;
          max-width: 400px;
          background-color: #3a3d42;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
        }
        label {
          display: block;
          margin: 15px 0 5px;
          color: #dfe6e9;
          text-align: center;
        }
        input[type="text"] {
          width: 100%;
          max-width: 300px;
          padding: 10px;
          margin: 5px auto 15px;
          border: none;
          border-radius: 5px;
          background-color: #454a50;
          color: white;
          box-sizing: border-box;
          text-align: center;
        }
        .add-button {
          background-color: #6c5ce7;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1em;
          width: 100%;
          max-width: 200px;
          display: block;
          margin: 20px auto;
        }
        .add-button:hover {
          background-color: #81ecec;
        }
        #macroButtons {
          margin-top: 30px;
        }
        .macro-button {
          background-color: #8e44ad;
          color: white;
          border: none;
          padding: 8px 12px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
        }
        .macro-button:hover {
          background-color: #74b9ff;
        }
        select {
          background-color: #3a3d42;
          color: white;
          padding: 8px;
          border: none;
          border-radius: 5px;
          margin-right: 10px;
        }
      `;
      container.appendChild(style);
  
      // Adiciona o evento de submit ao formulário
      const form = container.querySelector('#macroForm');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = container.querySelector('#macroName').value;
        const formula = container.querySelector('#macroFormula').value;
  
        if (!name || !formula) {
          alert('Preencha o nome e a fórmula!');
          return;
        }
  
        this.addMacro({ name, formula });
        form.reset();
      });
  
      return container;
    }
  
    // Função para adicionar um macro
    addMacro(macro) {
      this.macros.push(macro);
      localStorage.setItem('macros', JSON.stringify(this.macros));
      this.loadMacros();
    }
  
    // Função para carregar os macros na interface
    loadMacros() {
      const buttonsContainer = document.getElementById('macroButtons');
      buttonsContainer.innerHTML = '';
  
      this.macros.forEach((macro) => {
        const button = document.createElement('button');
        button.textContent = macro.name;
        button.className = 'macro-button';
        button.onclick = () => {
          const result = this.parseAndRoll(macro.formula);
          alert(`Rolagem (${macro.formula}): ${result}`);
        };
        buttonsContainer.appendChild(button);
      });
    }
  
    // Função para rolar dados
    parseAndRoll(formula) {
      const parts = formula.split('/').map((part) => part.trim());
      let total = 0;
  
      parts.forEach((part) => {
        const match = part.match(/(\d*)d(\d+)([+-]\d+)?/);
        if (!match) throw new Error('Fórmula inválida');
  
        const count = parseInt(match[1]) || 1;
        const sides = parseInt(match[2]);
        const modifier = parseInt(match[3]) || 0;
  
        for (let i = 0; i < count; i++) {
          total += Math.floor(Math.random() * sides) + 1;
        }
        total += modifier;
      });
  
      return total;
    }
  }
  
  // Registra a extensão no Owlbear Rodeo
  if (window.OBR) {
    window.OBR.extensions.register(new MacroExtension());
  }