/* =============================================
 * Banco de preguntas — Quiz de Tecnología
 * Formato: { q: pregunta, opts: [4 opciones], a: índice correcto (0-3) }
 * ============================================= */
var QUIZ_DATA = {

  mecanica: [
    { q: '¿Qué máquina simple amplifica la fuerza usando un punto de apoyo?',
      opts: ['Palanca','Polea','Tornillo','Biela'], a: 0 },
    { q: '¿Cuál es la función principal de un rodamiento?',
      opts: ['Reducir la fricción entre piezas','Aumentar la velocidad','Sellar fluidos','Transmitir electricidad'], a: 0 },
    { q: '¿Qué elemento convierte el movimiento rotatorio en lineal?',
      opts: ['Engrane','Biela','Cremallera','Cuna'], a: 2 },
    { q: '¿Qué es una transmisión por banda?',
      opts: ['Usa correa y dos poleas','Usa engranajes cónicos','Usa fluido hidráulico','Usa imanes'], a: 0 },
    { q: '¿Cuál es la función del volante de inercia en un motor?',
      opts: ['Filtrar el aceite','Almacenar y liberar energía cinética','Bombear combustible','Enfriar el motor'], a: 1 },
    { q: '¿Qué máquina simple es una rampa inclinada enrollada en un cilindro?',
      opts: ['Palanca','Polea','Biela','Tornillo'], a: 3 },
    { q: '¿Qué hace una polea simple?',
      opts: ['Aumenta la fuerza al doble','Almacena energía','Cambia la dirección de una fuerza','Reduce temperatura'], a: 2 },
    { q: '¿Cuál es la unidad del par torsional?',
      opts: ['Pascal','Kilogramo','Newton-metro','Amperio'], a: 2 },
    { q: '¿Qué componente une el pistón con el cigüeñal?',
      opts: ['Tornillo','Biela','Válvula','Engrane'], a: 1 },
    { q: '¿Qué máquina transforma movimiento rotatorio en alternativo?',
      opts: ['Polea simple','Manivela','Cremallera fija','Rodamiento'], a: 1 },
    { q: '¿Cuál es la función de la cuña?',
      opts: ['Transmitir rotación','Bombear fluidos','Separar o sostener objetos','Reducir velocidad'], a: 2 },
    { q: '¿En qué tipo de engranaje los dientes están cortados en espiral?',
      opts: ['Engrane recto','Piñón','Engrane cónico','Engrane helicoidal'], a: 3 }
  ],

  electronica: [
    { q: '¿Qué componente permite el paso de corriente en un solo sentido?',
      opts: ['Resistor','Diodo','Capacitor','Inductor'], a: 1 },
    { q: '¿Qué hace un transistor en un circuito?',
      opts: ['Almacena carga','Amplificar o conmutar señales','Convierte AC en DC','Resiste la corriente'], a: 1 },
    { q: '¿Qué unidad mide la resistencia eléctrica?',
      opts: ['Voltio','Amperio','Ohmio','Faradio'], a: 2 },
    { q: '¿Cuál es la función de un capacitor?',
      opts: ['Amplificar señales','Generar corriente','Almacenar carga eléctrica','Proteger el circuito'], a: 2 },
    { q: '¿Qué genera un inductor cuando cambia la corriente?',
      opts: ['Más corriente en el mismo sentido','Reduce la frecuencia','Una fuerza electromotriz opuesta','Almacena carga estática'], a: 2 },
    { q: '¿Qué es el voltaje?',
      opts: ['La cantidad de electrones','La resistencia del circuito','La potencia consumida','La diferencia de potencial eléctrico'], a: 3 },
    { q: '¿Para qué sirve un fusible?',
      opts: ['Amplificar la señal','Almacenar energía','Regular el voltaje','Proteger el circuito contra sobrecorriente'], a: 3 },
    { q: '¿Qué ley relaciona voltaje, corriente y resistencia?',
      opts: ['Ley de Faraday','Ley de Newton','Ley de Ohm','Principio de Arquímedes'], a: 2 },
    { q: '¿Cuánto equivale 1 Kiloohm?',
      opts: ['100 Ω','10.000 Ω','1.000.000 Ω','1.000 Ω'], a: 3 },
    { q: '¿Qué componente transforma tensión alterna de un nivel a otro?',
      opts: ['Rectificador','Transformador','Oscilador','Amplificador'], a: 1 },
    { q: '¿En un circuito en serie qué comparten todos los componentes?',
      opts: ['El mismo voltaje','La misma potencia','La misma corriente','La misma carga'], a: 2 },
    { q: '¿Qué unidad mide la capacitancia?',
      opts: ['Henrio','Ohmio','Voltio','Faradio'], a: 3 }
  ],

  informatica: [
    { q: '¿Qué es un algoritmo?',
      opts: ['Un lenguaje de programación','Un tipo de hardware','Secuencia de pasos para resolver un problema','Un protocolo de red'], a: 2 },
    { q: '¿Qué hace un compilador?',
      opts: ['Ejecuta programas directamente','Diseña interfaces','Gestiona RAM','Traduce código fuente a código máquina'], a: 3 },
    { q: '¿Qué es una variable en programación?',
      opts: ['Un tipo de bucle','Un operador lógico','Una función sin parámetros','Un espacio en memoria para almacenar datos'], a: 3 },
    { q: '¿Qué diferencia a un array de una variable simple?',
      opts: ['El array es más lento','El array solo guarda texto','No hay diferencia','El array almacena múltiples valores'], a: 3 },
    { q: '¿Qué estructura repite código mientras se cumpla una condición?',
      opts: ['Clase','Bucle','Función','Array'], a: 1 },
    { q: '¿Qué es la sintaxis en programación?',
      opts: ['El resultado de ejecutar el código','El diseño visual','La velocidad del programa','Las reglas gramaticales del lenguaje'], a: 3 },
    { q: '¿Qué es un objeto en programación orientada a objetos?',
      opts: ['Un archivo de configuración','Un tipo de bucle','Un tipo de variable numérica','Una instancia de una clase con datos y métodos'], a: 3 },
    { q: '¿Qué devuelve el operador módulo (%)?',
      opts: ['El cociente','El residuo de una división','El producto','La raíz cuadrada'], a: 1 },
    { q: '¿Qué es la recursividad?',
      opts: ['Una estructura de datos','Un tipo de variable','Un bucle infinito','Una función que se llama a sí misma'], a: 3 },
    { q: '¿Para qué sirve la notación Big O?',
      opts: ['Para medir la eficiencia de un algoritmo','Para declarar variables','Para definir clases','Para compilar código'], a: 0 },
    { q: '¿Qué hace el método sort() en un array?',
      opts: ['Busca un elemento','Agrega un elemento','Elimina el último','Ordena los elementos'], a: 3 },
    { q: '¿Qué es un Script?',
      opts: ['Un tipo de base de datos','Un protocolo de red','Un componente de hardware','Un archivo de código ejecutable'], a: 3 }
  ]

};
