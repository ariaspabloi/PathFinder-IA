class Laberinto {
    constructor() {
        this.matriz = this.generarMatriz()
    }

    generarMatriz() {
        let matriz = Array(17).fill().map(e => e = Array(15).fill().map(x => x = 0))
        let celdasOcupadas = ["15-12", "8-7"]
        matriz[15][12] = 1
        const random = (max) => Math.floor(Math.random() * (max + 1));
        while (celdasOcupadas.length < 42) {
            let fila = random(16)
            let columna = random(14)
            let celda = `${fila}-${columna}`
            if (celdasOcupadas.includes(celda)) continue
            celdasOcupadas.push(celda)
            matriz[fila][columna] = -1
        }
        return matriz
    }

    tieneLibre(fil, col) {
        return this.matriz[fil][col] === 0 || this.matriz[fil][col] === 1
    }

    tienePremio(fil, col) {
        return this.matriz[fil][col] === 1
    }
}

class Nodo {
    constructor(estado, padre, accion, pasos) {
        this.estado = estado
        this.padre = padre
        this.accion = accion
        this.pasos = pasos
    }

    generarNodoIzquierda() {
        return new Nodo(
            [this.estado[0], this.estado[1] - 1],
            this,
            "IZQUIERDA",
            [...this.movimientos, "IZQUIERDA"]
        )
    }

    generarNodoArriba() {
        return new Nodo(
            [this.estado[0] - 1, this.estado[1]],
            this,
            "ARRIBA",
            [...this.movimientos, "ARRIBA"]
        )
    }

    generarNodoDerecha() {
        return new Nodo(
            [this.estado[0], this.estado[1] + 1],
            this,
            "DERECHA",
            [...this.movimientos, "DERECHA"]
        )
    }

    generarNodoAbajo() {
        return new Nodo(
            [this.estado[0] + 1, this.estado[1]],
            this,
            "ABAJO",
            [...this.movimientos, "ABAJO"]
        )
    }

    generarHijos(laberinto) {
        const hijos = []
        hijos.push(this.generarNodoIzquierda())
        hijos.push(this.generarNodoArriba())
        hijos.push(this.generarNodoDerecha())
        hijos.push(this.generarNodoAbajo())


        return hijos.filter(h => (
            h.estado[0] >= 0 &&
            h.estado[0] < 17 &&
            h.estado[1] >= 0 &&
            h.estado[1] < 15 &&
            laberinto.tieneLibre(h.estado[0], h.estado[1])
        ))
    }

}

function agregarNodosAMap(map, nodos) {
    nodos.forEach(n => !map.has(generarKey(n)) && map.set(generarKey(n), n))
}

function generarKey(nodo) {
    return nodo.estado[0] + '-' + nodo.estado[1]
}


const lab = new Laberinto()
const nodoRaiz = new Nodo([8, 7], null, "", [])
const estadosRecorridos = new Map()
let frontera = [nodoRaiz]
agregarNodosAMap(estadosRecorridos, frontera)
printSquareMatrix(lab.matriz)
while (frontera.length != 0) {
    //Generar nodos de toda la frontera
    //Dejar un solo array, sin subarrays
    //Filtrar los ya recorridos
    frontera = frontera.map(n => n.generarHijos(lab))
        .flat()
        .filter(n => !estadosRecorridos.has(generarKey(n)))
    //Filtrar que no se repitan los estados de los nodos nuevos
    frontera = frontera.filter((item, index) => frontera.indexOf(item) === index)
    //Verificar solucion
    let indexSolucion = frontera.findIndex(n => lab.tienePremio(n.estado[0], n.estado[1]))
    if (indexSolucion != -1) {
        console.log("Nodo solucion", frontera[indexSolucion])
        break
    }
    agregarNodosAMap(estadosRecorridos, frontera)
}

function printSquareMatrix(mat) {
    let str = '';
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (i === 8 && j === 7) {
                str = str.concat(' * ')
            } else if (mat[i][j] == 0) {
                str = str.concat(' _ ')
            } else if (mat[i][j] == 1) {
                str = str.concat(' # ')
            } else if (mat[i][j] == -1) {
                str = str.concat(' | ')
            }
        }
        console.log(str)
        str = '';
    }
}

console.log("FIIIIIIIN")