# Guía Definitiva: Algoritmos del Simulador de Sistemas Operativos

¡Bienvenido al manual educativo del simulador! Este proyecto fue diseñado para entender de manera visual e interactiva cómo los sistemas operativos gestionan los recursos más críticos de una computadora: el procesador (CPU), la memoria RAM y el disco duro.

A continuación, encontrarás una explicación detallada, sencilla y paso a paso de cada uno de los 10 algoritmos implementados en esta plataforma.

---

## SECCIÓN 1 — Administración de Procesos (CPU)

La administración de procesos decide **qué programa usa el procesador y por cuánto tiempo**.

### 1. Round Robin (RR)
#### ¿Qué es y para qué sirve?
Es uno de los algoritmos más justos y comunes. Asigna a cada proceso un pequeño bloque de tiempo llamado **Quantum**. Sirve para sistemas interactivos donde queremos que todos los procesos avancen de manera simultánea sin que uno solo acapare todo el procesador.

#### ¿Cómo funciona?
1. Los procesos se forman en una cola (First In, First Out).
2. El procesador atiende al primer proceso durante un tiempo máximo igual al **Quantum**.
3. Si el proceso termina antes de que expire su Quantum, abandona la CPU.
4. Si se le acaba el Quantum y no ha terminado, se pausa y se envía al final de la cola para esperar su próximo turno.
5. Se repite hasta que todos terminan.

#### Ejemplo concreto
**Procesos:** P1(Ráfaga=4), P2(Ráfaga=3), P3(Ráfaga=2) (Todos llegan en el tiempo 0)
**Quantum:** 2

| Tiempo | Proceso en CPU | Ráfaga Restante | Acción |
| :---: | :---: | :---: | :--- |
| 0 - 2 | P1 | P1=2 | P1 usa 2u, se pausa y va al final. |
| 2 - 4 | P2 | P2=1 | P2 usa 2u, se pausa y va al final. |
| 4 - 6 | P3 | P3=0 | P3 usa 2u, termina y sale. |
| 6 - 8 | P1 | P1=0 | P1 usa 2u, termina y sale. |
| 8 - 9 | P2 | P2=0 | P2 usa su 1u restante y termina. |
**Orden de ejecución:** P1 → P2 → P3 → P1 → P2

#### Cómo usarlo en la plataforma
- **Formulario:** Ingresa el tiempo de llegada y la ráfaga (tiempo total de ejecución) para cada proceso. Fija un número para el "Quantum".
- **Resultados:** Verás un Diagrama de Gantt mostrando qué proceso usa la CPU en cada instante. La tabla te mostrará métricas como el tiempo de espera y el tiempo de retorno (tiempo total desde que llegó hasta que terminó).

#### Ventajas y Desventajas
- ✅ **Ventajas:** Es justo, nadie se queda sin CPU indefinidamente. Excelente tiempo de respuesta para tareas cortas.
- ❌ **Desventajas:** Si el Quantum es muy grande, se vuelve como un FCFS. Si es muy pequeño, la computadora pierde demasiado tiempo cambiando entre procesos (cambio de contexto).

---

## SECCIÓN 2 — Reemplazo de Páginas (Memoria RAM)

Cuando la memoria RAM se llena, el SO debe expulsar una "página" (bloque de memoria) al disco duro para hacerle espacio a una nueva. Estos algoritmos deciden **cuál página es la víctima**.

### 1. FIFO (First-In, First-Out)
#### ¿Qué es y para qué sirve?
Es el algoritmo más simple. La página víctima es **la más antigua**, es decir, la primera que entró a la memoria.

#### ¿Cómo funciona?
Mantiene una cola. Cuando hay un "Fallo de Página" (la página solicitada no está en memoria y la RAM está llena), expulsa la página que está en la cabeza de la cola e inserta la nueva al final de la cola.

#### Ejemplo concreto
**Cadena:** `1, 2, 3, 1, 4` | **Marcos (Frames):** `3`
1. Entra `1`: Fallo (Memoria: [1, -, -])
2. Entra `2`: Fallo (Memoria: [1, 2, -])
3. Entra `3`: Fallo (Memoria: [1, 2, 3])
4. Piden `1`: Hit (Ya está en memoria)
5. Entra `4`: Fallo. Se reemplaza el `1` porque fue el primero en entrar. (Memoria: [4, 2, 3])

#### Cómo usarlo en la plataforma
- **Formulario:** Ingresa una cadena de números (ej. `1,2,3,1,4`) y el número de marcos (espacios en memoria).
- **Resultados:** El paso a paso mostrará cómo se van llenando los marcos. Verás claramente marcados los "Hits" (aciertos) y los "Fallos".

