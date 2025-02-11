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
    await OBR.action.setIcon('macro-action', 'dice');
    await OBR.action.setTitle('macro-action', 'Macros');
    await OBR.action.setWidth('macro-action', 450);
    await OBR.action.setHeight('macro-action', 400);

    // Injeta o HTML no popover
    const response = await fetch('index.html');
    const html = await response.text();
    await OBR.action.setContent('macro-action', html);

    // Adiciona eventos após o conteúdo ser carregado
    OBR.action.onOpenChange('macro-action', (isOpen) => {
      if (isOpen) {
        this.setupEventListeners();
        this.loadMacros();
      }
    });
  }

  setupEventListeners() {
    const form = document.getElementById('macroForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('macroName').value;
        const formula = document.getElementById('macroFormula').value;

        if (!name || !formula) {
          alert('Preencha o nome e a fórmula!');
          return;
        }

        this.addMacro({ name, formula });
        form.reset();
      });
    }
  }

  addMacro(macro) {
    this.macros.push(macro);
    localStorage.setItem('macros', JSON.stringify(this.macros));
    this.loadMacros();
  }

  loadMacros() {
    const buttonsContainer = document.getElementById('macroButtons');
    if (buttonsContainer) {
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
  }

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

if (window.OBR) {
  window.OBR.extensions.register(new MacroExtension());
}