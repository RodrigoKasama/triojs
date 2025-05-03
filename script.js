const formas = ["🔺", "⚫", "⬛"];
const cores = ["red", "green", "purple"];
const quantidades = [1, 2, 3];
const preenchimentos = ["completo", "listrado", "vazado"];

const N_MESA = 12;


class Carta {
	constructor(id, forma, cor, quantidade, preenchimento) {
		this.id = id;
		this.forma = forma;
		this.cor = cor;
		this.quantidade = quantidade;
		this.preenchimento = preenchimento;
	}

	gerarElemento(onClick) {
		const canvas = document.createElement("canvas");
		canvas.className = "carta-canvas";
		canvas.width = 100;
		canvas.height = 140;
		canvas.dataset.id = this.id;

		canvas.addEventListener("click", () => onClick(this, canvas));

		this.desenhar(canvas.getContext("2d"));

		return canvas;
	}

	desenhar(ctx) {
		ctx.clearRect(0, 0, 100, 140);

		const yEspaco = 40;
		const yInicio = (140 - (this.quantidade - 1) * yEspaco) / 2;

		for (let i = 0; i < this.quantidade; i++) {
			const y = yInicio + i * yEspaco;
			this.desenharForma(ctx, 50, y);
		}
	}

	desenharForma(ctx, x, y) {
		ctx.save();
		ctx.translate(x, y);

		ctx.strokeStyle = this.cor;
		ctx.fillStyle = this.cor;

		ctx.beginPath();
		if (this.forma === "🔺") {
			ctx.moveTo(0, -10);
			ctx.lineTo(10, 10);
			ctx.lineTo(-10, 10);
			ctx.closePath();
		} else if (this.forma === "⚫") {
			ctx.arc(0, 0, 10, 0, 2 * Math.PI);
		} else if (this.forma === "⬛") {
			ctx.rect(-10, -10, 20, 20);
		}

		if (this.preenchimento === "completo") {
			ctx.fill();
		} else if (this.preenchimento === "vazado") {
			ctx.stroke();
		} else if (this.preenchimento === "listrado") {
			ctx.clip();
			for (let i = -10; i <= 10; i += 4) {
				ctx.beginPath();
				ctx.moveTo(-10, i);
				ctx.lineTo(10, i);
				ctx.stroke();
			}
			ctx.beginPath();
			if (this.forma === "🔺") {
				ctx.moveTo(0, -10);
				ctx.lineTo(10, 10);
				ctx.lineTo(-10, 10);
				ctx.closePath();
			} else if (this.forma === "⚫") {
				ctx.arc(0, 0, 10, 0, 2 * Math.PI);
			} else if (this.forma === "⬛") {
				ctx.rect(-10, -10, 20, 20);
			}
			ctx.stroke();
		}

		ctx.restore();
	}
}

function gerarBaralho() {
	const baralho = [];
	let id = 0;

	// O(81)
	for (const forma of formas) {
		for (const cor of cores) {
			for (const quantidade of quantidades) {
				for (const preenchimento of preenchimentos) {
					baralho.push(new Carta(id++, forma, cor, quantidade, preenchimento));
				}
			}
		}
	}

	return baralho;
}

function verificarTrio(cartas) {
	console.log("a")
	const atributos = ["forma", "cor", "quantidade", "preenchimento"];

	return atributos.every(attr => {
		const valores = cartas.map(c => c[attr]);
		return new Set(valores).size === 1 || new Set(valores).size === 3;
	});
}

function existeTrioValidoNaMesa(mesa) {
	for (let i = 0; i < mesa.length - 2; i++) {
		for (let j = i + 1; j < mesa.length - 1; j++) {
			for (let k = j + 1; k < mesa.length; k++) {
				let trio = [mesa[i], mesa[j], mesa[k]];
				if (verificarTrio(trio)) {
					return true;
				}
			}
		}
	}
	return false;
}

function renderizarMesa() {
	const mesaDiv = document.getElementById("mesa");
	mesaDiv.innerHTML = "";
	mesa.forEach(carta => {
		const el = carta.gerarElemento(selecionarCarta);
		mesaDiv.appendChild(el);
	});
	if (mesa.length ) { 

	}
}


function selecionarCarta(carta, canvas) {

	// Verifica se a carta já está selecionada
	const index = cartasSelecionadas.findIndex(c => c.id === carta.id);

	if (index >= 0) {
		cartasSelecionadas.splice(index, 1);
		canvas.classList.remove("selecionada");
	} else if (cartasSelecionadas.length < 3) {
		cartasSelecionadas.push(carta);
		canvas.classList.add("selecionada");

		// console.log("Selecionadas:", cartasSelecionadas);

		// Quando 3 cartas estão selecionadas, verifica se formam um trio
		if (cartasSelecionadas.length === 3) {


			const trioValido = 	verificarTrio(cartasSelecionadas);
			alert(trioValido ? "✅ Trio válido!" : "❌ Não é um trio.");

			if (trioValido) {

				// Coleta os indices do trio
				remIndexes = cartasSelecionadas.map(carta => { return mesa.indexOf(carta) });
				console.log("Indices a serem removidos:", remIndexes);
				
				// Remove as cartas selecionadas da mesa
				remIndexes.forEach(curr_index => { 
					mesa[curr_index] = baralho.pop()
				});

				// Caso as novas cartas não formem um trio válido, adicione mais uma carta à mesa
				while (!existeTrioValidoNaMesa(mesa) && baralho.length > 0) {
					console.log("Trio valido inexistente, adicionando mais uma carta do baralho...");
					mesa.push(baralho.pop());
				}
				// Caso não haja mais trios válidos na mesa e o baralho acabou. Avise o jogador
				if (!existeTrioValidoNaMesa(mesa)) {
					alert("Não há mais trios válidos na mesa.");
				}
				
			}

			cartasSelecionadas.length = 0;
			renderizarMesa();
		}
	}
}
const cartasSelecionadas = [];

let baralho = gerarBaralho().sort(() => Math.random() - 0.5);

let mesa = baralho.splice(0, N_MESA);
// console.log("Existe:", existeTrioValidoNaMesa(mesa));
while (!existeTrioValidoNaMesa(mesa)) {
	console.log("Trio valido inexistente, embaralhando novamente...");
	baralho = baralho.push(mesa).sort(() => Math.random() - 0.5);
	mesa = baralho.splice(0, N_MESA);
}

renderizarMesa();
