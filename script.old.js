const formas = ["🔺", "⚫", "⬛"];
const cores = ["red", "green", "blue"];
const quantidades = [3, 2, 1];
const preenchimentos = ["completo", "listrado", "vazado"];

class Carta {
	constructor(id, forma, cor, quantidade, preenchimento) {
		this.id = id;
		this.forma = forma;
		this.cor = cor;
		this.quantidade = quantidade;
		this.preenchimento = preenchimento;

		this.width = 100;
		this.height = 140;

	}

	gerarElemento(onClick) {
		const canvas = document.createElement("canvas");
		canvas.className = "carta-canvas";
		canvas.width = this.width;
		canvas.height = this.height;
		canvas.dataset.id = this.id;

		canvas.addEventListener("click", () => onClick(this, canvas));

		this.desenhar(canvas.getContext("2d"));

		return canvas;
	}

	desenhar(ctx) {
		ctx.clearRect(0, 0, this.width, this.height);

		const yEspaco = 40;
		const yInicio = (this.height - (this.quantidade - 1) * yEspaco) / 2;

		for (let i = 0; i < this.quantidade; i++) {
			const y = yInicio + i * yEspaco;
			this.desenharForma(ctx, 50, y);
		}
	}

	desenharForma(ctx, x, y) {
		ctx.save();
		ctx.translate(x, y);

		// DEBUG: mostra área de desenho
		//ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
		//ctx.fillRect(-50, -50, 100, 100);

		ctx.strokeStyle = this.cor;
		ctx.fillStyle = this.cor;

		// Forma base
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

			// Redesenha contorno
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

const cartasSelecionadas = [];

function verificarTrio(cartas) {
	const atributos = ["forma", "cor", "quantidade", "preenchimento"];

	return atributos.every(attr => {
		const valores = cartas.map(c => c[attr]);
		return new Set(valores).size === 1 || new Set(valores).size === 3;
	});
}

function selecionarCarta(carta, canvas) {
	const index = cartasSelecionadas.findIndex(c => c.id === carta.id);

	if (index >= 0) {
		cartasSelecionadas.splice(index, 1);
		canvas.classList.remove("selecionada");
	} else if (cartasSelecionadas.length < 3) {
		cartasSelecionadas.push(carta);
		canvas.classList.add("selecionada");

		if (cartasSelecionadas.length === 3) {
			const trioValido = verificarTrio(cartasSelecionadas);
			alert(trioValido ? "✅ Trio válido!" : "❌ Não é um trio.");
			cartasSelecionadas.length = 0;

			document.querySelectorAll(".carta-canvas").forEach(c => {
				c.classList.remove("selecionada");
			});
		}
	}
}

const baralho = gerarBaralho().sort(() => Math.random() - 0.5);
const mesa = document.getElementById("mesa");

for (let i = 0; i < 12; i++) {
	const carta = baralho[i];
	const elemento = carta.gerarElemento(selecionarCarta);
	mesa.appendChild(elemento);
}
