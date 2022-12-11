let nodos1 = 1
let nodos2 = 1

class Laberinto {
    constructor(nFilas, nCol, filInicio, colInicio, filFin, colFin, nBloques) {
        this.nFilas = nFilas
        this.nCol = nCol
        this.filInicio = filInicio
        this.colInicio = colInicio
        this.filFin = filFin
        this.colFin = colFin
        this.nBloques = nBloques + 2
        this.matriz = this.generarMatriz()
    }


    generarMatriz() {
        let matriz = Array(this.nFilas).fill().map(e => e = Array(this.nCol).fill().map(x => x = 0))
        let celdasOcupadas = [`${this.filFin}-${this.colFin}`, `${this.filInicio}-${this.colInicio}`]
        matriz[this.filFin][this.colFin] = 1
        const random = (max) => Math.floor(Math.random() * (max + 1));
        while (celdasOcupadas.length < this.nBloques) {
            let fila = random(this.nFilas - 1)
            let columna = random(this.nCol - 1)
            let celda = `${fila}-${columna}`
            if (celdasOcupadas.includes(celda)) continue
            celdasOcupadas.push(celda)
            matriz[fila][columna] = -1
        }
        return matriz
    }

    //EXPLICAR CORTO
    tieneLibre(fil, col) {
        return (this.matriz[fil][col] !== -1)
    }

    //EXPLICAR CORTO
    estadoValido(i, j) {
        return (i >= 0 &&
            i < 17 &&
            j >= 0 &&
            j < 15 &&
            this.tieneLibre(i, j))
    }

    //EXPLICAR CORTO
    tienePremio(fil, col) {
        return this.matriz[fil][col] === 1
    }
}

class Nodo {
    //EXPLICAR
    constructor(estado, padre, accion, movimientos, pasos = 0) {
        this.estado = estado
        this.padre = padre
        this.accion = accion
        this.movimientos = movimientos
        this.pasos = pasos
        this.key = this.estado[0] + '-' + this.estado[1]
    }

    //EXPLICAR CORTO
    valor(lab) {
        return Math.abs(this.estado[0] - lab.filFin) + Math.abs(this.estado[1] - lab.colFin) + this.pasos
    }

    //EXPLICAR
    generarNodoIzquierda(lab) {
        const i = this.estado[0]
        const j = this.estado[1] - 1
        if (!lab.estadoValido(i, j)) return null;
        return new Nodo(
            [i, j],
            this,
            "IZQUIERDA",
            [...this.movimientos, "IZQUIERDA"],
            this.pasos + 1
        )
    }

    generarNodoArriba(lab) {
        const i = this.estado[0] - 1
        const j = this.estado[1]
        if (!lab.estadoValido(i, j)) return null;
        return new Nodo(
            [i, j],
            this,
            "ARRIBA",
            [...this.movimientos, "ARRIBA"],
            this.pasos + 1
        )
    }

    generarNodoDerecha(lab) {
        const i = this.estado[0]
        const j = this.estado[1] + 1
        if (!lab.estadoValido(i, j)) return null;
        return new Nodo(
            [i, j],
            this,
            "DERECHA",
            [...this.movimientos, "DERECHA"],
            this.pasos + 1
        )
    }

    generarNodoAbajo(lab) {
        const i = this.estado[0] + 1
        const j = this.estado[1]
        if (!lab.estadoValido(i, j)) return null;
        return new Nodo(
            [i, j],
            this,
            "ABAJO",
            [...this.movimientos, "ABAJO"],
            this.pasos + 1
        )
    }

    //EXPLICAR CORTO
    generarHijos(lab) {
        const hijos = []
        hijos.push(this.generarNodoIzquierda(lab))
        hijos.push(this.generarNodoArriba(lab))
        hijos.push(this.generarNodoDerecha(lab))
        hijos.push(this.generarNodoAbajo(lab))
        return hijos.filter(h => h !== null)
    }

    pasosVolteados() {
        return this.movimientos.reverse().map(p => {
                if (p === "IZQUIERDA") return "DERECHA"
                if (p === "ARRIBA") return "ABAJO"
                if (p === "DERECHA") return "IZQUIERDA"
                if (p === "ABAJO") return "ARRIBA"
            }
        )
    }
}

class PriorityQueueNodos {
    //[0] nodo
    //[1] valor
    constructor(lab) {
        this.lab = lab
        this.queue = []
    }

