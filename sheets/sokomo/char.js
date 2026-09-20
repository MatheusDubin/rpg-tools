/* Sokomo Kudiome — dados do personagem. O motor está em ../../shared/sheet.js.
   Chaves entre {chaves} viram números calculados: {dc}, {spellAtk}, {prof}, {level},
   {cha}/{chaS} (modificador), {sk_persuasao} (perícia), {atk_dag}/{dmg_dag} (ataque
   com id "dag"), {ac}, {ini} e as de extraVars abaixo. */
window.CHAR = {
  id:'sokomo',
  name:'Sokomo Kudiome',
  subtitle:'Humano · Bardo (Colégio do Conhecimento) · Nível {level} · Nobre · 25 anos',
  level:3, speed:'9m', hitDie:8, hpMax:16,
  scores:{str:8,dex:15,con:13,int:15,wis:13,cha:17},
  scoresNote:'Humano: +1 em todos os atributos (já aplicados).',
  saves:['dex','cha'],
  savesNote:'Bardo é proficiente em Destreza e Carisma. Rola-se 1d20 + modificador contra a CD do efeito. Versatilidade não vale para testes de resistência.',
  skills:{'Arcanismo':'prof','Atuação':'prof','Enganação':'prof','História':'prof','Percepção':'prof','Persuasão':'expert','Prestidigitação':'expert','Religião':'prof'},
  jackOfAllTrades:true,
  skillsNote:'Origem: Bardo (3 à escolha) · Nobre (História, Persuasão) · Colégio do Conhecimento (3 bônus). Dois pontos = Aptidão (proficiência dobrada): Persuasão e Prestidigitação. Versatilidade: +{half} em toda perícia sem proficiência (já somado acima).',
  proficiencies:[
    ['Armaduras','Leves'],
    ['Armas','Simples, bestas de mão, espadas longas, rapieiras, espadas curtas'],
    ['Ferramentas','Três instrumentos musicais (à escolha) · um tipo de jogo (Nobre)'],
    ['Idiomas','Comum, Élfico, Halfling'],
  ],
  proficienciesNote:'Sem proficiência na armadura vestida, não se conjura magias — por isso só armaduras leves aparecem na aba Mais. Versatilidade dá +{half} em ferramentas e instrumentos sem proficiência.',
  armorDefault:'leather',
  armorOptions:['none','padded','leather','studded'],
  coins:{gp:'57',sp:'10'},
  items:'Adaga, armadura de couro, instrumento musical, roupas finas, anel de sinete, pergaminho de linhagem, mochila.',
  personality:'',
  hpNote:'Dano consome PV temporários primeiro. Bardo: d8 por nível (1º nível = 8 + Con; depois 1d8 + Con ou 5 + Con por nível). A ficha de papel anota 1d8 + 6 + 2 = 16; somando o +1 de Constituição de cada nível daria 19 — confirmar com o mestre e ajustar o máximo.',
  shortRestMsg:'Descanso curto concluído. Canção do Descanso: quem gastar dados de vida cura +1d6.',

  spellcasting:{
    title:'Conjuração — Bardo', ability:'cha', slots:[4,2], slotRecharge:'long',
    note:'Truques conhecidos: 2 · Magias conhecidas: 6 (pode trocar 1 ao subir de nível). Espaços voltam só no descanso longo. Magia de 1º nível pode ser conjurada com espaço de 2º (Sussurros Dissonantes vira 4d6). Ritual: Detectar Magia pode ser conjurada sem gastar espaço, levando 10 minutos a mais. Foco: um instrumento musical.'
  },
  resources:[
    {id:'insp', name:'Inspiração de Bardo', sub:'d6 · ação bônus · {inspUses} usos · descanso longo', total:c=>Math.max(1,c.cha), recharge:'long'},
  ],
  extraVars: c => ({ half: Math.floor(c.prof/2), inspUses: Math.max(1, c.cha), inspDie:'d6', restDie:'d6' }),

  attacks:[
    {id:'dag', name:'Adaga', ability:'dex', dice:'1d4', type:'perfurante', range:'1,5 m · arremesso 6/18 m'},
    {id:'dw',  name:'Sussurros Dissonantes', save:'Sab', dice:'3d6', useMod:false, type:'psíquico', range:'18 m'},
  ],
  attackNote:'Sussurros Dissonantes não é um ataque: o alvo faz teste de resistência de Sabedoria contra a sua CD <b>{dc}</b> e sofre metade do dano se passar.',
  attackCards:[
    { title:'Adaga', sub:'Arma simples corpo a corpo · Acuidade, Leve, Arremesso (6/18 m) · 1d4 perfurante · 0,5 kg', body:`
      <p><b>Jogada de ataque:</b> 1d20 + {prof} (proficiência) + {dex} (Destreza, por Acuidade) = <b>1d20 {atk_dag}</b> contra a CA do alvo. Vale corpo a corpo ou arremessada.</p>
      <p><b>Dano:</b> 1d4 + {dex} = <b>{dmg_dag}</b> perfurante. Crítico (20 natural): 2d4 {dexS}.</p>
      <p><b>Arremesso:</b> até 6 m sem penalidade; de 6 a 18 m com desvantagem. Arremessar contra um inimigo a 1,5 m de você também tem desvantagem (ataque à distância em corpo a corpo).</p>
      <p><b>Leve:</b> com uma segunda arma leve na outra mão, pode usar a ação bônus para atacar com ela, sem somar o modificador ao dano.</p>
      <p><b>Ataque de oportunidade:</b> quando uma criatura hostil que você vê sai do seu alcance, pode usar a reação para um ataque com a adaga. Se usar a reação em Palavras de Interrupção, não sobra reação para isso.</p>` },
    { title:'Sussurros Dissonantes', sub:'Magia de 1º nível · TR de Sabedoria · 3d6 psíquico · 18 m', body:`
      <p><b>Como funciona:</b> você escolhe uma criatura a até 18 m; ela faz teste de resistência de Sabedoria contra <b>CD {dc}</b>. Falhou: <b>3d6</b> psíquico e usa a reação dela para fugir de você o máximo que puder. Passou: metade do dano e não foge.</p>
      <p><b>Truque de mesa:</b> se o alvo estiver ao lado de um aliado seu, a fuga provoca <b>ataque de oportunidade</b> do aliado. Criatura surda passa automaticamente.</p>
      <p><b>Com espaço de 2º nível:</b> 4d6. Texto completo na aba Magias.</p>` },
  ],

  turnCards:[
    { title:'Ação', sub:'Uma por turno', body:`<ul>
      <li><b>Atacar</b> — adaga ({atk_dag}, {dmg_dag}), corpo a corpo ou arremessada.</li>
      <li><b>Conjurar</b> — Sussurros Dissonantes (CD {dc}, 3d6), Riso Histérico, Enfeitiçar Pessoa, Sugestão, Zona da Verdade, Detectar Magia; truques Amizade e Prestidigitação.</li>
      <li><b>Gerais</b> — Disparada (dobra o movimento), Desengajar (sem ataques de oportunidade), Esquivar (ataques contra você com desvantagem; TR de Des com vantagem), Ajudar, Esconder (Furtividade {sk_furtividade}), Procurar (Percepção {sk_percepcao}), Usar um objeto.</li></ul>` },
    { title:'Ação bônus', sub:'Uma por turno, só se algo conceder', body:`<ul>
      <li><b>Inspiração de Bardo</b> — um aliado a até 18 m que possa ouvi-lo ganha um {inspDie} para somar a um ataque, teste ou resistência nos próximos 10 minutos. {inspUses} usos por descanso longo.</li>
      <li><b>Regra:</b> se conjurar uma magia como ação bônus (nenhuma das suas é), só pode conjurar mais um truque de 1 ação no turno. Inspiração não é magia, então pode inspirar e conjurar no mesmo turno.</li></ul>` },
    { title:'Reação', sub:'Uma por rodada, recupera no início do seu turno', body:`<ul>
      <li><b>Palavras de Interrupção</b> — quando um inimigo a até 18 m que possa ouvi-lo faz um ataque, teste de atributo ou jogada de dano: gasta 1 Inspiração e subtrai {inspDie} do resultado. Pode esperar o número sair, mas decide antes de o mestre dizer se acertou.</li>
      <li><b>Ataque de oportunidade</b> — adaga contra quem sair do seu alcance.</li></ul>` },
    { title:'Regras rápidas', sub:'Movimento, concentração, críticos, 0 PV', body:`<ul>
      <li><b>Movimento:</b> 9 m, pode dividir antes e depois da ação. Levantar-se gasta metade. Terreno difícil custa o dobro.</li>
      <li><b>Concentração:</b> Amizade, Detectar Magia, Riso Histérico e Sugestão exigem concentração — <b>só uma delas por vez</b>; conjurar outra encerra a anterior. Ao sofrer dano, teste de resistência de Constituição ({conS}) CD 10 ou metade do dano, o que for maior.</li>
      <li><b>Vantagem/Desvantagem:</b> rola 2d20 e usa o maior/menor; não acumulam, e se houver as duas, cancelam.</li>
      <li><b>Crítico:</b> 20 natural acerta sempre e dobra todos os dados de dano. 1 natural erra sempre. Magias com teste de resistência não têm crítico.</li>
      <li><b>Cobertura:</b> meia +2 CA e TR de Des; três quartos +5; total não pode ser alvo.</li>
      <li><b>Escuridão / invisível:</b> ataques contra o que não vê têm desvantagem; ataques de quem não é visto têm vantagem. Humano não tem visão no escuro.</li>
      <li><b>0 PV:</b> cai inconsciente. No início de cada turno seu, rola d20: 10+ sucesso, 9− falha; 3 sucessos estabiliza, 3 falhas morre. 1 natural = 2 falhas; 20 natural = volta com 1 PV. Sofrer dano a 0 PV = 1 falha (2 se crítico). Alguém pode estabilizá-lo com Sabedoria (Medicina) CD 10.</li>
      <li><b>Morte instantânea:</b> dano que leve a 0 PV com sobra igual ou maior que o PV máximo mata na hora.</li>
      <li><b>Descanso curto</b> (1 h): gaste dados de vida (1d8 {conS} cada) e, se você tocar, cada um que gastar dados cura +{restDie} (Canção do Descanso). Espaços de Bardo <b>não</b> voltam. <b>Descanso longo</b> (8 h): todos os PV, espaços, Inspirações e metade dos dados de vida (mínimo 1).</li></ul>` },
  ],

  spellSections:[
    {id:'c', title:'Truques'},
    {id:'l1', title:'1º nível', note:'4 espaços de 1º nível. Também podem ser conjuradas com um espaço de 2º.'},
    {id:'l2', title:'2º nível', note:'2 espaços de 2º nível.'},
  ],
  spells:[
    { list:'c', name:'Amizade', sub:'Truque · Encantamento · Concentração', time:'1 ação', range:'Pessoal', comp:'S, M (um pouco de maquiagem aplicada ao rosto ao conjurar)', dur:'Concentração, até 1 minuto',
      desc:[
        'Pela duração, você tem vantagem em todos os testes de Carisma dirigidos a uma criatura à sua escolha que não seja hostil a você. Quando a magia termina, a criatura percebe que você usou magia para influenciar seu humor e fica hostil a você. Uma criatura propensa à violência pode atacá-lo. Outra criatura pode buscar retaliação de outras formas (a critério do mestre), dependendo da natureza da interação com ela.'
      ],
      mine:'<b>Sokomo:</b> vantagem na Persuasão ({sk_persuasao}), Enganação ({sk_enganacao}) ou Intimidação ({sk_intimidacao}) contra uma pessoa por 1 minuto — bom para uma conversa rápida antes de sumir. Ela <b>sempre</b> fica hostil depois: use com quem você não vai rever, ou tenha uma saída pronta. É concentração.' },
    { list:'c', name:'Prestidigitação', sub:'Truque · Transmutação', time:'1 ação', range:'3 m', comp:'V, S', dur:'Até 1 hora',
      desc:[
        'Esta magia é um truque menor que conjuradores iniciantes usam para praticar. Você cria um dos seguintes efeitos mágicos dentro do alcance:',
        '• Um efeito sensorial instantâneo e inofensivo, como uma chuva de faíscas, um sopro de vento, notas musicais suaves ou um odor estranho.',
        '• Acende ou apaga instantaneamente uma vela, uma tocha ou uma pequena fogueira.',
        '• Limpa ou suja instantaneamente um objeto de até 30 cm cúbicos.',
        '• Esfria, aquece ou dá sabor a até 30 cm cúbicos de material não vivo por 1 hora.',
        '• Faz uma cor, uma pequena marca ou um símbolo aparecer num objeto ou numa superfície por 1 hora.',
        '• Cria um bibelô não mágico ou uma imagem ilusória que caiba na sua mão e que dure até o fim do seu próximo turno.',
        'Se você conjurar esta magia várias vezes, pode manter até três dos seus efeitos não instantâneos ativos ao mesmo tempo, e pode dispensar um efeito como uma ação.'
      ],
      mine:'<b>Sokomo:</b> não confundir com a perícia Prestidigitação ({sk_prestidigitacao}, mãos rápidas). Para um nobre: roupa sempre limpa, vinho na temperatura certa, brasão aparecendo na mesa, notas de fundo para uma apresentação.' },
    { list:'l1', name:'Detectar Magia', sub:'1º nível · Adivinhação · Ritual · Concentração', tag:'ok:Ritual', time:'1 ação', range:'Pessoal', comp:'V, S', dur:'Concentração, até 10 minutos',
      desc:[
        'Pela duração, você sente a presença de magia a até 9 m de você. Se sentir magia dessa forma, pode usar sua ação para ver uma aura tênue ao redor de qualquer criatura ou objeto visível na área que tenha magia, e aprende a escola de magia dela, se houver.',
        'A magia pode atravessar a maioria das barreiras, mas é bloqueada por 30 cm de pedra, 2,5 cm de metal comum, uma fina lâmina de chumbo ou 1 m de madeira ou terra.'
      ],
      mine:'<b>Sokomo:</b> conjure como <b>ritual</b> (11 minutos, sem gastar espaço) sempre que houver tempo — antes de tocar num item suspeito, ao entrar num salão. Em combate custa um espaço e concentração.' },
    { list:'l1', name:'Enfeitiçar Pessoa', sub:'1º nível · Encantamento', time:'1 ação', range:'9 m', comp:'V, S', dur:'1 hora',
      desc:[
        'Você tenta enfeitiçar um humanoide que possa ver dentro do alcance. Ele deve fazer um teste de resistência de Sabedoria, e o faz com vantagem se você ou seus companheiros estiverem lutando contra ele. Se falhar, ele fica enfeitiçado por você até a magia acabar ou até você ou seus companheiros fazerem algo prejudicial a ele. A criatura enfeitiçada o considera um conhecido amigável. Quando a magia termina, a criatura sabe que foi enfeitiçada por você.',
        'Em níveis superiores: ao conjurar com um espaço de 2º nível ou superior, você pode afetar uma criatura adicional para cada nível de espaço acima do 1º. As criaturas devem estar a até 9 m umas das outras quando você as escolhe.'
      ],
      mine:'<b>Sokomo:</b> TR de Sabedoria CD <b>{dc}</b>. Só humanoides. "Enfeitiçado" = não pode atacá-lo e você tem vantagem em testes sociais contra ele; não é controle mental. Sem concentração e dura 1 hora — combina com Amizade não, porque ao fim ele sabe que foi enfeitiçado e Amizade o deixa hostil de qualquer jeito. Com espaço de 2º: 2 alvos.' },
    { list:'l1', name:'Riso Histérico de Tasha', sub:'1º nível · Encantamento · Concentração', time:'1 ação', range:'9 m', comp:'V, S, M (tortinhas pequenas e uma pena agitada no ar)', dur:'Concentração, até 1 minuto',
      desc:[
        'Uma criatura à sua escolha que possa ver dentro do alcance percebe tudo como hilariamente engraçado e cai em ataques de riso se a magia a afetar. O alvo deve ser bem-sucedido num teste de resistência de Sabedoria ou cai no chão, ficando caído e incapacitado e incapaz de se levantar pela duração. Uma criatura com Inteligência 4 ou menos não é afetada.',
        'No fim de cada turno seu e sempre que sofrer dano, o alvo pode fazer outro teste de resistência de Sabedoria. O alvo tem vantagem no teste se ele foi desencadeado por dano. Se passar, a magia termina.'
      ],
      mine:'<b>Sokomo:</b> TR de Sabedoria CD <b>{dc}</b>. Tira um inimigo forte da luta: incapacitado não age nem reage, e ataques corpo a corpo contra ele têm <b>vantagem</b> (caído). Mas cada dano dá novo teste com vantagem — melhor deixá-lo rindo enquanto o grupo cuida dos outros, ou bater tudo de uma vez.' },
    { list:'l1', name:'Sussurros Dissonantes', sub:'1º nível · Encantamento', time:'1 ação', range:'18 m', comp:'V', dur:'Instantânea',
      desc:[
        'Você sussurra uma melodia dissonante que só uma criatura à sua escolha dentro do alcance pode ouvir, atormentando-a com uma dor terrível. O alvo deve fazer um teste de resistência de Sabedoria. Se falhar, sofre 3d6 de dano psíquico e deve usar imediatamente sua reação, se disponível, para se mover o máximo que seu deslocamento permitir para longe de você. A criatura não se move para terreno obviamente perigoso, como fogo ou um fosso. Se passar, sofre metade do dano e não precisa se afastar. Uma criatura surda passa automaticamente.',
        'Em níveis superiores: ao conjurar com um espaço de 2º nível ou superior, o dano aumenta em 1d6 para cada nível de espaço acima do 1º.'
      ],
      mine:'<b>Sokomo:</b> TR de Sabedoria CD <b>{dc}</b>, <b>3d6</b> psíquico (4d6 com espaço de 2º). Sem concentração e só componente verbal. A fuga forçada provoca ataques de oportunidade dos seus aliados. Seu melhor dano por espaço.' },
    { list:'l2', name:'Sugestão', sub:'2º nível · Encantamento · Concentração', time:'1 ação', range:'9 m', comp:'V, M (a língua de uma cobra e um favo de mel ou uma gota de óleo doce)', dur:'Concentração, até 8 horas',
      desc:[
        'Você sugere um curso de ação (limitado a uma ou duas frases) a uma criatura que possa ver dentro do alcance e que possa ouvi-lo e entendê-lo. Criaturas que não podem ser enfeitiçadas são imunes a este efeito. A sugestão deve ser formulada de modo a fazer o curso de ação soar razoável. Pedir que a criatura se apunhale, se jogue numa lança, se imole ou faça algo obviamente prejudicial encerra a magia.',
        'O alvo deve fazer um teste de resistência de Sabedoria. Se falhar, segue o curso de ação que você descreveu da melhor forma possível. O curso de ação sugerido pode continuar por toda a duração. Se a atividade sugerida puder ser completada em menos tempo, a magia termina quando o alvo terminar o que foi pedido.',
        'Você também pode especificar condições que disparem uma atividade especial durante a duração. Por exemplo, pode sugerir que um cavaleiro dê seu cavalo de guerra ao primeiro mendigo que encontrar. Se a condição não for cumprida antes de a magia acabar, a atividade não é realizada.',
        'Se você ou qualquer um dos seus companheiros causar dano ao alvo, a magia termina.'
      ],
      mine:'<b>Sokomo:</b> TR de Sabedoria CD <b>{dc}</b>; sem componente somático (mãos ocupadas ok). Até 8 horas de concentração — "vá até a taverna e espere por mim", "deixe-nos passar, somos os inspetores". O alvo não sabe que foi enfeitiçado enquanto durar, ao contrário de Enfeitiçar Pessoa.' },
    { list:'l2', name:'Zona da Verdade', sub:'2º nível · Encantamento', time:'1 ação', range:'18 m', comp:'V, S', dur:'10 minutos',
      desc:[
        'Você cria uma zona mágica que protege contra mentiras numa esfera de 4,5 m de raio centrada num ponto à sua escolha dentro do alcance. Até a magia acabar, uma criatura que entre na área da magia pela primeira vez num turno ou comece seu turno lá deve fazer um teste de resistência de Carisma. Se falhar, a criatura não pode dizer uma mentira deliberada enquanto estiver no raio. Você sabe se cada criatura passou ou falhou no teste de resistência.',
        'Uma criatura afetada está ciente da magia e pode, portanto, evitar responder a perguntas às quais normalmente responderia com uma mentira. Essa criatura pode ser evasiva nas respostas, desde que permaneça dentro dos limites da verdade.'
      ],
      mine:'<b>Sokomo:</b> TR de Carisma CD <b>{dc}</b>; sem concentração. Você sabe quem falhou — ótimo para interrogatório ou para provar sua própria honestidade a um nobre (entre na zona e fale). Quem falhou pode calar-se ou desconversar, então faça perguntas de sim ou não.' },
  ],

  features:[
    { group:'Raça — Humano', src:"Player's Handbook", items:[
      { name:'Aumento de atributo', sub:'Passivo', desc:['Todos os seus valores de atributo aumentam em 1.'], mine:'<b>Já aplicado</b> nos valores da aba Atributos.' },
      { name:'Idade, tamanho, deslocamento e idiomas', sub:'Passivo', desc:['Humanos atingem a maturidade no fim da adolescência e vivem menos de um século. São Médios, com 1,5 m a mais de 1,8 m de altura. Deslocamento base de 9 m. Falam, leem e escrevem Comum e um idioma extra à escolha.'], mine:'<b>Idioma extra:</b> Élfico. Sem visão no escuro.' },
    ]},
    { group:'Classe — Bardo', src:"Player's Handbook · nível {level}", items:[
      { name:'Conjuração', sub:'Nível 1', desc:[
        'Você aprendeu a desembaraçar e remodelar o tecido da realidade em harmonia com seus desejos e sua música. Suas magias fazem parte do seu vasto repertório, uma magia que você pode ajustar a diferentes situações.',
        'Truques: você conhece dois truques da lista do Bardo (mais um no 4º e no 10º nível). Espaços de magia: a tabela do Bardo mostra quantos espaços você tem para conjurar magias de 1º nível ou superior. Você recupera todos os espaços gastos ao terminar um descanso longo.',
        'Magias conhecidas: você conhece magias da lista do Bardo de nível igual ou inferior aos seus espaços (6 no 3º nível). Ao subir de nível, pode trocar uma magia conhecida por outra. Carisma é seu atributo de conjuração. Conjuração em ritual: você pode conjurar qualquer magia conhecida que tenha a marca ritual como ritual. Foco: um instrumento musical.'
      ], mine:'<b>Sokomo:</b> CD <b>{dc}</b> · ataque <b>{spellAtk}</b> · 4 espaços de 1º e 2 de 2º · 2 truques · 6 magias. Ritual: Detectar Magia. Todas as suas magias com teste pedem <b>Sabedoria</b>, exceto Zona da Verdade (Carisma).' },
      { name:'Inspiração de Bardo', sub:'Nível 1 · ação bônus · {inspDie}', desc:[
        'Você pode inspirar os outros com palavras ou música. Para isso, use uma ação bônus no seu turno para escolher uma criatura que não seja você a até 18 m e que possa ouvi-lo. Essa criatura ganha um dado de Inspiração de Bardo, um d6.',
        'Uma vez nos próximos 10 minutos, a criatura pode rolar o dado e somar o resultado a um teste de atributo, jogada de ataque ou teste de resistência que fizer. Ela pode esperar até depois de rolar o d20 para decidir usar o dado, mas deve decidir antes de o mestre dizer se a jogada teve sucesso ou falha. Depois de rolado, o dado é perdido. Uma criatura só pode ter um dado de Inspiração de Bardo de cada vez.',
        'Você pode usar esta característica um número de vezes igual ao seu modificador de Carisma (mínimo 1). Recupera os usos ao terminar um descanso longo. O dado muda quando você atinge certos níveis: d8 no 5º, d10 no 10º, d12 no 15º.'
      ], mine:'<b>Sokomo:</b> <b>{inspUses}</b> usos por descanso longo, marcados na aba Combate. Dê no início do combate a quem vai fazer a jogada mais importante; o dado vale 10 minutos, então pode ser dado antes de uma negociação também.' },
      { name:'Versatilidade', sub:'Nível 2 · passivo', desc:['Você pode somar metade do seu bônus de proficiência, arredondada para baixo, a qualquer teste de atributo que faça que ainda não inclua seu bônus de proficiência.'],
        mine:'<b>Sokomo:</b> +{half} em toda perícia sem proficiência (já somado na lista), em <b>Iniciativa</b> ({ini}) e em ferramentas sem proficiência. Não vale para ataques nem testes de resistência.' },
      { name:'Canção do Descanso', sub:'Nível 2 · {restDie}', desc:['Você pode usar música ou oratória tranquilizadora para ajudar seus aliados feridos a se recuperarem durante um descanso curto. Se você ou qualquer criatura amigável que possa ouvir sua apresentação recuperar pontos de vida ao gastar dados de vida no fim do descanso curto, cada uma dessas criaturas recupera 1d6 pontos de vida extras. O dado muda para d8 no 9º nível, d10 no 13º e d12 no 17º.'],
        mine:'<b>Sokomo:</b> só quem <b>gastar</b> pelo menos um dado de vida ganha o extra, e é uma vez por descanso, não por dado.' },
      { name:'Aptidão', sub:'Nível 3 · passivo', desc:['Escolha duas das suas perícias com proficiência. Seu bônus de proficiência é dobrado em qualquer teste de atributo que use uma dessas perícias. No 10º nível, você escolhe mais duas.'],
        mine:'<b>Sokomo:</b> Persuasão <b>{sk_persuasao}</b> e Prestidigitação <b>{sk_prestidigitacao}</b> (Destreza + 2 × proficiência).' },
      { name:'Colégio do Conhecimento: Proficiências Bônus', sub:'Nível 3', desc:['Ao entrar no Colégio do Conhecimento no 3º nível, você ganha proficiência em três perícias à sua escolha.'],
        mine:'<b>Sokomo:</b> as três que faltavam entre as oito da ficha (provavelmente Arcanismo, Percepção e Religião — a divisão exata não muda nenhum número).' },
      { name:'Colégio do Conhecimento: Palavras de Interrupção', sub:'Nível 3 · reação', desc:[
        'Você aprende a usar sua sagacidade para distrair, confundir e minar a confiança e a competência dos outros. Quando uma criatura que você possa ver a até 18 m de você faz uma jogada de ataque, um teste de atributo ou uma jogada de dano, você pode usar sua reação para gastar um dos seus usos de Inspiração de Bardo, rolando o dado e subtraindo o resultado da jogada da criatura.',
        'Você pode escolher usar esta característica depois que a criatura rolar, mas antes de o mestre determinar se a jogada de ataque ou o teste de atributo teve sucesso ou falha, ou antes de a criatura causar o dano. A criatura é imune se não puder ouvi-lo ou se for imune a ser enfeitiçada.'
      ], mine:'<b>Sokomo:</b> −{inspDie} num ataque que acertou por pouco um aliado, ou no dano de um crítico. Usa os mesmos {inspUses} usos da Inspiração — decida se prefere inspirar ou interromper. Gasta a reação, então nada de ataque de oportunidade na mesma rodada.' },
    ]},
    { group:'Antecedente — Nobre', src:"Player's Handbook", items:[
      { name:'Posição de Privilégio', sub:'Característica de antecedente', desc:['Graças ao seu nascimento nobre, as pessoas tendem a pensar o melhor de você. Você é bem-vindo na alta sociedade, e as pessoas presumem que você tem o direito de estar onde está. O povo comum faz todo o esforço para acomodá-lo e evitar seu desagrado, e outras pessoas de nascimento nobre o tratam como membro da mesma esfera social. Você pode conseguir uma audiência com um nobre local, se precisar.'],
        mine:'<b>Sokomo:</b> anel de sinete e pergaminho de linhagem são a prova. Combine com Persuasão {sk_persuasao} e Sugestão para abrir portas sem sacar a adaga.' },
      { name:'Proficiências e equipamento', sub:'Antecedente', desc:['Perícias: História, Persuasão. Ferramentas: um tipo de jogo. Idiomas: um à sua escolha. Equipamento inicial: roupas finas, um anel de sinete, um pergaminho de linhagem e uma bolsa com 25 po.'],
        mine:'<b>Sokomo:</b> idioma extra Halfling. Registre na aba Mais qual jogo e quais três instrumentos.' },
    ]},
  ],
};
