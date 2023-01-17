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
  },
  getCordsOfCell: function (cell) {
    // return las coordenadas de las celdas como numero!
    let cellId = cell.id; //'0-0'
    let idSplit = cellId.split("-"); // ['0', '0']
    return idSplit.map((id) => parseInt(id, 10)); // [0, 0]
  },
  getCellStatus: function (cell) {
    // return cell status
    return cell.getAttribute("data-status");
  },
  setCellStatus: function (cell, status) {
    // seta a cell with a specified status
    cell.className = status;
    cell.dataset.status = status;
  },
  selectCellWithCoords: function (x, y) {
    // given a specific set of coords return that cell
    return document.getElementById(`${x}-${y}`);
  },
  toggleCellStatus: function (cell) {
    // toggles cell status to opposite
    if (this.getCellStatus(cell) == "dead") {
      this.setCellStatus(cell, "alive");
    } else {
      this.setCellStatus(cell, "dead");
    }
  },
  getNeighbors: function (cell) {
    //return an array of the sorrouunding cells of a specific cell
    let neighbors = [];
    let coords = this.getCordsOfCell(cell);
    let x = coords[0];
    let y = coords[1];

    // SIDES
    neighbors.push(this.selectCellWithCoords(x - 1, y)); // left
    neighbors.push(this.selectCellWithCoords(x + 1, y)); // right
    // TOP
    neighbors.push(this.selectCellWithCoords(x - 1, y - 1)); // left
    neighbors.push(this.selectCellWithCoords(x, y - 1)); // middle
    neighbors.push(this.selectCellWithCoords(x + 1, y - 1)); // right
    // BOTTOM
    neighbors.push(this.selectCellWithCoords(x - 1, y + 1)); // left
    neighbors.push(this.selectCellWithCoords(x, y + 1)); // middle
    neighbors.push(this.selectCellWithCoords(x + 1, y + 1)); // right

    // return cells that exist (are inside the limits of boards) and that are alive
    return neighbors.filter(
      (neighbor) =>
        neighbor !== null && this.getCellStatus(neighbor) === "alive"
    );
  },
  forEachCell: function (iteratorFunc) {
    /*
      Escribí forEachCell acá. Debe visitar
      cada celda en el tablero. Para eso, llamá a la "iteratorFunc",
      y pasale a la Función la celda y sus coordenadas (x, y).
      Por ejemplo: iteratorFunc(cell, x, y)
    */
    const cells = document.querySelectorAll("td"); //NodeList
    cells.forEach((cell) => {
      let coords = this.getCordsOfCell(cell);
      iteratorFunc(cell, coords[0], coords[1]);
    });
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

    const onCellClick = (e) => {
      this.toggleCellStatus(e.target);
    };
    this.forEachCell(function (cell) {
      cell.addEventListener("click", onCellClick);
    });

    //clearBtn
    document
      .querySelector("#clear_btn")
      .addEventListener("click", () => this.clear());

    //randomBtn
    document
      .querySelector("#random_btn")
      .addEventListener("click", () => this.random());

    //stepBtn
    document
      .querySelector("#step_btn")
      .addEventListener("click", () => this.step());

    //randomBtn
    document
      .getElementById("auto_btn")
      .addEventListener("click", () => this.enableAutoPlay());
  },
  clear: function () {
    this.forEachCell((cell) => {
      this.setCellStatus(cell, "dead");
    });
  },
  step: function () {
    // La Función step() revisará la situación actual del tablero y lo actualizará, de acuerdo a las reglas del juego.
    // Hacé un bucle que determine si la celda debe estar viva o no, según el estado de sus vecinos.
    // Dentro de esta Función, deberás:

    // 1. create a counter that return the amount of live neighbors
    let cellsToToggle = [];

    // in every cell count for its live neighbours
    this.forEachCell((cell) => {
      let neighborsCount = this.getNeighbors(cell).length; //amount of live neighbors
      // if its alive and cannot keep living, push it to the cellsToToggle arr
      if (this.getCellStatus(cell) === "alive") {
        if (neighborsCount !== 2 && neighborsCount !== 3) {
          cellsToToggle.push(cell);
        }
        // if its dead and can be born, push it to the cellsToToggle arr
      } else {
        if (neighborsCount === 3) {
          cellsToToggle.push(cell);
        }
      }
    });

    // 2. Configurar el siguiente estado de todas las celdas (según la cantidad de vecinos vivos).
    cellsToToggle.forEach((cell) => this.toggleCellStatus(cell));
  },

  enableAutoPlay: function () {
    // Auto-Play comienza corriendo la Función step() automáticamente.
    // Lo hace de forma repetida durante el intervalo de tiempo configurado previamente.
    const btn = document.getElementById("auto_btn");
    if (this.stepInterval) {
      this.stopAutoPlay();
      btn.innerText = "AUTO";
    } else {
      this.stepInterval = setInterval(() => this.step(), 200);
      btn.innerText = "PAUSE";
    }
  },
  stopAutoPlay: function () {
    // clear interval with the id stored of the interval of enableAutoPlay
    clearInterval(this.stepInterval);
    // reset interval id to null
    this.stepInterval = null;
  },
  random: function () {
    this.forEachCell((cell) => {
      let random = Math.random();
      if (random < 0.5) {
        this.setCellStatus(cell, "alive");
      } else if (random > 0.5) {
        this.setCellStatus(cell, "dead");
      }
    });
  },
};

gameOfLife.createAndShowBoard();
