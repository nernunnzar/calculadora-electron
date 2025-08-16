window.addEventListener('DOMContentLoaded', () => {
  // Botón cerrar ventana
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.electronAPI.cerrarVentana();
    });
  }
  
  // Botón minimizar ventana
  const minBtn = document.getElementById('minimizeBtn');
  if (minBtn) {
    minBtn.addEventListener('click', () => {
      window.electronAPI.minimizarVentana();
    })
  }

  function updateScreen(value) {
    const screen = document.getElementById('screen');
    screen.style.opacity = 0;
    setTimeout(() => {
      screen.value = value;
      screen.style.opacity = 1;
    }, 100);
  }

  function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
  }

  function appendValue(value) {
    const screen = document.getElementById('screen');
    const current = screen.value;

    if (isOperator(value)) {
      if (current === '' || isOperator(current.slice(-1))) {
        return;
      }
    }

    if (value === '.') {
      const parts = current.split(/[\+\-\*\/]/);
      const lastNumber = parts[parts.length - 1];
      if (lastNumber.includes('.')) {
        return;
      }
      if (lastNumber === '') {
        updateScreen(current + '0.');
        return;
      }
    }

    updateScreen(current + value);
  }

  function clearScreen() {
    updateScreen('');
  }

  function deleteLast() {
    const screen = document.getElementById('screen');
    updateScreen(screen.value.slice(0, -1));
  }

  function calculate() {
    const screen = document.getElementById('screen');
    try {
      const result = math.evaluate(screen.value);
      if (typeof result === 'number' && isFinite(result)) {
        updateScreen(result.toString());
      } else {
        updateScreen('Error');
      }
    } catch {
      updateScreen('Error');
    }
  }

  document.addEventListener('keydown', function(event) {
    const allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/'];

    if (allowedKeys.includes(event.key)) {
      appendValue(event.key);
    } 
    else if (event.key === 'Enter') {
      calculate();
    } 
    else if (event.key === 'Backspace') {
      deleteLast();
    } 
    else if (event.key.toLowerCase() === 'c') {
      clearScreen();
    }
  });

  window.toggleTheme = function toggleTheme() {
    document.body.classList.toggle('dark');
  }

  window.appendValue = appendValue;
  window.clearScreen = clearScreen;
  window.deleteLast = deleteLast;
  window.calculate = calculate;
});
