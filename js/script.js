const canvasHTML = document.querySelector("canvas");
const contexto = canvasHTML.getContext("2d");
const body = document.querySelector("body");
const scoreHTML = document.querySelectorAll(".score-num");
const buttons = document.querySelectorAll(".MoveButton");
const buttonOver = document.querySelector(".over");
const startModal = document.querySelector(".start-game");
const overModal = document.querySelector(".over-game");

const size = 30;
let direcao, loopId;
let score = 0;
let conteudo;

const randoms = {
  randomMinMax: (min, max) => {
    return Math.random() * (max - min) + min;
  },
  randomPos: (min, max, mult) => {
    return Math.floor(randoms.randomMinMax(min, max)) * mult;
  },
  randomColor: () => {
    return `rgb(${randoms.randomMinMax(110, 255)},${randoms.randomMinMax(
      110,
      255
    )},${randoms.randomMinMax(110, 255)})`;
  },
};

const cobrinha = [
  { x: 270, y: 270 },
  { x: 300, y: 270 },
];

const comida = [
  {
    x: randoms.randomPos(0, 20, 30),
    y: randoms.randomPos(0, 20, 30),
    cor: randoms.randomColor(),
  },
];

const classes = {
  remove: (alvos, classe) => {
    let all = document.querySelectorAll(alvos);

    all.forEach((alvo) => {
      alvo.classList.remove(classe);
    });
  },
  adiciona: (alvos, classe) => {
    let all = document.querySelectorAll(alvos);

    all.forEach((alvo) => {
      alvo.classList.add(classe);
    });
  },
};

const eventos = {
  iniciar: () => {
    body.addEventListener("keyup", eventos.teclado);
    buttons.forEach((button) => button.addEventListener("click", eventos.botoes));
  },
  teclado: (key) => {
    classes.remove("button.click", "click");
    comandos(key.key);
    !modal.verificar() && modal.desativar(startModal);
  },
  botoes: (event) => {
    event.preventDefault();
    classes.remove("button.click", "click");
    comandos(event.target.value);
    !modal.verificar() && modal.desativar(startModal);
  }
};

const desenhar = {
  iniciar: () => {
    desenhar.grid();
    desenhar.comida();
    desenhar.cobrinha();
  },
  cobrinha: () => {
    cobrinha.forEach((parte, index) => {
      contexto.fillStyle = "#566246";
      if (index == cobrinha.length - 1) {
        contexto.fillStyle = "#455135";
      }
      contexto.fillRect(parte.x, parte.y, size, size);
    });
  },
  grid: () => {
    contexto.lineWidth = 1;
    contexto.strokeStyle = "#7e7e7e21";

    for (let i = size; i < canvasHTML.height; i += size) {
      contexto.beginPath();
      contexto.lineTo(i, 0);
      contexto.lineTo(i, 600);
      contexto.stroke();

      contexto.beginPath();
      contexto.lineTo(0, i);
      contexto.lineTo(600, i);
      contexto.stroke();
    }
  },
  comida: () => {
    comida.forEach((gerado) => {
      contexto.shadowColor = gerado.cor;
      contexto.shadowBlur = 6;
      contexto.fillStyle = gerado.cor;
      contexto.fillRect(gerado.x, gerado.y, size, size);
      contexto.shadowBlur = 0;
    });
  },
};

const modal = {
  play: () => {
    conteudo =
      "<h1>Inicio</h1><p>Bem-vindo ao Snake.JS clique nas setinhas para inicar.</p>";
    startModal.innerHTML = conteudo;
    startModal.classList.remove("esconder");
  },
  over: () => {
    overModal.classList.remove("esconder");
  },
  desativar: (modal) => {
    modal.classList.add("esconder");
  },
  verificar: () => {
    return startModal.classList.contains("esconder");
  },
};

const colisoes = {
  iniciar: () => {
    colisoes.comida()
    colisoes.corpo()
    colisoes.limite()
  },
  comida: () => {
    const cabeca = cobrinha[cobrinha.length - 1];

    if (cabeca.x == comida[0].x && cabeca.y == comida[0].y) {
      cobrinha.push({ x: cabeca.x, y: cabeca.y });

      comida.push({
        x: randoms.randomPos(0, 20, 30),
        y: randoms.randomPos(0, 20, 30),
        cor: randoms.randomColor(),
      });

      score += 10;

      scoreHTML.forEach((obj) => {
        obj.textContent = score;
      });

      comida.shift();
    }
  },
  corpo: () => {
    const cabeca = cobrinha[cobrinha.length - 1];

    for (let i = 2; i < cobrinha.length - 1; i++) {
      const corpo = cobrinha[cobrinha.length - 1 - i];

      if (cabeca.x == corpo.x && cabeca.y == corpo.y) {
        game.over();
      }
    }
  },
  limite: () => {
    const cabeca = cobrinha[cobrinha.length - 1];

    if (
      cabeca.x > canvasHTML.width - size ||
      cabeca.x < 0 ||
      cabeca.y > canvasHTML.width - size ||
      cabeca.y < 0
    ) {
      game.over();
    }
  },
};

function timeoutMover() {
  if (!direcao) return;

  const cabeca = cobrinha[cobrinha.length - 1];

  if (direcao == "esquerda") {
    cobrinha.push({ x: cabeca.x - size, y: cabeca.y });
  }

  if (direcao == "direita") {
    cobrinha.push({ x: cabeca.x + size, y: cabeca.y });
  }

  if (direcao == "baixo") {
    cobrinha.push({ x: cabeca.x, y: cabeca.y + size });
  }

  if (direcao == "cima") {
    cobrinha.push({ x: cabeca.x, y: cabeca.y - size });
  }

  cobrinha.shift();
};

const comandos = (valor) => {
  if (valor == "ArrowLeft" && direcao != "direita") {
    direcao = "esquerda";
    classes.adiciona(".ArrowLeft", "click");
  }

  if (valor == "ArrowRight" && direcao != "esquerda") {
    direcao = "direita";
    classes.adiciona(".ArrowRight", "click");
  }

  if (valor == "ArrowUp" && direcao != "baixo") {
    direcao = "cima";
    classes.adiciona(".ArrowUp", "click");
  }

  if (valor == "ArrowDown" && direcao != "cima") {
    direcao = "baixo";
    classes.adiciona(".ArrowDown", "click");
  }
};

const game = {
  ativo: true,
  play: () => {
    if (!game.ativo) return;

    contexto.clearRect(0, 0, 600, 600);

    desenhar.iniciar();
    timeoutMover();
    eventos.iniciar();
    colisoes.iniciar();

    setTimeout(() => {
      game.play();
    }, 200);
  },
  over: () => {
    game.ativo = false;
    modal.over();
  },
  reiniciar: () => {
    score = 0;
    scoreHTML.forEach((obj) => (obj.textContent = score));
    direcao = null;
    cobrinha.length = 0;
    cobrinha.push({ x: 270, y: 270 }, { x: 300, y: 270 });
    comida.length = 0;
    comida.push({
      x: randoms.randomPos(0, 20, 30),
      y: randoms.randomPos(0, 20, 30),
      cor: randoms.randomColor(),
    });

    game.ativo = true;
    modal.desativar(overModal);
    game.play();
    modal.play();
  }
};

game.play();
modal.play();
buttonOver.addEventListener("click", game.reiniciar);