#### Ventajas y Desventajas
- ✅ **Ventajas:** Muy fácil de entender y de programar.
- ❌ **Desventajas:** Sufre de la Anomalía de Belady (darle más memoria puede causar *más* fallos). A veces expulsa páginas muy antiguas pero que se usan constantemente.

### 2. LRU (Least Recently Used)
#### ¿Qué es y para qué sirve?
"Menos Usada Recientemente". Expulsa la página que **lleva más tiempo sin ser consultada**. Se basa en la idea de que si no has usado algo recientemente, probablemente no lo usarás pronto.

#### ¿Cómo funciona?
Cada vez que se accede a una página, esta se marca como "la más reciente". Al haber un fallo, busca la página que tiene la marca de tiempo más vieja y la reemplaza.

#### Ejemplo concreto
**Cadena:** `1, 2, 3, 1, 4` | **Marcos:** `3`
1. Entra `1, 2, 3`: 3 Fallos (Memoria: [1, 2, 3])
2. Piden `1`: Hit. El `1` se vuelve el más reciente. Orden de antigüedad: 2 (el más viejo), 3, 1.
3. Entra `4`: Fallo. Reemplaza al `2` (es el que lleva más tiempo sin tocarse). Memoria: [1, 4, 3]

#### Cómo usarlo en la plataforma
- Ingresa tu cadena. En la tabla de resultados, la columna "Detalle" te dirá explícitamente qué página fue reemplazada. Verás que difiere de FIFO en cómo trata a las páginas que reciben "Hits".

#### Ventajas y Desventajas
- ✅ **Ventajas:** Excelente rendimiento, no sufre la Anomalía de Belady. Se acerca mucho al algoritmo óptimo.
- ❌ **Desventajas:** Costoso de implementar en hardware real porque requiere actualizar marcas de tiempo en cada acceso a memoria.

### 3. Óptimo (Optimal)
#### ¿Qué es y para qué sirve?
Es el algoritmo perfecto, pero **teórico**. Reemplaza la página que **tardará más tiempo en volver a ser usada en el futuro**.

#### ¿Cómo funciona?
Cuando hay un fallo, el algoritmo mira hacia adelante en la cadena de referencias. La página en memoria que aparezca más lejos en el futuro (o que no vuelva a aparecer jamás) es la víctima.

#### Ejemplo concreto
**Cadena:** `1, 2, 3, 4, 1, 2` | **Marcos:** `3`
1. Entra `1, 2, 3`: 3 Fallos (Memoria: [1, 2, 3])
2. Entra `4`: Fallo. Miramos el futuro: `1` y `2` se van a usar pronto. `3` no vuelve a aparecer. Reemplazamos el `3`. Memoria: [1, 2, 4]

#### Cómo usarlo en la plataforma
- Úsalo como punto de comparación. Ingresa una cadena y observa el total de fallos. Cualquier otro algoritmo (FIFO, LRU) siempre tendrá igual o más fallos que el Óptimo.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Garantiza la menor cantidad de fallos de página posible.
- ❌ **Desventajas:** ¡Es imposible de implementar en la vida real! El SO no puede ver el futuro ni saber qué páginas pedirá un programa. Sirve solo como métrica de evaluación.

### 4. Clock (Reloj / Segunda Oportunidad)
#### ¿Qué es y para qué sirve?
Es una mejora inteligente de FIFO. Usa un **bit de referencia** (0 o 1) para darle una "segunda oportunidad" a las páginas que han sido usadas, evitando expulsar una página antigua que sigue siendo útil.

#### ¿Cómo funciona?
1. Las páginas forman un círculo (un reloj). Un puntero marca la página actual.
2. Cuando una página es usada, su bit se pone en `1`.
3. Al haber un fallo, el puntero busca una víctima girando:
   - Si ve un `1`, le da una segunda oportunidad, lo cambia a `0` y avanza.
   - Si ve un `0`, esa es la víctima. La reemplaza, pone el bit de la nueva en `1` y avanza.

#### Ejemplo concreto
**Cadena:** `1, 2, 1, 3` | **Marcos:** `2`
1. Entra `1`: Fallo. Memoria: [1(bit=1), -]. Puntero en marco 2.
2. Entra `2`: Fallo. Memoria: [1(1), 2(1)]. Puntero en marco 1.
3. Piden `1`: Hit. Su bit ya es 1.
4. Entra `3`: Fallo. Puntero en marco 1. Ve a `1` con bit=1, lo pasa a 0 y avanza. Ve a `2` con bit=1, lo pasa a 0 y avanza. Vuelve al marco 1 (ahora es 0), lo expulsa. Entra `3`. Memoria: [3(1), 2(0)].

