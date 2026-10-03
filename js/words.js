// Banco de palavras do Jogo do Impostor.
// Formato de cada linha: "Palavra: dica, dica, dica".
// As dicas ajudam o impostor a se disfarçar sem entregar a palavra.
// Depois de editar, rode `npm test` para conferir as regras do banco.

/** Converte o texto "Palavra: dica, dica, dica" (uma por linha) em [{ word, hints }]. */
export function parseWordList(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(':');
      if (separator === -1) return { word: line, hints: [] };
      return {
        word: line.slice(0, separator).trim(),
        hints: line
          .slice(separator + 1)
          .split(',')
          .map((hint) => hint.trim())
          .filter(Boolean),
      };
    });
}

function theme(id, name, list) {
  return { id, name, words: parseWordList(list) };
}

export const PACKS = [
  {
    id: 'classicos',
    name: 'Clássicos',
    themes: [
      theme('comidas', 'Comidas', `
        Pizza: Queijo, Forno, Fatia
        Hambúrguer: Lanche, Carne, Pão
        Lasanha: Massa, Forno, Camadas
        Sushi: Arroz, Peixe, Hashi
        Feijoada: Sábado, Panela, Couve
        Brigadeiro: Festa, Chocolate, Granulado
        Pão de queijo: Mineiro, Café, Polvilho
        Coxinha: Salgado, Frango, Lanchonete
        Açaí: Tigela, Roxo, Granola
        Pastel: Feira, Fritura, Recheio
        Sorvete: Gelado, Casquinha, Verão
        Pipoca: Cinema, Milho, Sal
        Churrasco: Carvão, Domingo, Picanha
        Macarrão: Massa, Molho, Italiano
        Omelete: Ovo, Frigideira, Queijo
        Salada: Alface, Verde, Dieta
        Bolo: Aniversário, Vela, Cobertura
        Chocolate: Doce, Cacau, Páscoa
        Batata frita: Palito, Ketchup, Fritura
        Panqueca: Massa, Enrolada, Recheio
        Tapioca: Goma, Nordeste, Recheio
        Cuscuz: Milho, Nordeste, Vapor
        Strogonoff: Champignon, Palha, Arroz
        Pudim: Calda, Sobremesa, Caramelo
        Cachorro-quente: Salsicha, Lanche, Mostarda
      `),
      theme('animais', 'Animais', `
        Cachorro: Latido, Coleira, Osso
        Gato: Miau, Bigode, Novelo
        Leão: Juba, Selva, Rei
        Elefante: Tromba, Grande, Marfim
        Girafa: Pescoço, Alta, Manchas
        Macaco: Banana, Galho, Cipó
        Zebra: Listras, Savana, Manada
        Tubarão: Mar, Dentes, Barbatana
        Golfinho: Mar, Inteligente, Salto
        Pinguim: Gelo, Smoking, Antártida
        Coruja: Noite, Olhos, Penas
        Cobra: Veneno, Rastejar, Escamas
        Jacaré: Pântano, Dentes, Rio
        Tartaruga: Casco, Lenta, Ovos
        Cavalo: Galope, Crina, Ferradura
        Vaca: Leite, Fazenda, Mugido
        Galinha: Ovo, Fazenda, Pena
        Porco: Lama, Fazenda, Rosa
        Coelho: Cenoura, Orelhas, Páscoa
        Borboleta: Asas, Casulo, Colorida
        Abelha: Mel, Ferrão, Colmeia
        Papagaio: Fala, Verde, Bico
        Urso: Hibernar, Mel, Garras
        Canguru: Bolsa, Austrália, Pulo
        Polvo: Tentáculos, Tinta, Mar
      `),
      theme('objetos', 'Objetos', `
        Celular: Tela, Bateria, Mensagem
        Guarda-chuva: Tempestade, Cabo, Molhado
        Relógio: Hora, Ponteiro, Pulso
        Óculos: Lente, Visão, Armação
        Tesoura: Cortar, Papel, Lâmina
        Escova de dente: Pasta, Banheiro, Sorriso
        Travesseiro: Cama, Fronha, Dormir
        Chave: Porta, Fechadura, Abrir
        Espelho: Reflexo, Vidro, Vaidade
        Vela: Fogo, Cera, Aniversário
        Geladeira: Cozinha, Frio, Ímã
        Televisão: Controle, Canal, Sofá
        Mochila: Escola, Costas, Zíper
        Lápis: Escrever, Borracha, Ponta
        Garrafa: Tampa, Água, Vidro
        Cadeira: Sentar, Pernas, Mesa
        Bicicleta: Pedal, Roda, Corrente
        Chinelo: Praia, Dedo, Verão
        Martelo: Prego, Bater, Ferramenta
        Lanterna: Luz, Escuro, Pilha
        Almofada: Sofá, Macia, Enfeite
        Panela: Fogão, Tampa, Cozinhar
        Controle remoto: Botões, Pilha, Canal
        Escada: Degrau, Subir, Andar
        Balão: Festa, Ar, Estourar
      `),
      theme('lugares', 'Lugares', `
        Praia: Areia, Sol, Mar
        Escola: Professor, Recreio, Sala
        Hospital: Médico, Maca, Emergência
        Cinema: Tela, Filme, Ingresso
        Shopping: Lojas, Escada rolante, Compras
        Aeroporto: Avião, Mala, Portão
        Igreja: Missa, Altar, Sino
        Supermercado: Carrinho, Caixa, Prateleira
        Academia: Peso, Suor, Esteira
        Biblioteca: Livros, Silêncio, Estante
        Restaurante: Garçom, Cardápio, Mesa
        Zoológico: Jaula, Bichos, Passeio
        Parque de diversões: Montanha-russa, Ingresso, Algodão-doce
        Padaria: Pão, Café, Balcão
        Farmácia: Remédio, Receita, Balcão
        Banco: Dinheiro, Fila, Cofre
        Estádio: Torcida, Arquibancada, Jogo
        Museu: Quadro, Arte, Exposição
        Fazenda: Trator, Galinheiro, Plantação
        Delegacia: Polícia, Cela, Boletim
        Hotel: Quarto, Recepção, Hóspede
        Piscina: Água, Nadar, Cloro
        Cemitério: Túmulo, Flores, Silêncio
        Montanha: Pico, Neve, Escalar
        Circo: Palhaço, Lona, Picadeiro
      `),
      theme('profissoes', 'Profissões', `
        Médico: Jaleco, Consulta, Receita
        Professor: Aula, Quadro, Prova
        Bombeiro: Fogo, Mangueira, Resgate
        Policial: Viatura, Distintivo, Sirene
        Cozinheiro: Avental, Fogão, Tempero
        Dentista: Sorriso, Broca, Cárie
        Piloto: Avião, Cabine, Voo
        Advogado: Tribunal, Processo, Terno
        Cabeleireiro: Salão, Corte, Secador
        Motorista: Volante, Ônibus, Estrada
        Pedreiro: Tijolo, Cimento, Obra
        Garçom: Bandeja, Gorjeta, Mesa
        Veterinário: Bichos, Vacina, Clínica
        Astronauta: Espaço, Foguete, Lua
        Jornalista: Notícia, Microfone, Reportagem
        Fotógrafo: Câmera, Flash, Retrato
        Carteiro: Correio, Encomenda, Endereço
        Mecânico: Oficina, Graxa, Motor
        Enfermeiro: Plantão, Injeção, Curativo
        Programador: Computador, Código, Café
        Agricultor: Plantação, Trator, Colheita
        Pintor: Pincel, Tinta, Parede
        Eletricista: Fios, Choque, Tomada
        Salva-vidas: Apito, Boia, Resgate
        Juiz: Tribunal, Sentença, Toga
      `),
    ],
  },
  {
    id: 'cultura-pop',
    name: 'Cultura pop',
    themes: [
      theme('filmes-series', 'Filmes e Séries', `
        Titanic: Navio, Iceberg, Naufrágio
        Harry Potter: Bruxo, Varinha, Cicatriz
        Star Wars: Galáxia, Sabre, Nave
        Toy Story: Brinquedos, Cowboy, Pixar
        Frozen: Gelo, Princesa, Neve
        O Rei Leão: Savana, Juba, Hakuna Matata
        Vingadores: Heróis, Marvel, Escudo
        Jurassic Park: Dinossauros, Ilha, Parque
        Matrix: Pílula, Hacker, Simulação
        Stranger Things: Anos 80, Monstro, Poderes
        La Casa de Papel: Assalto, Máscara, Macacão
        Round 6: Coreia, Jogos, Dinheiro
        Friends: Café, Nova York, Sofá
        Shrek: Ogro, Pântano, Burro
        Procurando Nemo: Peixe, Oceano, Pai
        Velozes e Furiosos: Carros, Corrida, Família
        Os Simpsons: Amarelo, Desenho, Família
        Chaves: Vila, Barril, Seu Madruga
        Tropa de Elite: Polícia, BOPE, Caveira
        Avatar: Azul, Planeta, Floresta
        Barbie: Rosa, Boneca, Moda
        Piratas do Caribe: Navio, Tesouro, Capitão
        Divertida Mente: Emoções, Alegria, Tristeza
        Game of Thrones: Dragões, Trono, Inverno
        Wandinha: Gótica, Mãozinha, Tranças
      `),
      theme('personagens', 'Personagens', `
        Mickey Mouse: Orelhas, Rato, Luvas
        Bob Esponja: Abacaxi, Amarelo, Oceano
        Super Mario: Encanador, Cogumelo, Bigode
        Pikachu: Choque, Amarelo, Treinador
        Sonic: Azul, Velocidade, Anéis
        Batman: Morcego, Gotham, Capa
        Homem-Aranha: Teia, Prédios, Máscara
        Superman: Capa, Voar, Kryptonita
        Mulher-Maravilha: Laço, Amazona, Braceletes
        Hulk: Verde, Força, Raiva
        Coringa: Vilão, Sorriso, Cartas
        Darth Vader: Capacete, Respiração, Pai
        Scooby-Doo: Mistério, Biscoito, Van
        Pica-Pau: Pássaro, Risada, Árvore
        Mônica: Dentuça, Gibi, Vermelho
        Cebolinha: Planos, Gibi, Espetado
        Pac-Man: Fantasmas, Labirinto, Bolinhas
        Minions: Banana, Amarelo, Macacão
        Buzz Lightyear: Espaço, Asas, Infinito
        Goku: Esferas, Luta, Anime
        Naruto: Ninja, Raposa, Anime
        Branca de Neve: Maçã, Anões, Princesa
        Cinderela: Sapato, Abóbora, Meia-noite
        Pinóquio: Nariz, Mentira, Boneco
        Peppa Pig: Rosa, Lama, Família
      `),
      theme('famosos', 'Famosos', `
        Anitta: Funk, Cantora, Rebolado
        Xuxa: Loira, Baixinhos, Nave
        Silvio Santos: Aviãozinho, Baú, Domingo
        Ivete Sangalo: Axé, Bahia, Carnaval
        Ayrton Senna: Capacete, Domingo, Bandeira
        Gisele Bündchen: Modelo, Passarela, Gaúcha
        Roberto Carlos: Rei, Emoções, Natal
        Faustão: Domingão, Plateia, Bordão
        Ana Maria Braga: Manhã, Receitas, Cozinha
        Taylor Swift: Cantora, Turnê, Pop
        Beyoncé: Diva, Pop, Dança
        Michael Jackson: Moonwalk, Luva, Thriller
        Elvis Presley: Topete, Rock, Rei
        Albert Einstein: Relatividade, Gênio, Cabelo
        Leonardo da Vinci: Mona Lisa, Inventor, Renascimento
        Leonardo DiCaprio: Oscar, Ator, Galã
        Shakira: Quadril, Colômbia, Waka Waka
        Lady Gaga: Figurino, Pop, Excêntrica
        Santos Dumont: Avião, Inventor, 14-Bis
        Steve Jobs: Maçã, Gola alta, Garagem
        Frida Kahlo: Sobrancelha, México, Flores
        Charlie Chaplin: Bengala, Bigode, Cinema mudo
        Tiradentes: Feriado, Inconfidência, Barba
        Dom Pedro I: Independência, Grito, Imperador
        Cleópatra: Egito, Rainha, Serpente
      `),
      theme('marcas', 'Marcas', `
        Coca-Cola: Refrigerante, Vermelho, Gelada
        McDonald's: Lanche, Palhaço, Batata
        Nike: Calçado, Corrida, Atleta
        Adidas: Três listras, Alemanha, Agasalho
        Apple: Maçã, Caro, Notebook
        Samsung: Coreia, Eletrônicos, Smartphone
        Google: Pesquisa, Internet, Colorido
        Netflix: Séries, Streaming, Sofá
        Lego: Peças, Montar, Bloquinhos
        Havaianas: Borracha, Verão, Dedo
        O Boticário: Perfume, Presente, Cheiro
        PlayStation: Videogame, Controle, Console
        Guaraná Antarctica: Refrigerante, Amazônia, Verde
        Nescau: Achocolatado, Leite, Caneca
        Nubank: Roxo, Cartão, Aplicativo
        iFood: Entrega, Fome, Aplicativo
        Uber: Corrida, Carro, Viagem
        Disney: Castelo, Princesas, Orlando
        Ferrari: Vermelho, Velocidade, Itália
        Volkswagen: Fusca, Alemanha, Carro
        Amazon: Entrega, Caixa, Compras
        Mercado Livre: Amarelo, Frete, Vendedor
        WhatsApp: Mensagem, Verde, Grupo
        Instagram: Fotos, Stories, Curtida
        YouTube: Vídeos, Vermelho, Canal
      `),
    ],
  },
  {
    id: 'esportes',
    name: 'Esportes',
    themes: [
      theme('esportes', 'Esportes', `
        Vôlei: Rede, Saque, Bloqueio
        Basquete: Cesta, Arremesso, Garrafão
        Tênis: Raquete, Saque, Quadra
        Natação: Touca, Braçada, Raia
        Surfe: Prancha, Onda, Parafina
        Skate: Manobra, Rodinhas, Rampa
        Boxe: Luvas, Ringue, Nocaute
        Judô: Quimono, Faixa, Tatame
        Capoeira: Berimbau, Roda, Gingado
        Atletismo: Pista, Corrida, Salto
        Ciclismo: Pedal, Capacete, Pelotão
        Fórmula 1: Pit stop, Volante, Largada
        Golfe: Taco, Buraco, Bandeira
        Handebol: Quadra, Arremesso, Mãos
        Ginástica: Acrobacia, Trave, Collant
        Xadrez: Tabuleiro, Rei, Xeque
        Esgrima: Espada, Máscara, Florete
        Hipismo: Obstáculos, Sela, Montaria
        Remo: Barco, Lago, Equipe
        Beisebol: Taco, Luva, Rebatida
        Futebol americano: Capacete, Touchdown, Ombreiras
        Karatê: Faixa, Golpe, Quimono
        Escalada: Corda, Parede, Altura
        Pingue-pongue: Raquete, Mesa, Bolinha
        Boliche: Pinos, Strike, Pista
      `),
      theme('futebol', 'Futebol', `
        Pelé: Rei, Camisa 10, Milésimo
        Neymar: Dribles, Camisa 10, Paris
        Messi: Argentina, Baixinho, Canhoto
        Cristiano Ronaldo: Portugal, Cabeceio, Comemoração
        Ronaldinho: Sorriso, Dribles, Bruxo
        Marta: Rainha, Seleção, Alagoas
        Vini Jr.: Dança, Velocidade, Espanha
        Romário: Baixinho, Tetra, Artilheiro
        Zico: Galinho, Camisa 10, Japão
        Maracanã: Rio, Final, Templo
        Copa do Mundo: Seleção, Taça, Quatro anos
        Pênalti: Cobrança, Goleiro, Apito
        Impedimento: Bandeirinha, Linha, Posição
        Escanteio: Canto, Cobrança, Cabeceio
        Cartão vermelho: Expulsão, Falta, Chuveiro
        Árbitro: Apito, Cartão, Bandeirinha
        Flamengo: Mengão, Rubro-negro, Urubu
        Corinthians: Timão, Fiel, Gavião
        Palmeiras: Verdão, Porco, Alviverde
        São Paulo: Tricolor, Morumbi, Soberano
        Vasco: Cruzmaltino, Colina, Bacalhau
        Grêmio: Tricolor, Gaúcho, Imortal
        Real Madrid: Merengue, Branco, Espanha
        Barcelona: Catalunha, Espanha, Azul-grená
        Libertadores: Taça, América, Continental
      `),
    ],
  },
];

export const THEMES = PACKS.flatMap((pack) => pack.themes);
