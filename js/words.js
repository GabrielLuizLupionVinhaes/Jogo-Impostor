// Banco de palavras do Jogo do Impostor.
// Formato de cada linha: "Palavra: dica, dica, dica".
// As dicas ajudam o impostor a se disfarçar sem entregar a palavra: cada dica deve servir
// para mais de uma palavra do mesmo tema (nada de nomes próprios, bordões ou apelidos únicos).
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
        Sushi: Arroz, Delivery, Frio
        Feijoada: Arroz, Panela, Almoço
        Brigadeiro: Aniversário, Chocolate, Granulado
        Pão de queijo: Café, Polvilho, Forno
        Coxinha: Salgado, Frango, Lanchonete
        Açaí: Tigela, Gelado, Fruta
        Pastel: Feira, Fritura, Recheio
        Sorvete: Gelado, Sobremesa, Verão
        Pipoca: Petisco, Milho, Sal
        Churrasco: Domingo, Carne, Amigos
        Macarrão: Massa, Molho, Italiano
        Omelete: Ovo, Frigideira, Queijo
        Salada: Alface, Verde, Almoço
        Bolo: Aniversário, Fatia, Cobertura
        Chocolate: Doce, Sobremesa, Presente
        Batata frita: Porção, Ketchup, Fritura
        Panqueca: Massa, Frigideira, Recheio
        Tapioca: Frigideira, Nordeste, Recheio
        Cuscuz: Milho, Nordeste, Café
        Strogonoff: Arroz, Molho, Frango
        Pudim: Calda, Sobremesa, Doce
        Cachorro-quente: Pão, Lanche, Mostarda
      `),
      theme('animais', 'Animais', `
        Cachorro: Coleira, Estimação, Pelo
        Gato: Bigode, Estimação, Pelo
        Leão: Selva, Savana, Felino
        Elefante: Grande, Savana, Circo
        Girafa: Savana, Manchas, Folhas
        Macaco: Galho, Selva, Pular
        Zebra: Savana, Manada, Preto
        Tubarão: Mar, Dentes, Barbatana
        Golfinho: Mar, Inteligente, Salto
        Pinguim: Gelo, Ave, Nadar
        Coruja: Noite, Penas, Ave
        Cobra: Veneno, Escamas, Selva
        Jacaré: Dentes, Rio, Escamas
        Tartaruga: Casco, Ovos, Mar
        Cavalo: Fazenda, Casco, Manada
        Vaca: Fazenda, Manchas, Pasto
        Galinha: Ovo, Fazenda, Pena
        Porco: Fazenda, Rosa, Gordinho
        Coelho: Orelhas, Pular, Estimação
        Borboleta: Asas, Colorida, Jardim
        Abelha: Mel, Jardim, Voar
        Papagaio: Penas, Verde, Bico
        Urso: Floresta, Mel, Garras
        Canguru: Pular, Filhote, Rabo
        Polvo: Mar, Inteligente, Braços
      `),
      theme('objetos', 'Objetos', `
        Celular: Tela, Bateria, Bolso
        Guarda-chuva: Cabo, Abrir, Dobrar
        Relógio: Pulso, Bateria, Parede
        Óculos: Lente, Vidro, Sol
        Tesoura: Cortar, Papel, Escola
        Escova de dente: Banheiro, Cabo, Manhã
        Travesseiro: Cama, Dormir, Macio
        Chave: Porta, Abrir, Bolso
        Espelho: Vidro, Banheiro, Parede
        Vela: Fogo, Aniversário, Luz
        Geladeira: Cozinha, Frio, Porta
        Televisão: Controle, Canal, Sofá
        Mochila: Escola, Costas, Viagem
        Lápis: Borracha, Ponta, Escola
        Garrafa: Tampa, Água, Vidro
        Cadeira: Sentar, Pernas, Mesa
        Bicicleta: Passeio, Rua, Equilíbrio
        Chinelo: Praia, Borracha, Verão
        Martelo: Bater, Ferramenta, Cabo
        Lanterna: Luz, Escuro, Pilha
        Almofada: Sofá, Macio, Sentar
        Panela: Cozinha, Tampa, Cabo
        Controle remoto: Botões, Pilha, Canal
        Escada: Subir, Alto, Equilíbrio
        Balão: Festa, Aniversário, Colorido
      `),
      theme('lugares', 'Lugares', `
        Praia: Sol, Areia, Férias
        Escola: Sala, Uniforme, Crianças
        Hospital: Remédio, Fila, Branco
        Cinema: Ingresso, Escuro, Pipoca
        Shopping: Passeio, Escada rolante, Compras
        Aeroporto: Mala, Portão, Viagem
        Igreja: Silêncio, Domingo, Casamento
        Supermercado: Carrinho, Caixa, Prateleira
        Academia: Peso, Suor, Esporte
        Biblioteca: Livros, Silêncio, Estante
        Restaurante: Garçom, Cardápio, Fila
        Zoológico: Jaula, Bichos, Passeio
        Parque de diversões: Ingresso, Algodão-doce, Fila
        Padaria: Pão, Café, Balcão
        Farmácia: Remédio, Receita, Balcão
        Banco: Dinheiro, Fila, Caixa
        Estádio: Arquibancada, Esporte, Barulho
        Museu: Quadro, Arte, Silêncio
        Fazenda: Bichos, Campo, Portão
        Delegacia: Boletim, Uniforme, Grade
        Hotel: Quarto, Recepção, Férias
        Piscina: Água, Nadar, Sol
        Cemitério: Flores, Silêncio, Velas
        Montanha: Trilha, Neve, Férias
        Circo: Plateia, Crianças, Lona
      `),
      theme('profissoes', 'Profissões', `
        Médico: Jaleco, Consultório, Plantão
        Professor: Quadro, Prova, Paciência
        Bombeiro: Fogo, Mangueira, Resgate
        Policial: Uniforme, Sirene, Rua
        Cozinheiro: Avental, Fogo, Receita
        Dentista: Sorriso, Broca, Consultório
        Piloto: Cabine, Passageiros, Céu
        Advogado: Tribunal, Processo, Escritório
        Cabeleireiro: Corte, Tesoura, Avental
        Motorista: Volante, Estrada, Passageiros
        Pedreiro: Obra, Capacete, Parede
        Garçom: Bandeja, Gorjeta, Uniforme
        Veterinário: Bichos, Vacina, Clínica
        Astronauta: Capacete, Céu, Ciência
        Jornalista: Microfone, Câmera, Televisão
        Fotógrafo: Câmera, Flash, Retrato
        Carteiro: Rua, Entrega, Uniforme
        Mecânico: Oficina, Ferramentas, Motor
        Enfermeiro: Plantão, Vacina, Curativo
        Programador: Computador, Café, Escritório
        Agricultor: Campo, Sol, Bichos
        Pintor: Quadro, Parede, Arte
        Eletricista: Escada, Ferramentas, Luz
        Salva-vidas: Apito, Resgate, Sol
        Juiz: Tribunal, Martelo, Processo
      `),
    ],
  },
  {
    id: 'cultura-pop',
    name: 'Cultura pop',
    themes: [
      theme('filmes-series', 'Filmes e Séries', `
        Titanic: Navio, Romance, Mar
        Harry Potter: Magia, Escola, Livro
        Star Wars: Espaço, Guerra, Robôs
        Toy Story: Brinquedo, Pixar, Amizade
        Frozen: Princesa, Neve, Música
        O Rei Leão: Animais, Música, Pai
        Vingadores: Heróis, Ação, Equipe
        Jurassic Park: Ilha, Aventura, Monstros
        Matrix: Ação, Futuro, Tecnologia
        Stranger Things: Monstro, Poderes, Crianças
        La Casa de Papel: Assalto, Dinheiro, Equipe
        Round 6: Dinheiro, Jogos, Sobrevivência
        Friends: Amizade, Comédia, Café
        Shrek: Princesa, Comédia, Animação
        Procurando Nemo: Oceano, Pai, Animação
        Velozes e Furiosos: Ação, Corrida, Família
        Os Simpsons: Amarelo, Desenho, Família
        Chaves: Comédia, Crianças, Clássico
        Tropa de Elite: Ação, Polícia, Violência
        Avatar: Planeta, Floresta, Aventura
        Barbie: Boneca, Moda, Brinquedo
        Piratas do Caribe: Navio, Tesouro, Capitão
        Divertida Mente: Emoções, Animação, Cabeça
        Game of Thrones: Dragões, Guerra, Medieval
        Wandinha: Escola, Família, Mistério
      `),
      theme('personagens', 'Personagens', `
        Mickey Mouse: Orelhas, Disney, Luvas
        Bob Esponja: Amarelo, Mar, Desenho
        Super Mario: Videogame, Bigode, Pulo
        Pikachu: Amarelo, Anime, Fofo
        Sonic: Azul, Videogame, Velocidade
        Batman: Herói, Capa, Noite
        Homem-Aranha: Herói, Máscara, Prédios
        Superman: Herói, Capa, Voar
        Mulher-Maravilha: Heroína, Força, Guerreira
        Hulk: Verde, Força, Herói
        Coringa: Vilão, Risada, Palhaço
        Darth Vader: Vilão, Capacete, Preto
        Scooby-Doo: Mistério, Medo, Desenho
        Pica-Pau: Risada, Desenho, Travesso
        Mônica: Gibi, Vermelho, Brava
        Cebolinha: Gibi, Planos, Verde
        Pac-Man: Videogame, Fantasmas, Amarelo
        Minions: Amarelo, Óculos, Bagunça
        Buzz Lightyear: Brinquedo, Espaço, Herói
        Goku: Luta, Anime, Força
        Naruto: Anime, Luta, Amizade
        Branca de Neve: Princesa, Disney, Bruxa
        Cinderela: Princesa, Disney, Baile
        Pinóquio: Boneco, Disney, Fada
        Peppa Pig: Rosa, Família, Desenho
      `),
      theme('famosos', 'Famosos', `
        Anitta: Cantora, Brasileira, Dança
        Xuxa: Loira, Televisão, Crianças
        Silvio Santos: Televisão, Domingo, Dinheiro
        Ivete Sangalo: Cantora, Carnaval, Brasileira
        Ayrton Senna: Velocidade, Brasileiro, Ídolo
        Gisele Bündchen: Modelo, Loira, Brasileira
        Roberto Carlos: Rei, Cantor, Brasileiro
        Faustão: Televisão, Domingo, Apresentador
        Ana Maria Braga: Televisão, Manhã, Apresentadora
        Taylor Swift: Cantora, Turnê, Pop
        Beyoncé: Diva, Pop, Dança
        Michael Jackson: Dança, Pop, Rei
        Elvis Presley: Rock, Rei, Cantor
        Albert Einstein: Gênio, Ciência, Cabelo
        Leonardo da Vinci: Arte, Inventor, Gênio
        Leonardo DiCaprio: Ator, Cinema, Galã
        Shakira: Cantora, Dança, Latina
        Lady Gaga: Pop, Cantora, Figurino
        Santos Dumont: Inventor, Brasileiro, Voar
        Steve Jobs: Inventor, Tecnologia, Bilionário
        Frida Kahlo: Pintora, Arte, Flores
        Charlie Chaplin: Ator, Cinema, Comédia
        Tiradentes: Feriado, História, Barba
        Dom Pedro I: História, Feriado, Coroa
        Cleópatra: Rainha, História, Coroa
      `),
      theme('marcas', 'Marcas', `
        Coca-Cola: Refrigerante, Vermelho, Bebida
        McDonald's: Lanche, Batata, Amarelo
        Nike: Calçado, Corrida, Atleta
        Adidas: Calçado, Atleta, Alemanha
        Apple: Celular, Caro, Notebook
        Samsung: Celular, Televisão, Eletrônicos
        Google: Pesquisa, Internet, Colorido
        Netflix: Séries, Filmes, Sofá
        Lego: Brinquedo, Montar, Colorido
        Havaianas: Verão, Praia, Brasil
        O Boticário: Perfume, Presente, Vendedor
        PlayStation: Videogame, Controle, Eletrônicos
        Guaraná Antarctica: Refrigerante, Verde, Brasil
        Nescau: Leite, Caneca, Bebida
        Nubank: Banco, Cartão, Aplicativo
        iFood: Entrega, Fome, Aplicativo
        Uber: Corrida, Carro, Viagem
        Disney: Castelo, Princesas, Filmes
        Ferrari: Carro, Vermelho, Velocidade
        Volkswagen: Carro, Alemanha, Fábrica
        Amazon: Entrega, Caixa, Compras
        Mercado Livre: Amarelo, Frete, Vendedor
        WhatsApp: Mensagem, Verde, Grupo
        Instagram: Fotos, Curtida, Aplicativo
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
        Basquete: Arremesso, Quadra, Time
        Tênis: Raquete, Saque, Quadra
        Natação: Água, Raia, Olimpíadas
        Surfe: Prancha, Água, Equilíbrio
        Skate: Manobra, Rampa, Equilíbrio
        Boxe: Luvas, Luta, Ringue
        Judô: Quimono, Faixa, Tatame
        Capoeira: Roda, Luta, Brasil
        Atletismo: Pista, Corrida, Salto
        Ciclismo: Capacete, Corrida, Estrada
        Fórmula 1: Velocidade, Corrida, Capacete
        Golfe: Taco, Grama, Bandeira
        Handebol: Quadra, Arremesso, Mãos
        Ginástica: Acrobacia, Olimpíadas, Equilíbrio
        Xadrez: Estratégia, Rei, Mesa
        Esgrima: Espada, Máscara, Olimpíadas
        Hipismo: Obstáculos, Salto, Elegância
        Remo: Água, Barco, Equipe
        Beisebol: Taco, Luva, Americano
        Futebol americano: Capacete, Estados Unidos, Time
        Karatê: Faixa, Golpe, Quimono
        Escalada: Corda, Altura, Capacete
        Pingue-pongue: Raquete, Mesa, Bolinha
        Boliche: Pista, Bola, Diversão
      `),
      theme('futebol', 'Futebol', `
        Pelé: Rei, Camisa 10, Gols
        Neymar: Dribles, Camisa 10, Seleção
        Messi: Baixinho, Canhoto, Craque
        Cristiano Ronaldo: Comemoração, Gols, Craque
        Ronaldinho: Sorriso, Dribles, Craque
        Marta: Rainha, Seleção, Craque
        Vini Jr.: Dança, Velocidade, Espanha
        Romário: Baixinho, Tetra, Artilheiro
        Zico: Camisa 10, Ídolo, Craque
        Maracanã: Rio, Final, Templo
        Copa do Mundo: Seleção, Taça, Quatro anos
        Pênalti: Cobrança, Goleiro, Falta
        Impedimento: Bandeirinha, Linha, Posição
        Escanteio: Canto, Cobrança, Cabeceio
        Cartão vermelho: Expulsão, Falta, Chuveiro
        Árbitro: Apito, Cartão, Bandeirinha
        Flamengo: Rio, Torcida, Vermelho
        Corinthians: Torcida, Paulista, Alvinegro
        Palmeiras: Paulista, Verde, Torcida
        São Paulo: Tricolor, Paulista, Tradição
        Vasco: Rio, Alvinegro, Torcida
        Grêmio: Tricolor, Gaúcho, Torcida
        Real Madrid: Espanha, Branco, Europa
        Barcelona: Espanha, Europa, Azul
        Libertadores: Taça, América, Continental
      `),
    ],
  },
];

export const THEMES = PACKS.flatMap((pack) => pack.themes);