#### Cómo usarlo en la plataforma
- Al ejecutarlo, la columna de Detalles te mostrará el arreglo de bits `[1, 0, 1...]` en cada paso y dónde está el puntero. Esto hace muy fácil seguir visualmente cómo va perdonando páginas.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Más eficiente que FIFO y mucho más fácil/barato de implementar en hardware que LRU.
- ❌ **Desventajas:** Si todos los bits están en 1, el puntero da una vuelta completa perdiendo tiempo hasta que encuentra un 0.

### 5. LFU (Least Frequently Used)
#### ¿Qué es y para qué sirve?
"Menos Frecuentemente Usada". Lleva un conteo de **cuántas veces** se ha usado cada página. La que menos se usa, se va.

#### ¿Cómo funciona?
Cada vez que entra o se accede a una página, su contador suma 1. Al haber un fallo, busca la página con el contador más bajo y la expulsa. Si hay empate, suele usar FIFO para desempatar.

#### Ejemplo concreto
**Cadena:** `1, 1, 2, 3, 2, 4` | **Marcos:** `3`
1. `1` entra (Fallo, Frec=1). Piden `1` (Hit, Frec=2).
2. Entra `2` (Fallo, Frec=1). Entra `3` (Fallo, Frec=1). Memoria: [1(2), 2(1), 3(1)].
3. Piden `2`: Hit, Frec=2.
4. Entra `4`: Fallo. Frecuencias: `1=2, 2=2, 3=1`. La menor es `3`. Se expulsa el `3`.

#### Cómo usarlo en la plataforma
- Observa la columna "Detalle", allí la plataforma te imprimirá en tiempo real las frecuencias de las páginas actuales en memoria (Ej: `P1: 2x, P2: 2x, P3: 1x`).

#### Ventajas y Desventajas
- ✅ **Ventajas:** Protege las páginas que se usan de forma muy intensiva a lo largo del tiempo.
- ❌ **Desventajas:** Una página usada masivamente al inicio del programa tendrá un contador alto y nunca será expulsada, incluso si no se vuelve a usar en horas.

---

## SECCIÓN 3 — Planificación de Disco

El cabezal de un disco duro mecánico debe moverse físicamente para leer datos en diferentes "cilindros". Estos algoritmos deciden **en qué orden moverse para recorrer la menor distancia posible**.

### 1. FCFS (First-Come, First-Served)
#### ¿Qué es y para qué sirve?
El orden de llegada manda. El cabezal se mueve a los cilindros exactamente en el mismo orden en que fueron solicitados.

#### ¿Cómo funciona?
Simplemente atiende la cola. Si la cola es `98, 183, 37` y empieza en `53`, va de 53 a 98, luego a 183, y de ahí se devuelve hasta 37.

#### Ejemplo concreto
**Inicio:** `53` | **Cola:** `98, 183, 37`
- 53 → 98 (Distancia = 45)
- 98 → 183 (Distancia = 85)
- 183 → 37 (Distancia = 146)
- **Total recorrido:** 45 + 85 + 146 = 276 cilindros.

#### Cómo usarlo en la plataforma
- **Formulario:** Ingresa una lista de cilindros separados por comas y la posición inicial.
- **Resultados:** Observarás un gráfico SVG de líneas salvajes cruzando de lado a lado. La tabla te detallará la distancia exacta de cada salto.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Justo al 100%. Nadie sufre de inanición (quedarse esperando por siempre).
- ❌ **Desventajas:** Pésimo rendimiento. El cabezal rebota de extremo a extremo gastando tiempo mecánico.

### 2. SSTF (Shortest Seek Time First)
#### ¿Qué es y para qué sirve?
"El más cercano primero". Siempre atiende la solicitud que esté más cerca de la posición actual del cabezal, sin importar el orden en que llegaron.

#### ¿Cómo funciona?
Estando en el cilindro actual, revisa toda la cola, calcula las distancias y se mueve al que requiera el salto más pequeño.

#### Ejemplo concreto
**Inicio:** `53` | **Cola:** `98, 183, 37, 65`
- Desde 53, los más cercanos son 65 (dist 12) y 37 (dist 16). Va al 65.
- Desde 65, los restantes son 37 y 98. Va a 37.
- Desde 37, va a 98. Desde 98 va a 183.
- **Recorrido:** 53 → 65 → 37 → 98 → 183

#### Cómo usarlo en la plataforma
- Verás que el gráfico de recorrido es mucho más agrupado. El movimiento total será drásticamente menor que el de FCFS.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Mejora gigante en rendimiento y tiempo de respuesta en comparación con FCFS.
- ❌ **Desventajas:** Inanición. Si siguen llegando solicitudes muy cercanas, una solicitud muy lejana podría no ser atendida nunca.