    agregar(nodo) {
        if (this.estaVacio()) {
            this.queue.push(nodo);
        } else {
            let added = false;
            for (let i = 0; i < this.queue.length; i++) {
                if (nodo.valor(lab) < this.queue[i].valor(lab)) {
                    this.queue.splice(i, 0, nodo);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.queue.push(nodo);
            }
        }
    }

    sacar() {
        return this.queue.shift()
    }

    largo() {
        return this.queue.length
    }

    estaVacio() {
        return this.queue.length == 0
    }
}

//EXPLICAR
function mainAlgoritmo1(lab) {
    //Creacion
    // nodo inicial y final
    // map de estados ya recorridos en ambas fronteras
    // fronteras inicial y final
    const nodoRaiz = new Nodo([lab.filInicio, lab.colInicio], null, "", [])
    const nodoFin = new Nodo([lab.filFin, lab.colFin], null, "", [])
    const estadosRecorridosInicio = new Set()
    const estadosRecorridosFin = new Set()
    let fronteraInicioMap = new Map()
    let fronteraFinMap = new Map()
    let fronteraTemp;
    fronteraInicioMap.set(nodoRaiz.key, nodoRaiz)
    fronteraFinMap.set(nodoFin.key, nodoFin)


    while (fronteraInicioMap.size !== 0 && fronteraFinMap.size !== 0) {
        ////FRONTERA INICIAL
        //Chequear coincidencias en la frontera(Test-objetivo)
        for (const [key, nodo] of fronteraInicioMap) {
            if (fronteraFinMap.has(key)) {
                const nodoSolFin = fronteraFinMap.get(key)
                return {
                    movimientos: [...nodo.movimientos, ...nodoSolFin.pasosVolteados()],
                    pasos: nodo.pasos + nodoSolFin.pasos
                }
            }
        }
        //Agregar nodos en la frontera a los estados ya recorridos
        fronteraInicioMap.forEach((nodo, key) => estadosRecorridosInicio.add(key))
        //Generar nuevos hijos, que no esten ya recorridos para actualizar la frontera inicial
        fronteraTemp = new Map()
        fronteraInicioMap.forEach((nodo, key) => {
            nodo.generarHijos(lab).forEach(n => {
                if (!estadosRecorridosInicio.has(n.key)) {
                    fronteraTemp.set(n.key, n)
                }
            })
        })
        //Actualizar frontera inicial
        fronteraInicioMap = new Map(fronteraTemp)
        nodos1 += fronteraInicioMap.size


        ////FRONTERA FINAL
        //Chequear coincidencias en la frontera(Test-objetivo)
        for (const [key, nodo] of fronteraFinMap) {
            if (fronteraInicioMap.has(key)) {
                const nodoSolInicio = fronteraInicioMap.get(key)
                return {
                    movimientos: [...nodoSolInicio.movimientos, ...nodo.pasosVolteados()],
                    pasos: nodo.pasos + nodoSolInicio.pasos
                }
            }
        }
        //Agregar nodos en la frontera a los estados ya recorridos
        fronteraFinMap.forEach((nodo, key) => estadosRecorridosFin.add(key))
        //Generar nuevos hijos, que no esten ya recorridos para actualizar la frontera final
        fronteraTemp = new Map()
        fronteraFinMap.forEach((nodo, key) => {
            nodo.generarHijos(lab).forEach(n => {
                if (!estadosRecorridosFin.has(n.key)) {
                    fronteraTemp.set(n.key, n)
                }
            })
        })
        //Actualizar frontera final
        fronteraFinMap = new Map(fronteraTemp)
        nodos1 += fronteraFinMap.size
    }
    return null;
}

//EXPLICAR
function mainAlgoritmo2(lab) {
    const nodoRaiz = new Nodo([lab.filInicio, lab.colInicio], null, "", [])
    //Crear priorityQueue y map de estados recorridos
    const estadosRecorridos = new Set()
    const fronteraQueue = new PriorityQueueNodos(lab)
    fronteraQueue.agregar(nodoRaiz)
    estadosRecorridos.add(nodoRaiz.key)
    let nodoExtraido
    while (fronteraQueue.largo() !== 0) {
        //Quitar nodo de la frontera
        nodoExtraido = fronteraQueue.sacar()
        //Test-Objetivo
        if (lab.tienePremio(nodoExtraido.estado[0], nodoExtraido.estado[1])) {
            return {
                movimientos: nodoExtraido.movimientos,
                pasos: nodoExtraido.pasos
            }
        }
        //Generar hijos, agregar los que ya no se han recorridos y agregarlos a la frontera
        nodoExtraido.generarHijos(lab).forEach(n => {
            if (!estadosRecorridos.has(n.key)) {
                estadosRecorridos.add(n.key)
                fronteraQueue.agregar(n)
                nodos2 += 1
            }
        })
    }
    return null;
}


function printSquareMatrix(mat, lab) {
    let str = '';
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (i === lab.filInicio && j === lab.colInicio) {
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

//EXPLICAR CORTO
let start;
const lab = new Laberinto(17, 15, 8, 7, 15, 12, 40)

start = performance.now();
const algoritmo1 = mainAlgoritmo1(lab)
let timeTaken1 = performance.now() - start;

start = performance.now();
const algoritmo2 = mainAlgoritmo2(lab)
let timeTaken2 = performance.now() - start;

printSquareMatrix(lab.matriz, lab)



if (!algoritmo1) {
    console.log("Algoritmo1: el laberinto no tiene solucion")
    console.log(`Algoritmo1 tiempo: ${timeTaken1}ms.`)
} else {
    console.log(`Algoritmo1 tiempo: ${timeTaken1}ms.`)
    console.log(`Algoritmo1 movimientos: ${algoritmo1.movimientos}`)
    console.log(`Algoritmo1 pasos: ${algoritmo1.pasos}`)
    console.log(`Algoritmo1 nodos diferentes generados: ${nodos1}`)
}
console.log("///////////////////")
if (!algoritmo2) {
    console.log("Algoritmo2: el laberinto no tiene solucion")
    console.log(`Algoritmo2 tiempo: ${timeTaken2}ms.`)
} else {
    console.log(`Algoritmo2 tiempo: ${timeTaken2}ms.`)
    console.log(`Algoritmo2 movimientos: ${algoritmo2.movimientos}`)
    console.log(`Algoritmo2 pasos: ${algoritmo2.pasos}`)
    console.log(`Algoritmo2 nodos diferentes generados: ${nodos2}`)
}
