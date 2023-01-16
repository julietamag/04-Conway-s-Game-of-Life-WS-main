// En este repo, te ayudaremos a generar el tablero. Tendrás el código inicial para comenzar a trabajar en el proyecto. No te distraigas con los detalles; enfocate en la lógica

// Primero, veamos las dimensiones del tablero (alto y ancho)

const gameOfLife = {
  width: 12,
  height: 12,
  stepInterval: null, // Guarda el ID del intervalo de tiempo con el que se actualiza el tablero

  createAndShowBoard: function () {
    // Crea el elemento <table>
    const goltable = document.createElement("tbody");

    // Ahora, este bloque construirá la tabla HTML
    let tablehtml = "";
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    // El siguiente bloque de código agregará la tabla a #board
    const board = document.getElementById("board");
    board.appendChild(goltable);
    // Una vez que añade los elementos HTML a la página, agregale los eventos
    this.setupBoardEvents();
    this.clear();
    this.random();
    this.step();
  },

  forEachCell: function (iteratorFunc) {
    /*
      Escribí forEachCell acá. Debe visitar
      cada celda en el tablero. Para eso, llamá a la "iteratorFunc",
      y pasale a la Función la celda y sus coordenadas (x, y).
      Por ejemplo: iteratorFunc(cell, x, y)
    */
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        iteratorFunc(document.getElementById(`${x}-${y}`), x, y);
      }
    }
  },

  setupBoardEvents: function () {
    // Cada celda del tablero tiene un ID CSS con el formato "x-y"
    // en la cual "x" es el eje horizontal e "y" es el vertical.
    // Tené en cuenta esto para loopear a través de todos los IDs.
    // Asignales eventos que permitan al usuario clickear en las
    // celdas para configurar el estado inicial del juego
    // (antes de clickear "Step" o "Auto-Play").

    // 🛎 Recordá: Clickear en una celda debería cambiar su estado (entre "alive" y "dead").
    // Una celda "alive" estará pintada de rojo y una celda "dead" de gris.

    // Tené en cuenta el siguiente modelo para un click event en una sola celda (0-0).
    // 📛 Luego, discutí con tu pareja de pair-programming: ¿Cómo harías para aplicarlo a todo el tablero?

    const onCellClick = function (e) {
      // En el siguiente bloque de código, veremos cómo configurar el estilo de una celda.
      // 🛎 Recordá: this puede hacer referencia a distintas cosas.
      // Usá la consola para entender cuál es su contexto.

      if (this.dataset.status == "dead") {
        this.className = "alive";
        this.dataset.status = "alive";
      } else {
        this.className = "dead";
        this.dataset.status = "dead";
      }
    };
    this.forEachCell(function (cell) {
      cell.addEventListener("click", onCellClick);
    });
  },
  clear: function () {
    const clearBtn = document.querySelector("#clear_btn");
    clearBtn.addEventListener("click", () => {
      this.forEachCell((cell) => {
        cell.className = "dead";
        cell.dataset.status = "dead";
      });
    });
  },
  step: function () {
    const stepBtn = document.querySelector("#step_btn");
    let tablero = [];
    // La Función step() revisará la situación actual del tablero y lo actualizará, de acuerdo a las reglas del juego.
    // Hacé un bucle que determine si la celda debe estar viva o no, según el estado de sus vecinos.
    // Dentro de esta Función, deberás:
    // 1. Crear un contador para saber cuántos vecinos vivos tiene una celda.

    stepBtn.addEventListener("click", () => {
      this.forEachCell((cell, x, y) => {
        let vecinosVivos = 0;
        //recorrer cada vecino
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            //no contar a la celda actual como vecina
            // if (i === 0 && j === 0) {
            //   continue;
            // }
            
            //obtenemos las coordenadas
            const vecinoX = x + i;
            const vecinoY = y + j;
            
            if (
              vecinoX >= 0 &&
              vecinoX < this.width &&
              vecinoY >= 0 &&
              vecinoY < this.height
              ) {
                //obtenemos el estado del vecino
                const vecino = document.getElementById(`${vecinoX}-${vecinoY}`);
                if (vecino.dataset.status === "alive") {
                  vecinosVivos++;
                }
              }
              if (cell.dataset.status === "alive") {
                if (vecinosVivos < 2 || vecinosVivos > 3) {
                  tablero.push(cell);
                }
              }
              if (cell.dataset.status === "dead") {
                if (vecinosVivos === 3) {
                  tablero.push(cell);
                }
              }
            }
          }
        });
        console.log(tablero);
        // 2. Configurar el siguiente estado de todas las celdas (según la cantidad de vecinos vivos).
        // tablero.map((cell) => {
        //   if (cell.dataset.status === "alive") {
        //     cell.dataset.status = "dead";
        //     cell.className = "dead";
        //   }
        //    if (cell.dataset.status === "dead") {
        //     cell.dataset.status = "alive";
        //     cell.className = "alive";
        //   }
        // });
      });
    },

  enableAutoPlay: function () {
    // Auto-Play comienza corriendo la Función step() automáticamente.
    // Lo hace de forma repetida durante el intervalo de tiempo configurado previamente.
  },
  random: function () {
    const randomBtn = document.querySelector("#random_btn");
    randomBtn.addEventListener("click", () => {
      this.forEachCell((cell) => {
        let random = Math.random();
        if (random < 0.5) {
          cell.className = "alive";
          cell.dataset.status = "alive";
        } else if (random > 0.5) {
          cell.className = "dead";
          cell.dataset.status = "dead";
        }
      });
    });
  },
};

gameOfLife.createAndShowBoard();