### 3. SCAN (Algoritmo del Ascensor)
#### ¿Qué es y para qué sirve?
Actúa literalmente como un ascensor. Sube atendiendo a todos los que van hacia arriba hasta llegar al último piso (el final del disco). Luego baja atendiendo a todos los que van hacia abajo.

#### ¿Cómo funciona?
Requiere una "dirección" inicial. Si va hacia arriba, atiende las solicitudes mayores en orden hasta llegar al extremo del disco (ej: 199). Luego cambia de dirección y atiende las menores en orden descendente.

#### Ejemplo concreto
**Inicio:** `53` | **Dirección:** Arriba (Hacia mayores) | **Cola:** `98, 183, 37, 14`
- Atiende hacia arriba: 53 → 98 → 183
- Llega hasta el límite del disco: 183 → 199
- Cambia dirección y atiende los menores: 199 → 37 → 14
- **Recorrido:** 53 → 98 → 183 → 199 → 37 → 14

#### Cómo usarlo en la plataforma
- Selecciona la **Dirección** en el formulario. En el gráfico verás cómo la línea sube consistentemente hasta el extremo derecho, rebota en la pared de 199, y luego empieza a bajar.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Elimina la inanición de SSTF y ofrece un tiempo de espera muy uniforme para las solicitudes.
- ❌ **Desventajas:** Cuando rebota en el extremo, empieza a recorrer una zona que acaba de atender, mientras el otro extremo del disco lleva mucho tiempo esperando.

### 4. C-SCAN (Circular SCAN)
#### ¿Qué es y para qué sirve?
Mejora a SCAN pensando en un disco circular. Hace el barrido en una sola dirección. Al llegar al extremo, en lugar de regresar atendiendo, **salta inmediatamente al inicio del disco** y empieza a barrer de nuevo en la misma dirección.

#### ¿Cómo funciona?
Barre hacia arriba hasta el final (199). Luego salta directamente al cilindro 0. Desde 0, sigue barriendo hacia arriba atendiendo las solicitudes restantes.

#### Ejemplo concreto
**Inicio:** `53` | **Cola:** `98, 183, 37, 14`
- Atiende hacia arriba: 53 → 98 → 183
- Va al límite superior: 183 → 199
- **Salto circular:** 199 → 0
- Sigue hacia arriba: 0 → 14 → 37
- **Recorrido:** 53 → 98 → 183 → 199 → 0 → 14 → 37

#### Cómo usarlo en la plataforma
- El gráfico es muy característico: verás una línea diagonal cortante desde el extremo derecho (199) hasta el extremo izquierdo (0). La tabla te mostrará cómo este salto largo suma significativamente a la "distancia recorrida" total.

#### Ventajas y Desventajas
- ✅ **Ventajas:** Proveé un tiempo de espera completamente uniforme. Todos los cilindros son tratados por igual, a diferencia de SCAN que favorece a los del centro.
- ❌ **Desventajas:** El salto de 199 a 0 toma tiempo mecánico sin atender a nadie.

---

## Tabla Resumen de Algoritmos

| Categoría | Algoritmo | Propósito / Enfoque Principal | ¿Es el más eficiente? |
| :--- | :--- | :--- | :--- |
| **Procesos** | Round Robin | Justicia. Da el mismo tiempo a todos. | No. Bueno para interactividad, malo para tiempo de retorno. |
| **Memoria** | FIFO | Simplicidad. Saca al más viejo. | No. Sufre la anomalía de Belady. |
| **Memoria** | LRU | Eficiencia real. Saca al que lleva más tiempo sin usarse. | Sí, es la mejor aproximación a la realidad. |
| **Memoria** | Óptimo | Perfección teórica. Ve el futuro. | Sí, pero es imposible de programar. |
| **Memoria** | Clock | Equilibrio. Mejora FIFO sin el costo de LRU. | Muy bueno en costo/beneficio. |
| **Memoria** | LFU | Uso intensivo. Saca al menos popular. | Bueno, pero se engaña con la popularidad inicial. |
| **Disco** | FCFS | Justicia total. Atiende en orden. | No, el cabezal viaja demasiado. |
| **Disco** | SSTF | Minimizar distancia inmediata. | Sí, pero puede dejar morir de hambre a otros. |
| **Disco** | SCAN | Barrido en ambas direcciones (Ascensor). | Muy bueno, evita la inanición. |
| **Disco** | C-SCAN | Barrido en una dirección (Circular). | Excelente para asegurar tiempos de espera equitativos. |
