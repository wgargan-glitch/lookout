export type ParkEs = {
  tagline: string;
  description: string;
  state?: string;
  region?: string;
};

export const LATAM_STATE_ES: Record<string, string> = {
  Mexico: "México",
  Peru: "Perú",
  Panama: "Panamá",
  Brazil: "Brasil",
  "El Salvador": "El Salvador",
  Honduras: "Honduras",
  Nicaragua: "Nicaragua",
  "Dominican Republic": "República Dominicana",
};

export const LATAM_REGION_ES: Record<string, string> = {
  "Mexico & Baja": "México y Baja",
  "Central America": "Centroamérica",
  Andes: "Andes",
  Brazil: "Brasil",
  "Southern Cone": "Cono Sur",
};

/** Latin American Spanish copy for LatAm parks. Names stay official. */
export const LATAM_ES: Record<string, ParkEs> = {
  "san-pedro-martir": {
    tagline: "El pino alto de Baja, un observatorio y un camino que los autobuses se saltan.",
    description: "Ensenada es el pueblo. El camino del parque sube por la sierra. Los anfitriones dejan autos que ya conocen el ripio y una noche fría en junio.",
  },
  "constitucion-1857": {
    tagline: "Una laguna de granito en la sierra, a un día de la frontera.",
    description: "Otra vez Ensenada, y después la tierra. El lago es el picnic. Quieres algo que aguante el último kilómetro lleno de baches.",
  },
  "cabo-pulmo": {
    tagline: "Un arrecife para snorkel y un pueblo que es la puerta.",
    description: "La Ribera o el pueblo de Cabo Pulmo. El parque es agua. El auto es para el East Cape y la hora en que la arena todavía está firme.",
  },
  "cumbres-monterrey": {
    tagline: "Un cañón encima de una ciudad, cascadas si llovió.",
    description: "Santiago, Nuevo León. Chipinque es el lado de la ciudad. Los anfitriones saben qué cascada todavía tiene cajón después de las 10.",
  },
  "pico-orizaba": {
    tagline: "La montaña más alta de México, un camino al refugio, un pueblo que conoce el hielo.",
    description: "Tlachichuca es la puerta clásica. El volcán se camina. El auto es para el refugio y el descenso, que es peor que la subida.",
  },
  palenque: {
    tagline: "Una ciudad en la selva, monos aulladores en la boletería.",
    description: "El pueblo de Palenque. Las ruinas son el parque. Un auto para el sitio y el camino a Misol-Ha antes de los autobuses.",
  },
  sumidero: {
    tagline: "Un cañón que se navega, miradores que se manejan.",
    description: "Chiapa de Corzo es el pueblo de las lanchas. Los miradores son un camino de cresta. Los anfitriones dejan un auto que hace las dos cosas antes de comer.",
  },
  basaseachi: {
    tagline: "Tierra de las Barrancas del Cobre, una cascada, Creel para las llaves.",
    description: "Creel es el pueblo del tren y el porche. El cañón es una semana. Quieres algo que aguante tierra y una noche fresca a 2.300 metros.",
  },
  "sian-kaan": {
    tagline: "Una biósfera al sur de Tulum, lagunas, un camino que se rinde.",
    description: "Tulum o Felipe Carrillo Puerto. Casi toda la reserva es lancha. El auto es para la puerta y la playa que los autobuses todavía no encontraron.",
  },
  "nevado-toluca": {
    tagline: "Un cráter con lagunas, a una hora de Toluca si el paso está abierto.",
    description: "Toluca o Zinacantepec. El camino sube hasta el estacionamiento del cráter. Quieres algo que aguante altitud y un viento que no es opcional.",
  },
  "izta-popo": {
    tagline: "Dos volcanes al lado de la capital, un paso si no hay nieve.",
    description: "Amecameca. El parque es el paso de Cortés. El auto es para el amanecer y el día en que el Popo está despierto.",
  },
  "manuel-antonio": {
    tagline: "El parque famoso más chico, una playa, un perezoso si hay suerte.",
    description: "Quepos. Los boletos se agotan. El auto es para la hora de la puerta y el día que dejas la playa por la costera.",
  },
  arenal: {
    tagline: "Un cono que antes brillaba, un lago, puentes colgantes.",
    description: "La Fortuna. El volcán es un sendero y un mirador. Los anfitriones dejan un auto que aguanta una lluvia que no para.",
  },
  corcovado: {
    tagline: "La península de Osa, si todavía tienes 4x4 y tabla de mareas.",
    description: "Puerto Jiménez. El parque se camina y hay estación de guardaparques. El auto es para el camino de la península, que no siempre es camino.",
  },
  "rincon-vieja": {
    tagline: "Ollas de lodo, bosque seco, el calor de Guanacaste.",
    description: "Liberia es el pueblo con aeropuerto. El parque es un ramal de tierra. Los anfitriones esperan polvo y un chapuzón en la cascada.",
  },
  tenorio: {
    tagline: "Río Celeste, si la lluvia no lo puso café.",
    description: "Bijagua. El río azul es el producto. Un auto para el estacionamiento que se llena a las 8.",
  },
  chirripo: {
    tagline: "El techo de Costa Rica, una cumbre que se camina antes del alba.",
    description: "San Gerardo de Rivas. Permisos para el refugio. El auto se queda en el pueblo.",
  },
  baru: {
    tagline: "Dos océanos desde una cumbre, si se levanta la nube.",
    description: "Boquete es el pueblo del café y las noches frescas. El camino es un rumor de 4x4. Los anfitriones saben qué hora todavía tiene vista.",
  },
  tikal: {
    tagline: "Templos sobre el dosel, monos aulladores de despertador.",
    description: "Flores / Santa Elena. El parque son las ruinas. Un auto para la entrada al amanecer y la isla después.",
  },
  "el-imposible": {
    tagline: "El parque más salvaje de El Salvador, un camino de sierra.",
    description: "Tacuba. El parque es bosque y un río. Quieres algo que aguante tierra y una pendiente que no es un rumor.",
  },
  "los-volcanes": {
    tagline: "Santa Ana, Izalco y Cerro Verde, tres conos en un día.",
    description: "El Congo o Santa Ana. El cráter de Santa Ana es la caminata. El auto es para el parque y el café después.",
  },
  "la-tigra": {
    tagline: "Bosque nublado encima de Tegucigalpa, si la nube deja ver.",
    description: "Tegucigalpa. Jutiapa es la puerta más usada. Un auto para el amanecer y el descenso de niebla.",
  },
  celaque: {
    tagline: "El techo de Honduras, un pueblo colonial para las llaves.",
    description: "Gracias, Lempira. El parque es el cerro. Los anfitriones dejan un auto que ya vio un camino de pueblo.",
  },
  masaya: {
    tagline: "Un cráter que se maneja hasta el borde, si el gas lo permite.",
    description: "Masaya. El mirador del Santiago es el producto. Un auto para el parque y Granada después.",
  },
  "los-haitises": {
    tagline: "Mogotes, manglar, un parque que se recorre en lancha.",
    description: "Sabana de la Mar o Samaná. Casi todo el parque es agua. El auto es para el muelle y el pueblo.",
  },
  cotopaxi: {
    tagline: "Un volcán en el ecuador que sigue pareciendo un dibujo.",
    description: "Latacunga. El camino al refugio es el viaje. Quieres sentido de altitud y una chaqueta en julio.",
  },
  cajas: {
    tagline: "Mil lagunas en el camino a Cuenca.",
    description: "Cuenca. El parque está sobre la carretera. Los anfitriones dejan un auto que aguanta neblina y una trucha a mediodía.",
  },
  huascaran: {
    tagline: "La Cordillera Blanca, un pico en el billete, un pueblo que ya está alto.",
    description: "Huaraz. Las lagunas son un día de tierra. Quieres algo que haya visto 4.000 metros y un colectivo que no es un auto.",
  },
  paracas: {
    tagline: "Una costa desértica, una playa roja, lanchas a las islas.",
    description: "El pueblo de Paracas. El camino de la reserva es el circuito. Los anfitriones dejan agua; la neblina hace el resto.",
  },
  tayrona: {
    tagline: "Selva caribe, una playa a la que se camina, los autos se quedan en la puerta.",
    description: "Santa Marta. El Zaino es la entrada. El auto es para la puerta y Taganga después, no para la arena.",
  },
  "los-nevados": {
    tagline: "Páramo, palmas de cera abajo en el valle, un volcán si la nube deja.",
    description: "Manizales o Salento. El camino del parque es páramo. Los anfitriones esperan una lluvia que es una estación.",
  },
  "el-cocuy": {
    tagline: "Glaciares de la Sierra Nevada, un pueblo que ya está alto.",
    description: "El Cocuy o Güicán. El parque es caminata. El auto es para el pueblo y el tramo de tierra hasta la entrada.",
  },
  sajama: {
    tagline: "El parque más viejo de Bolivia, un volcán, géiseres en el altiplano.",
    description: "El pueblo de Sajama. La montaña es el horizonte. Un auto que aguante ripio y una noche bajo cero en verano.",
  },
  iguacu: {
    tagline: "Las cataratas del lado brasileño, una pasarela hacia el ruido.",
    description: "Foz do Iguaçu. El bus del parque es el último kilómetro. El auto es para la puerta y el parque de aves después.",
  },
  "chapada-diamantina": {
    tagline: "Meseta, cuevas, una cascada en la que te puedes parar detrás.",
    description: "Lençóis es el pueblo. El parque es una semana de tierra. Los anfitriones dejan un auto que ya fue al inicio de Vale do Pati.",
  },
  "lencois-maranhenses": {
    tagline: "Dunas blancas, lagunas de lluvia, un 4x4 que no es opcional.",
    description: "Barreirinhas. Las dunas son el parque. Llegas al borde y caminas. Los anfitriones conocen la marea del cruce del río.",
  },
  "chapada-veadeiros": {
    tagline: "Cerrado, cuarcita, una cascada que es una escalera.",
    description: "Alto Paraíso de Goiás. São Jorge está más cerca de la puerta. Un auto para la tierra y la altitud que sorprende a quien viene de la costa.",
  },
  "serra-orgaos": {
    tagline: "Dedos de granito sobre Río, un sendero que empieza en un suburbio.",
    description: "Teresópolis o Petrópolis. El Dedo de Deus es la postal. Los anfitriones dejan un auto que cabe en una calle de pueblo de montaña.",
  },
  itatiaia: {
    tagline: "El primer parque nacional de Brasil, una meseta, agulhas negras.",
    description: "Itatiaia o Penedo. La parte alta es un camino de tierra. Quieres algo que aguante neblina y una noche fría cerca de São Paulo.",
  },
  "aparados-serra": {
    tagline: "Cañones en la meseta gaucha, un borde al que se llega en auto.",
    description: "Cambará do Sul. Itaimbezinho es el corte. Los anfitriones esperan niebla y una chimenea después.",
  },
  pantanal: {
    tagline: "Un humedal del tamaño de un país, jaguares si el camino está abierto.",
    description: "Poconé o Cuiabá. La Transpantaneira es el camino. Quieres despeje y un día que empiece antes del calor.",
  },
  "los-glaciares": {
    tagline: "Perito Moreno, Fitz Roy si fuiste al norte, hielo que se desprende a horario.",
    description: "El Calafate para el glaciar, El Chaltén para el granito. Los anfitriones tienen autos en los dos. El hielo no se fija en cuál elegiste.",
  },
  "nahuel-huapi": {
    tagline: "El parque más viejo de Argentina, un lago, Bariloche como porche.",
    description: "Bariloche o Villa La Angostura. Los Siete Lagos es el viaje. Un auto para el circuito y el chocolate después.",
  },
  "tierra-del-fuego": {
    tagline: "El final de la Panamericana, un tren de turista, un dique de castores.",
    description: "Ushuaia. El parque está a un rato. El auto es para el parque y el día que vas para el otro lado, a Tolhuin.",
  },
  iguazu: {
    tagline: "Las pasarelas argentinas, Garganta del Diablo, el ruido del otro país.",
    description: "Puerto Iguazú. El lado brasileño es otro anuncio. Los anfitriones saben qué entrada todavía tiene cupo a la mañana.",
  },
  lanin: {
    tagline: "Un volcán en la frontera, araucarias, un lago de postal.",
    description: "Junín de los Andes. El volcán es el horizonte. Un auto para los lagos y el paso a Chile si está abierto.",
  },
  "los-alerces": {
    tagline: "Árboles más viejos que el rumor, un camino de lago, Esquel para las llaves.",
    description: "Esquel o Trevelin. El alerzal se recorre en lancha. El auto es para el camino del parque y el té galés después.",
  },
  ischigualasto: {
    tagline: "Valle de la Luna, un circuito de desierto, fósiles si el guía va.",
    description: "San Agustín del Valle Fértil. El circuito se hace con guía. El auto es para el pueblo y Talampaya el mismo día.",
  },
  talampaya: {
    tagline: "Cañones rojos, un parque que se recorre en el vehículo del parque.",
    description: "Villa Unión. Los autos particulares se quedan en la puerta. El tuyo es para el pueblo y Ischigualasto al lado.",
  },
  "torres-del-paine": {
    tagline: "Las torres, el viento, un parque que se llena en diciembre.",
    description: "Puerto Natales. Existe el bus del parque; el auto es para las horas en que el bus no pasa. Los anfitriones dejan una capa que no es opcional.",
  },
  conguillio: {
    tagline: "Araucarias, un campo de lava negro, Llaima si se porta bien.",
    description: "Melipeuco o Curacautín. El camino del parque es ceniza. Quieres algo que aguante un portón cerrado en invierno.",
  },
  "vicente-perez-rosales": {
    tagline: "El parque más viejo de Chile, Petrohué, un volcán en el lago.",
    description: "Puerto Varas. Los saltos y el lago son el día. Los anfitriones conocen el ferry a Peulla si quieres el cruce.",
  },
  lauca: {
    tagline: "Lagos de altiplano, vicuñas, un pueblo a 3.500 metros.",
    description: "Putre. Arica queda demasiado bajo para un amanecer. Quieres sentido de altitud y el estanque lleno: el siguiente es un rumor.",
  },
  queulat: {
    tagline: "Un glaciar colgante, la Carretera Austral, una lluvia que es clima.",
    description: "Puyuhuapi. El glaciar colgante es una caminata corta. El auto es la Carretera. Los anfitriones esperan barro.",
  },
  villarrica: {
    tagline: "Un volcán que todavía echa humo, Pucón como porche.",
    description: "Pucón. El camino de ski en verano es la caminata. Un auto para los lagos y el día en que el cono está cerrado.",
  },
  "santa-teresa": {
    tagline: "Una fortaleza, una playa, el Atlántico que Uruguay sí usa.",
    description: "Punta del Diablo o Castillos. El parque es costa y un fuerte. Los anfitriones dejan arena en los pedales a propósito.",
  },
  "cerro-cora": {
    tagline: "Arenisca roja, una última batalla, el primer parque nacional del Paraguay.",
    description: "Pedro Juan Caballero o Concepción. Los cerros son el parque. Un auto para la tierra y la frontera que es un pueblo.",
  },
  vinales: {
    tagline: "Mogotes, tabaco, un valle al que se entra en auto.",
    description: "El pueblo de Viñales. El parque es el paisaje alrededor. Los anfitriones dejan un auto que aguanta un camino de tierra entre mogotes y una casa que todavía tuerce tabaco.",
  },
};
