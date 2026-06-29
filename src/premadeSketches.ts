export interface PremadeSketch {
  id: string;
  name: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  svgContent: string; // Inner elements of the SVG, or viewBox-compatible markup
  viewBox: string;
}

export const PREMADE_SKETCHES: PremadeSketch[] = [
  {
    id: 'gato_fofo',
    name: 'Gatinho Sentado',
    category: 'Animais',
    difficulty: 'Fácil',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Cabeça e Orelhas -->
      <path d="M30,40 C30,30 40,25 50,25 C60,25 70,30 70,40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M30,40 L25,20 L40,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M70,40 L75,20 L60,28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Rosto (Olhos e Nariz) -->
      <circle cx="42" cy="38" r="1.5" fill="currentColor" />
      <circle cx="58" cy="38" r="1.5" fill="currentColor" />
      <path d="M49,42 L51,42 L50,43.5 Z" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <path d="M47,46 C49,48 50,48 50,46 C50,48 51,48 53,46" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Bigodes -->
      <path d="M25,42 L15,41" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M25,45 L13,46" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M75,42 L85,41" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M75,45 L87,46" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Corpo -->
      <path d="M35,46 C35,65 38,80 38,80 C38,80 43,83 50,83 C57,83 62,80 62,80 C62,80 65,65 65,46" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      
      <!-- Patinhas Dianteiras -->
      <path d="M44,60 L44,81 C44,82.5 47,82.5 47,81 L47,62" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M56,60 L56,81 C56,82.5 53,82.5 53,81 L53,62" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Cauda -->
      <path d="M62,75 C70,75 78,70 78,55 C78,48 74,48 74,52 C74,62 67,67 62,68" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: 'cao_fofo',
    name: 'Cachorrinho',
    category: 'Animais',
    difficulty: 'Fácil',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Cabeça -->
      <path d="M35,35 C35,22 65,22 65,35 C65,45 62,55 50,55 C38,55 35,45 35,35 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      
      <!-- Orelhas Caídas -->
      <path d="M36,28 C30,30 25,40 28,52 C30,58 35,55 35,48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M64,28 C70,30 75,40 72,52 C70,58 65,55 65,48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Olhos e Nariz -->
      <circle cx="43" cy="35" r="2" fill="currentColor" />
      <circle cx="57" cy="35" r="2" fill="currentColor" />
      <!-- Brilho do olho -->
      <circle cx="44" cy="34" r="0.6" fill="white" />
      <circle cx="58" cy="34" r="0.6" fill="white" />
      
      <!-- Nariz fofinho -->
      <path d="M47,41 C47,39 53,39 53,41 C53,43 47,43 47,41 Z" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <!-- Boca sorrindo -->
      <path d="M47,44 C49,46 50,46 50,44 C50,46 51,46 53,44" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Corpo -->
      <path d="M40,54 L35,78 C35,80 43,80 43,78 L43,65 L47,65 L47,78 C47,80 53,80 53,78 L53,65 L57,65 L57,78 C57,80 65,80 65,78 L60,54" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Cauda Alegre -->
      <path d="M61,65 C68,66 74,62 76,55 C77,52 74,50 73,53 C71,58 65,59 61,60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: 'borboleta',
    name: 'Borboleta',
    category: 'Natureza',
    difficulty: 'Médio',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Corpo Central -->
      <ellipse cx="50" cy="50" rx="2" ry="18" fill="currentColor" />
      <circle cx="50" cy="28" r="3" fill="currentColor" />
      
      <!-- Antenas -->
      <path d="M49,26 C45,20 40,20 38,22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M51,26 C55,20 60,20 62,22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <circle cx="37" cy="22.5" r="1" fill="currentColor" />
      <circle cx="63" cy="22.5" r="1" fill="currentColor" />
      
      <!-- Asas Esquerdas -->
      <path d="M48,42 C35,22 15,25 18,45 C20,55 35,55 48,50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M48,51 C32,54 20,62 25,74 C30,82 45,72 48,56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Asas Direitas -->
      <path d="M52,42 C65,22 85,25 82,45 C80,55 65,55 52,50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M52,51 C68,54 80,62 75,74 C70,82 55,72 52,56" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Detalhes internos das asas (Esquerdo) -->
      <path d="M26,38 C32,38 38,44 44,45" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      <path d="M28,45 C32,46 36,49 42,48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      <circle cx="30" cy="33" r="1.5" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="33" cy="65" r="1" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Detalhes internos das asas (Direito) -->
      <path d="M74,38 C68,38 62,44 56,45" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      <path d="M72,45 C68,46 64,49 58,48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      <circle cx="70" cy="33" r="1.5" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="67" cy="65" r="1" fill="none" stroke="currentColor" stroke-width="1" />
    `
  },
  {
    id: 'rosa',
    name: 'Rosa Elegante',
    category: 'Natureza',
    difficulty: 'Médio',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Pétalas internas (botão) -->
      <path d="M50,40 C45,35 48,30 50,30 C52,30 55,35 50,40 Z" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M47,37 C42,32 45,26 52,26 C57,26 58,32 53,37" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M53,35 C58,32 55,22 47,24 C40,26 43,36 47,38" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Pétalas intermediárias -->
      <path d="M43,38 C35,32 35,46 45,50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M57,38 C65,32 65,46 55,50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M45,49 C42,54 58,54 55,49" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Pétalas grandes externas -->
      <path d="M37,34 C25,32 28,52 46,57" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M63,34 C75,32 72,52 54,57" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M50,23 C50,15 35,18 38,28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M50,23 C50,15 65,18 62,28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Haste e Folhas -->
      <path d="M50,56 L50,85" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      
      <!-- Folha Esquerda -->
      <path d="M50,68 C40,68 35,62 38,58 C45,56 48,63 50,68" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M38,58 L46,63" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Folha Direita -->
      <path d="M50,74 C60,74 65,68 62,64 C55,62 52,69 50,74" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M62,64 L54,69" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Espinho -->
      <path d="M50,78 L46,80 L50,81" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    `
  },
  {
    id: 'olho_anime',
    name: 'Olho de Anime',
    category: 'Anime & Desenhos',
    difficulty: 'Médio',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Sobrancelha estilosa -->
      <path d="M20,30 C35,22 65,22 80,28 L78,31 C63,26 37,26 22,33 Z" fill="currentColor" stroke="currentColor" stroke-width="1" />
      
      <!-- Pálpebra superior (linha grossa clássica de anime) -->
      <path d="M22,48 C30,38 55,34 78,42 L80,45 C57,36 32,41 24,51 Z" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <!-- Cílios do canto -->
      <path d="M76,41 L85,36 L79,44" fill="currentColor" stroke="currentColor" stroke-width="1" />
      <path d="M25,48 L18,44 L24,46" fill="currentColor" stroke="currentColor" stroke-width="1" />
      
      <!-- Pálpebra inferior -->
      <path d="M35,65 C45,69 60,68 70,62" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      
      <!-- Íris (Grande e Oval) -->
      <path d="M38,47 C38,42 62,42 62,47 L62,62 C62,68 38,68 38,62 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      
      <!-- Pupila preta no centro -->
      <ellipse cx="50" cy="55" rx="5" ry="8" fill="currentColor" />
      
      <!-- Brilho de Luz Principal (Grande) -->
      <circle cx="45" cy="50" r="4" fill="white" />
      
      <!-- Brilho de Luz Secundário (Pequeno embaixo) -->
      <circle cx="55" cy="60" r="2.2" fill="white" />
      
      <!-- Linhas de detalhe interno na íris -->
      <path d="M42,59 L44,57" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M58,59 L56,57" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Dobra da Pálpebra de cima -->
      <path d="M32,40 C42,36 58,36 68,40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    `
  },
  {
    id: 'goku_minimal',
    name: 'Cabelo de Herói (Anime)',
    category: 'Anime & Desenhos',
    difficulty: 'Difícil',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Silhueta marcante de cabelo de anime -->
      <path d="M50,80 L48,74 C42,76 38,72 38,72 C38,72 33,76 30,73 C27,70 32,64 32,64 C32,64 26,67 22,63 C18,59 23,52 23,52 C23,52 15,55 12,47 C9,39 20,35 20,35 C20,35 15,28 20,18 C25,8 35,16 35,16 C35,16 35,5 45,5 C55,5 55,16 55,16 C55,16 65,8 70,18 C75,28 70,35 70,35 C70,35 81,39 78,47 C75,55 67,52 67,52 C67,52 72,59 68,63 C64,67 58,64 58,64 C58,64 63,70 60,73 C57,76 52,74 48,74 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Contorno do Rosto -->
      <path d="M32,60 L35,68 L50,82 L65,68 L68,60" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Orelhas -->
      <path d="M32,54 C30,54 28,58 30,64 C31,67 33,68 33,68" fill="none" stroke="currentColor" stroke-width="1.8" />
      <path d="M68,54 C70,54 72,58 70,64 C69,67 67,68 67,68" fill="none" stroke="currentColor" stroke-width="1.8" />
      
      <!-- Olhos heróicos/expressivos -->
      <path d="M38,55 L46,53 L47,56 L39,57 Z" fill="currentColor" />
      <path d="M62,55 L54,53 L53,56 L61,57 Z" fill="currentColor" />
      <path d="M37,51 C41,50 45,52 46,52" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="M63,51 C59,50 55,52 54,52" fill="none" stroke="currentColor" stroke-width="2" />
      
      <!-- Nariz pequeno -->
      <path d="M50,58 L48,63 L50,63" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Sorriso determinado -->
      <path d="M44,69 C47,71 53,71 56,69" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    `
  },
  {
    id: 'mandala_simples',
    name: 'Mandala Meditativa',
    category: 'Mandalas',
    difficulty: 'Difícil',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Círculos concêntricos principais -->
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1.2" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="1" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      
      <!-- Pétalas de 8 pontas (Central) -->
      <path d="M50,20 C45,35 45,35 50,35 C55,35 55,35 50,20" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M50,80 C45,65 45,65 50,65 C55,65 55,65 50,80" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M20,50 C35,45 35,45 35,50 C35,55 35,55 20,50" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M80,50 C65,45 65,45 65,50 C65,55 65,55 80,50" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Diagonais da Mandala -->
      <path d="M29,29 C39,39 39,39 40,40 C41,41 41,41 29,29" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M71,71 C61,61 61,61 60,60 C59,59 59,59 71,71" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M71,29 C61,39 61,39 60,40 C59,41 59,41 71,29" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M29,71 C39,61 39,61 40,60 C41,59 41,59 29,71" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Detalhes de vieiras na borda externa -->
      <path d="M50,5 C47,9 43,9 40,5 C37,9 33,9 30,5" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M50,5 C53,9 57,9 60,5 C63,9 67,9 70,5" fill="none" stroke="currentColor" stroke-width="1" />
      
      <path d="M50,95 C47,91 43,91 40,95 C37,91 33,91 30,95" fill="none" stroke="currentColor" stroke-width="1" />
      <path d="M50,95 C53,91 57,91 60,95 C63,91 67,91 70,95" fill="none" stroke="currentColor" stroke-width="1" />
      
      <!-- Pequenos círculos decorativos -->
      <circle cx="50" cy="11" r="1.5" fill="currentColor" />
      <circle cx="50" cy="89" r="1.5" fill="currentColor" />
      <circle cx="11" cy="50" r="1.5" fill="currentColor" />
      <circle cx="89" cy="50" r="1.5" fill="currentColor" />
    `
  },
  {
    id: 'caligrafia_love',
    name: 'Palavra "Love" Cursiva',
    category: 'Letras & Caligrafia',
    difficulty: 'Fácil',
    viewBox: '0 0 100 40',
    svgContent: `
      <!-- "Love" escrito à mão em estilo caligrafia fluida de pincel -->
      <path d="M10,22 C13,12 18,5 20,5 C22,5 18,22 17,25 C16,28 17,29 20,26 C23,23 27,15 28,15 C29.5,15 29,22 27,25 C25,28 27,30 31,27 C36,23 41,18 43,18 C45,18 41,29 46,29 C50,29 55,23 58,18 C61,13 63,13 62,16 C61,19 55,27 60,27 C64,27 70,20 73,15 C75.5,11 77.5,11 76.5,14 C75.5,17 68,26 73,26 C77,26 84,18 89,18 C92,18 90,23 88,25 C86,27 88,28 91,25" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Detalhes do pingo do "i" ou decorações de coraçãozinho no final -->
      <path d="M92,12 C90,10 88,12 89,14 C90,16 94,14 92,12 Z" fill="currentColor" stroke="currentColor" stroke-width="1" />
    `
  },
  {
    id: 'caligrafia_gratidao',
    name: 'Palavra "Gratidão"',
    category: 'Letras & Caligrafia',
    difficulty: 'Médio',
    viewBox: '0 0 120 40',
    svgContent: `
      <!-- Caligrafia elegante para "Gratidão" -->
      <!-- Letra G ornamentada -->
      <path d="M22,12 C18,8 10,12 12,18 C14,24 21,23 23,17 L23,28 C23,34 16,36 12,32 C10,30 11,28 13,29" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      <!-- Letras r-a-t-i-d-a-o fluindo -->
      <path d="M23,20 C25,20 27,17 29,17 C31,17 30,22 32,22 C34,22 36,18 38,18 C40,18 39,22 41,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <!-- t e corte -->
      <path d="M44,12 L44,22 C44,24 45,22 47,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M41,15 L47,15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <!-- i-d-a-o -->
      <path d="M47,20 C49,18 51,18 51,22 C51,24 53,18 56,18 C58,18 56,22 58,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M64,14 L64,22 C64,24 65,22 67,22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M67,20 C69,18 72,18 72,22 C72,24 73,21 76,21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <!-- Til e o final -->
      <path d="M76,21 C78,19 81,19 80,22 C79,25 82,23 85,21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <!-- Til no a -->
      <path d="M68,14 C70,13 71,15 73,14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <!-- Pingo no i -->
      <circle cx="51" cy="14" r="1" fill="currentColor" />
    `
  },
  {
    id: 'paisagem_minimalista',
    name: 'Montanha e Sol',
    category: 'Natureza',
    difficulty: 'Fácil',
    viewBox: '0 0 100 100',
    svgContent: `
      <!-- Linha do horizonte / Solo -->
      <path d="M5,80 L95,80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
      
      <!-- Montanha de Trás (Grande) -->
      <path d="M15,80 L45,35 L70,80" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Linha de sombra/neve da montanha grande -->
      <path d="M45,35 L48,50 L42,58 L46,67 L44,80" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      
      <!-- Montanha da Frente (Pequena) -->
      <path d="M45,80 L65,55 L88,80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Linha de sombra da montanha pequena -->
      <path d="M65,55 L68,64 L63,72 L66,80" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
      
      <!-- Sol no fundo -->
      <circle cx="72" cy="32" r="10" fill="none" stroke="currentColor" stroke-width="2" />
      <!-- Raios de sol discretos -->
      <path d="M72,17 L72,20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M72,44 L72,47" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M57,32 L60,32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      <path d="M84,32 L87,32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      
      <!-- Nuvens simples de linha -->
      <path d="M20,25 C20,22 25,20 28,22 C30,20 35,21 36,24 C38,24 39,26 38,28 C38,28 18,28 20,25 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Passarinhos voando longe (v-shapes) -->
      <path d="M12,15 C14,13 16,15 17,17 C18,15 20,13 22,15" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
      <path d="M26,12 C27.5,10.5 29,12 29.8,13.5 C30.6,12 32,10.5 33.5,12" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
    `
  }
];
