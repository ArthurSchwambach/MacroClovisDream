// Definindo uma variável global para armazenar macros
let macros = JSON.parse(localStorage.getItem('macros')) || [];

// Elementos da interface
const macroButtonsContainer = document.getElementById('macroButtons');
const macroForm = document.getElementById('macroForm');
const macroSelect = document.createElement('select');
const removeButton = document.createElement('button');

// Estilização e configuração inicial do select e botão de remoção
macroSelect.style.margin = "10px";
macroSelect.style.padding = "5px";
removeButton.textContent = "Remover Macro";
removeButton.style.backgroundColor = "#ff4d4f";
removeButton.style.color = "white";
removeButton.style.border = "none";
removeButton.style.padding = "5px 10px";
removeButton.style.borderRadius = "5px";

// Adiciona os elementos ao contêiner
macroButtonsContainer.appendChild(macroSelect);
macroButtonsContainer.appendChild(removeButton);

// Função para carregar macros no seletor
function updateMacroSelect() {
  macroSelect.innerHTML = ""; // Limpa o seletor
  macros.forEach((macro, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${macro.name} (${macro.formula})`;
    macroSelect.appendChild(option);
  });
}

// Função para remover a macro selecionada
removeButton.onclick = () => {
  const selectedIndex = macroSelect.value;
  if (selectedIndex !== "") {
    macros.splice(selectedIndex, 1);
    saveMacros();
    loadMacros();
    updateMacroSelect();
  } else {
    alert("Nenhum macro selecionado.");
  }
};

// Função para criar um botão de macro
function createMacroButton(macro) {
  const button = document.createElement('button');
  button.textContent = macro.name;
  button.className = "macro-button";
  button.style.marginRight = "10px";

  button.onclick = () => {
    try {
      const result = parseAndRoll(macro.formula);
      alert(`Rolagem (${macro.formula}): ${result}`);
    } catch (err) {
      alert("Fórmula inválida!");
    }
  };

  macroButtonsContainer.appendChild(button);
}

function parseAndRoll(formula) {
  const parts = formula.split("/").map(part => part.trim());
  let total = 0;

  parts.forEach(part => {
    const match = part.match(/(\d*)d(\d+)([+-]\d+)?/);
    if (!match) throw new Error("Fórmula inválida");

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

function saveMacros() {
  localStorage.setItem('macros', JSON.stringify(macros));
}

function loadMacros() {
  macroButtonsContainer.innerHTML = ""; // Limpa o contêiner
  macroButtonsContainer.appendChild(macroSelect); // Reanexa o seletor
  macroButtonsContainer.appendChild(removeButton); // Reanexa o botão de remoção
  macros.forEach(macro => createMacroButton(macro));
}

macroForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('macroName').value;
  const formula = document.getElementById('macroFormula').value;

  if (!name || !formula) {
    alert("Preencha o nome e a fórmula!");
    return;
  }

  macros.push({ name, formula });
  saveMacros();
  createMacroButton({ name, formula });
  updateMacroSelect();
  macroForm.reset();
});

// Inicializa macros ao carregar a extensão
updateMacroSelect();
loadMacros();
