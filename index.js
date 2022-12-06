let nodos1 =0
let nodos2 = 0


function createTable(tableData) {
    let arr = Array(17).fill().map(e => e =Array(15).fill().map(x => x = 0))
    let table = document.createElement('table');
    let tableBody = document.createElement('tbody');

    for(let i=0; i<17;i++){
        let row = document.createElement('tr');
        for(let j=0; j<15;j++){
            let cell = document.createElement('td');
            arr[i][j]=cell
            cell.className = "div1";
            cell.appendChild(document.createTextNode(""));
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(document.createElement('br'));
    let subtitulo = document.createElement('h2')
    let velocidad = document.createElement('p')
    let nodosCreados = document.createElement('p')
    let pasos = document.createElement('p')
    subtitulo.className = "subtitulo"
    velocidad.className = "velocidad"
    nodosCreados.className = "nodosCreados"
    pasos.className = "pasos"
    document.body.appendChild(subtitulo);
    document.body.appendChild(velocidad);
    document.body.appendChild(nodosCreados);
    document.body.appendChild(pasos);
    document.body.appendChild(table);
    return arr
}


const filInicio = 8
const colInicio = 7
const filFin = 15
const colFin = 12

class Laberinto {
    constructor(m1,m2) {
        this.matriz = this.generarMatriz(m1,m2)
    }


    generarMatriz(m1,m2) {
        let matriz = Array(17).fill().map(e => e = Array(15).fill().map(x => x = 0))
        let celdasOcupadas = [`${filFin}-${colFin}`, `${filInicio}-${colInicio}`]
        matriz[filFin][colFin] = 1
        const random = (max) => Math.floor(Math.random() * (max + 1));
        while (celdasOcupadas.length < 42) {
            let fila = random(16)
            let columna = random(14)
            let celda = `${fila}-${columna}`
            if (celdasOcupadas.includes(celda)) continue
            celdasOcupadas.push(celda)
            matriz[fila][columna] = -1
            m1[fila][columna].style.backgroundColor = "#010000"
            m2[fila][columna].style.backgroundColor = "#010000"
            m1[fila][columna].style.border = "4px solid #C7141B"
            m2[fila][columna].style.border = "4px solid #C7141B"
            m1[fila][columna].style.borderRadius = "18px"
            m2[fila][columna].style.borderRadius = "18px"
        }
        return matriz
    }

    tieneLibre(fil, col) {
        if(this.matriz[fil][col] === 0 || this.matriz[fil][col] === 1){
            if(fil==filInicio && col==colInicio) return true;
            if(fil==filFin && col==colFin) return true;
            htmlMatrix[fil][col].style.border="0px solid";
            htmlMatrix[fil][col].style.backgroundColor="#848484";
            return true
        }
    }

    tienePremio(fil, col) {
        return this.matriz[fil][col] === 1
    }
}

class Nodo {
    constructor(estado, padre, accion, movimientos, pasos=0) {
        this.estado = estado
        this.padre = padre
        this.accion = accion
        this.movimientos = movimientos
        this.pasos= pasos
        this.valor=Math.abs(estado[0]-filFin)+Math.abs(estado[1]-colFin)+this.pasos
    }

    generarNodoIzquierda() {
        return new Nodo(
            [this.estado[0], this.estado[1] - 1],
            this,
            "IZQUIERDA",
            [...this.movimientos, "IZQUIERDA"],
            this.pasos+1
        )
    }

    generarNodoArriba() {
        return new Nodo(
            [this.estado[0] - 1, this.estado[1]],
            this,
            "ARRIBA",
            [...this.movimientos, "ARRIBA"],
            this.pasos+1
        )
    }

    generarNodoDerecha() {
        return new Nodo(
            [this.estado[0], this.estado[1] + 1],
            this,
            "DERECHA",
            [...this.movimientos, "DERECHA"],
            this.pasos+1
        )
    }

    generarNodoAbajo() {
        return new Nodo(
            [this.estado[0] + 1, this.estado[1]],
            this,
            "ABAJO",
            [...this.movimientos, "ABAJO"],
            this.pasos+1
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

    pasosVolteados() {
        return this.movimientos.reverse().map(p => {
                if (p === "IZQUIERDA") return "DERECHA"
                if (p === "ARRIBA") return "ABAJO"
                if (p === "DERECHA") return "IZQUIERDA"
                if (p === "ABAJO") return "ARRIBA"
            }
        )
    }

    calcularDistancia(estadoFinal){
        return estadoFinal[0]+this.estado[0]+estadoFinal[1]+this.estado[1]
    }
}

function agregarNodosAMap(map, nodos) {
    nodos.forEach(n => !map.has(generarKey(n)) && map.set(generarKey(n), n))
}

function generarKey(nodo) {
    return nodo.estado[0] + '-' + nodo.estado[1]
}

function mainAlgoritmo1() {
    const nodoRaiz = new Nodo([filInicio, colInicio], null, "", [])
    const nodoFin = new Nodo([filFin, colFin], null, "", [])
    const estadosRecorridosInicio = new Map()
    const estadosRecorridosFin = new Map()
    let fronteraInicio = [nodoRaiz]
    let fronteraFin = [nodoFin]
    agregarNodosAMap(estadosRecorridosInicio, fronteraInicio)
    agregarNodosAMap(estadosRecorridosFin, fronteraFin)
    printSquareMatrix(lab.matriz)
    while (fronteraInicio.length != 0) {
        //Generar nodos de toda la frontera
        //Dejar un solo array, sin subarrays
        //Filtrar los ya recorridos
        /*
        fronteraInicio = fronteraInicio.map(n => n.generarHijos(lab))
            .flat()
            .filter(n => !estadosRecorridosInicio.has(generarKey(n)))
        fronteraFin = fronteraFin.map(n => n.generarHijos(lab))
            .flat()
            .filter(n => !estadosRecorridosFin.has(generarKey(n)))
         */

        fronteraInicio = fronteraInicio.map(n => n.generarHijos(lab)).flat()
        nodos1 += fronteraInicio.length
        fronteraInicio = fronteraInicio.filter(n => !estadosRecorridosInicio.has(generarKey(n)))

        fronteraFin = fronteraFin.map(n => n.generarHijos(lab)).flat()
        nodos1 += fronteraFin.length
        fronteraFin = fronteraFin.filter(n => !estadosRecorridosFin.has(generarKey(n)))
        //Filtrar que no se repitan los estados de los nodos nuevos
        fronteraInicio = fronteraInicio.filter((item, index) => fronteraInicio.indexOf(item) === index)
        fronteraFin = fronteraFin.filter((item, index) => fronteraFin.indexOf(item) === index)
        //Verificar solucion

        for (let nodoDeInicio of fronteraInicio) {
            for (let nodoDeFin of fronteraFin) {
                if (nodoDeInicio.estado[0] === nodoDeFin.estado[0] && nodoDeInicio.estado[1] === nodoDeFin.estado[1]) {
                    return {
                        nodoSol: [nodoDeInicio,nodoDeFin],
                        lab: lab.matriz,
                        movimientos: [...nodoDeInicio.movimientos, ...nodoDeFin.pasosVolteados()],
                        pasos: nodoDeInicio.pasos + nodoDeFin.pasos
                    }
                }
            }
        }
        agregarNodosAMap(estadosRecorridosInicio, fronteraInicio)
    }
}

function mainAlgoritmo2(lab){
    const nodoRaiz = new Nodo([8, 7], null, "", [])
    const estadosRecorridos = new Map()
    let frontera = new PriorityQueueNodos()
    frontera.agregar(nodoRaiz)
    agregarNodosAMap(estadosRecorridos, frontera.queue)
    printSquareMatrix(lab.matriz)
    while (frontera.length != 0) {
        //Generar nodos de toda la frontera
        //Dejar un solo array, sin subarrays
        //Filtrar los ya recorridos
        let nodosGenerados = frontera.sacar().generarHijos(lab).flat()
        nodos2 += nodosGenerados.length
        nodosGenerados = nodosGenerados.filter(n => !estadosRecorridos.has(generarKey(n)))
        let indexSolucion = nodosGenerados.findIndex(n => lab.tienePremio(n.estado[0], n.estado[1]))
        if (indexSolucion != -1) {
            return {
                nodoSol: [nodosGenerados[indexSolucion]],
                lab: lab.matriz,
                movimientos: nodosGenerados[indexSolucion].movimientos,
                pasos: nodosGenerados[indexSolucion].pasos
            }
        }
        agregarNodosAMap(estadosRecorridos, nodosGenerados)
        nodosGenerados.forEach(n => frontera.agregar(n))
    }
}

class PriorityQueueNodos{
    //[0] nodo
    //[1] valor
    constructor(){
        this.queue = []
    }

    agregar(nodo){
        if (this.estaVacio()) {
            this.queue.push(nodo);
        } else {
            let added = false;
            for (let i = 0; i<this.queue.length; i++) {
                if (nodo.valor < this.queue[i].valor) {
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
    sacar(){
        return this.queue.shift()
    }
    frente(){
        return this.queue[0]
    }
    largo(){
        return this.queue.length
    }
    estaVacio(){
        return this.queue.length==0
    }
}
function printSquareMatrix(mat) {
    let str = '';
    for (var i = 0; i < mat.length; i++) {
        for (var j = 0; j < mat[0].length; j++) {
            if (i === filInicio && j === colInicio) {
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

function pintarSolucion(nodosSol){
    nodosSol.forEach(n => {
        let nodoTmp = n;
        while(nodoTmp!==null){
            htmlMatrix[nodoTmp.estado[0]][nodoTmp.estado[1]].style.backgroundColor="#100D99";
            nodoTmp = nodoTmp.padre
        }
    })
    htmlMatrix[filInicio][colInicio].style.backgroundColor = "#26632E"
    htmlMatrix[filFin][colFin].style.backgroundColor = "#26632E"
}

function pintarDetalles(index,subtitulo,velocidad,nodosCreados,pasos){
    let subtituloHtml = document.querySelectorAll(".subtitulo")[index];
    let velocidadHtml = document.querySelectorAll(".velocidad")[index];
    let nodosCreadosHtml = document.querySelectorAll(".nodosCreados")[index];
    let pasosHtml = document.querySelectorAll(".pasos")[index];
    subtituloHtml.innerText = subtitulo
    velocidadHtml.innerText = velocidad
    nodosCreadosHtml.innerText = nodosCreados
    pasosHtml.innerText = pasos
}
let start = Date.now();
let timeTaken = Date.now() - start;
let htmlMatrix1 = createTable()
let htmlMatrix2 = createTable()
let htmlMatrix = htmlMatrix1
const lab = new Laberinto(htmlMatrix1,htmlMatrix2)
start = Date.now();
const algoritmo1 = mainAlgoritmo1(lab)
timeTaken = Date.now() - start;
pintarSolucion(algoritmo1.nodoSol)
pintarDetalles(0,"Algoritmo1",timeTaken + "ms",nodos1 + " nodos generados.",algoritmo1.pasos + " pasos")

htmlMatrix = htmlMatrix2
start = Date.now();
const algoritmo2 = mainAlgoritmo2(lab)
timeTaken = Date.now() - start;
pintarSolucion(algoritmo2.nodoSol)
pintarDetalles(1,"Algoritmo2",timeTaken + "ms",nodos2 + " nodos generados.",algoritmo2.pasos + " pasos")
console.log(algoritmo2.movimientos)
console.log(algoritmo2.pasos)
console.log("///////////////////")
console.log(algoritmo2.movimientos)
console.log(algoritmo2.pasos)

console.log("FIIIIIIIN")


/*
[
    [
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        0
    ],
    [
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1
    ],
    [
        0,
        0,
        0,
        0,
        -1,
        0,
        -1,
        -1,
        0,
        -1,
        0,
        -1,
        0,
        -1,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        -1,
        -1,
        0,
        0,
        0,
        -1,
        0,
        -1,
        -1,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        -1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        0,
        -1
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        -1,
        -1,
        0,
        0,
        0,
        0
    ],
    [
        0,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        1,
        0,
        0
    ],
    [
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1
    ]
]
 */

/*
[
    [
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1
    ],
    [
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        -1
    ],
    [
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        0
    ],
    [
        0,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0
    ],
    [
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        -1,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        -1,
        -1,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        -1,
        -1,
        -1,
        -1,
        0,
        0
    ],
    [
        0,
        0,
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        -1,
        -1
    ],
    [
        0,
        0,
        0,
        -1,
        0,
        0,
        0,
        0,
        -1,
        -1,
        -1,
        -1,
        0,
        0,
        0
    ]
]
 */