/* Vaelun — dados do personagem. O motor está em ../../shared/sheet.js.
   Chaves entre {chaves} viram números calculados: {dc}, {spellAtk}, {prof}, {level},
   {cha}/{chaS} (modificador), {sk_furtividade} (perícia), {atk_rap}/{dmg_rap} (ataque
   com id "rap"), {ac}, {acShield} e as de extraVars abaixo. */
window.CHAR = {
  id:'vaelun',
  name:'Vaelun',
  subtitle:'Changeling · Bruxo (Lâmina Maldita) · Nível {level} · Charlatão',
  level:3, speed:'9m', hitDie:8,
  scores:{str:9,dex:12,con:14,int:14,wis:14,cha:17},
  scoresNote:'Changeling: +2 Carisma, +1 Sabedoria (já aplicados).',
  saves:['wis','cha'],
  savesNote:'Bruxo é proficiente em Sabedoria e Carisma. Rola-se 1d20 + modificador contra a CD do efeito.',
  skills:{'Arcanismo':'prof','Enganação':'prof','Intuição':'prof','Investigação':'prof','Persuasão':'prof','Prestidigitação':'prof'},
  skillsNote:'Origem: Bruxo (Arcanismo, Investigação) · Charlatão (Enganação, Prestidigitação) · Changeling (Intuição, Persuasão).',
  proficiencies:[
    ['Armaduras','Leves e médias, escudos (Guerreiro Maldito)'],
    ['Armas','Simples e marciais (Guerreiro Maldito)'],
    ['Ferramentas','Kit de disfarce, ferramentas de falsário'],
    ['Idiomas','Comum, Infernal, Silvestre'],
  ],
  proficienciesNote:'Armadura média limita o bônus de Destreza a +2; brunea e meia armadura dão desvantagem em Furtividade. Sem proficiência na armadura vestida, não se conjura magias. Escudo ocupa uma mão: Rajada Mística e Escudo (magia) têm componente somático, então com rapieira e escudo nas mãos é preciso guardar ou soltar algo antes de conjurar (uma interação gratuita por turno) — combinar com o mestre.',
  armorDefault:'scale', shieldDefault:true,
  coins:{gp:'15'},
  items:'Brunea (50 po), escudo (10 po), rapieira (25 po) — comprados com o ouro inicial (4d4 × 10 po); kit de disfarce, ferramentas de falsário, componentes arcanos, mochila, corda (15m), roupas comuns.',
  personality:'Ideal: Tudo é parte de um plano — até a coincidência é dado.\nVínculo: A Regra — raramente dá sua palavra, mas sempre a cumpre.\nFraqueza: Paranoia — vê intenção onde talvez só exista acaso.',
  hpNote:'Dano consome PV temporários primeiro. Bruxo: d8 por nível (1º nível = 8 + Con; depois 1d8 + Con ou 5 + Con por nível). PV temporários não se somam — fica o maior.',
  acNoteExtra:'Escudo (magia): CA {acShield}',
  shortRestMsg:'Descanso curto: espaços e Maldição recuperados.',

  spellcasting:{
    title:'Conjuração — Pacto', ability:'cha', slots:[0,2], slotRecharge:'short',
    slotNote:'todos de {slotLvl}º nível · recupera em descanso curto',
    note:'Truques conhecidos: 2 · Magias conhecidas: 4 (pode trocar 1 ao subir de nível). Toda magia com espaço é conjurada no {slotLvl}º nível. Foco arcano substitui componentes materiais sem custo.'
  },
  resources:[
    {id:'curse', name:'Maldição da Lâmina Maldita', sub:'ação bônus · 1 uso · descanso curto', total:1, recharge:'short'},
  ],
  extraVars: c => ({
    beams: 1 + (c.level>=5) + (c.level>=11) + (c.level>=17),
    slotLvl: Math.min(5, Math.ceil(c.level/2)),
    cmdTargets: Math.min(5, Math.ceil(c.level/2)),
    curseHeal: Math.max(1, c.level + c.cha),
  }),

  attacks:[
    {id:'rap', name:'Rapieira', ability:'cha', dice:'1d8', type:'perfurante', range:'1,5 m'},
    {id:'eb',  name:'Rajada Mística', ability:'cha', dice:'1d10', type:'força', range:'36 m'},
  ],
  attackNote:'Contra alvo com a Maldição da Lâmina Maldita: <b>+{prof}</b> no dano e crítico com <b>19–20</b>.',
  attackCards:[
    { title:'Rapieira', sub:'Arma marcial corpo a corpo · Acuidade · 1d8 perfurante · 1 kg', body:`
      <p><b>Jogada de ataque:</b> 1d20 + {prof} (proficiência) + {cha} (Carisma, por Guerreiro Maldito) = <b>1d20 {atk_rap}</b> contra a CA do alvo.</p>
      <p><b>Dano:</b> 1d8 + {cha} (Carisma) = <b>{dmg_rap}</b> perfurante. Acerto crítico (20 natural): dobra os dados (2d8 {chaS}).</p>
      <p><b>Acuidade:</b> a arma normalmente permite escolher Força ou Destreza; Guerreiro Maldito substitui pelo Carisma enquanto for a arma tocada após o último descanso longo. Qualquer outra arma usa Destreza ({dexS}).</p>
      <p><b>Ação de Ataque:</b> 1 ataque por ação. Com o Pacto da Corrente, você pode abrir mão desse ataque para que o Diabrete ataque com a reação dele (Ferrão +5, 1d4+3 + 3d6 veneno).</p>
      <p><b>Ataque de oportunidade:</b> quando uma criatura hostil que você vê sai do seu alcance (1,5 m), pode usar a reação para um ataque com a rapieira. Se usar a reação para Escudo, não sobra reação para isso.</p>` },
    { title:'Rajada Mística', sub:'Truque · ataque de magia à distância · 36 m · 1d10 força por raio', body:`
      <p><b>Jogada de ataque:</b> 1d20 + {prof} + {cha} = <b>1d20 {atk_eb}</b>. Com {beams} raio(s) no nível {level}; cada raio tem sua própria jogada e pode ir a alvos diferentes.</p>
      <p><b>Dano:</b> 1d10 força + {cha} por raio (Explosão Agonizante) = <b>{dmg_eb}</b>. Crítico: 2d10 {chaS}.</p>
      <p><b>Desvantagem em corpo a corpo:</b> é um ataque à distância — se houver uma criatura hostil a 1,5 m de você que possa vê-lo e não esteja incapacitada, a jogada tem desvantagem. Nesse caso use a rapieira ou Desengaje/Passo das Brumas primeiro.</p>
      <p><b>Não gasta espaço de magia.</b> Componentes V, S: precisa poder falar e ter uma mão livre.</p>` },
  ],

  companion:{
    title:'Familiar — Diabrete', hp:10,
    note:'Sem nome próprio; atende pelo alias que Vaelun estiver usando no momento. Pele branca, albino.',
    sub:'Ínfero (diabo, metamorfo) Miúdo · Leal e Mau · ND 1',
    body:`
      <dl class="stats"><dt>CA</dt><dd>13</dd><dt>PV</dt><dd>10 (3d4+3)</dd><dt>Deslocamento</dt><dd>6 m, voo 12 m</dd></dl>
      <div class="statline"><div><b>For</b>6 (−2)</div><div><b>Des</b>17 (+3)</div><div><b>Con</b>13 (+1)</div><div><b>Int</b>11 (+0)</div><div><b>Sab</b>12 (+1)</div><div><b>Car</b>14 (+2)</div></div>
      <dl class="stats">
        <dt>Perícias</dt><dd>Enganação +4, Intuição +3, Persuasão +4, Furtividade +5</dd>
        <dt>Resistências</dt><dd>frio; concussão, perfurante e cortante de ataques não mágicos que não sejam prateados</dd>
        <dt>Imunidades</dt><dd>fogo, veneno; condição envenenado</dd>
        <dt>Sentidos</dt><dd>visão no escuro 36 m, Percepção passiva 11</dd>
        <dt>Idiomas</dt><dd>Infernal, Comum</dd>
      </dl>
      <p><b>Metamorfo.</b> Pode usar a ação para se transformar numa fera que lembre um rato (desloc. 6 m), um corvo (6 m, voo 18 m) ou uma aranha (6 m, escalada 6 m), ou voltar à forma verdadeira. As estatísticas não mudam, exceto o deslocamento. Equipamento não se transforma. Volta à forma verdadeira se morrer.</p>
      <p><b>Visão do Diabo.</b> Escuridão mágica não atrapalha a visão no escuro dele.</p>
      <p><b>Resistência à Magia.</b> Vantagem em testes de resistência contra magias e outros efeitos mágicos.</p>
      <p><b>Ferrão (Mordida na forma de fera).</b> Ataque corpo a corpo com arma: +5 para acertar, alcance 1,5 m, um alvo. Dano: 5 (1d4+3) perfurante, e o alvo faz teste de resistência de Constituição CD 11, sofrendo 10 (3d6) de dano de veneno se falhar ou metade se passar.</p>
      <p><b>Invisibilidade.</b> Fica invisível magicamente até atacar ou até sua concentração acabar (como se concentrasse numa magia). Equipamento que carrega fica invisível junto.</p>
      <div class="mine"><b>Como familiar:</b> age no seu turno, mas de forma independente e obedecendo suas ordens. Não pode usar a ação de Ataque por conta própria — só ataca quando você cede um dos seus ataques (Pacto da Corrente), usando a reação dele. Telepatia com você a até 30 m (sem limite de distância com Voz do Mestre da Corrente). Se cair a 0 PV, desaparece; conjure Achar Familiar de novo (ritual, 1 hora, 10 po). Pode ser dispensado para um semiplano com uma ação e chamado de volta com outra.</div>`
  },

  turnCards:[
    { title:'Ação', sub:'Uma por turno', body:`<ul>
      <li><b>Atacar</b> — rapieira ({atk_rap}, {dmg_rap}) ou ceder o ataque ao Diabrete.</li>
      <li><b>Rajada Mística</b> — {atk_eb}, {dmg_eb} força, 36 m.</li>
      <li><b>Conjurar</b> — Comando, Detectar Pensamentos (gastam espaço) ou Ilusão Menor (truque).</li>
      <li><b>Metamorfo</b> — mudar de aparência e voz.</li>
      <li><b>Ver pelo familiar</b> — usar os sentidos do Diabrete até o início do próximo turno.</li>
      <li><b>Gerais</b> — Disparada (dobra o movimento), Desengajar (sem ataques de oportunidade), Esquivar (ataques contra você com desvantagem; TR de Des com vantagem), Ajudar, Esconder (Furtividade {sk_furtividade}), Procurar, Usar um objeto.</li></ul>` },
    { title:'Ação bônus', sub:'Uma por turno, só se algo conceder', body:`<ul>
      <li><b>Maldição da Lâmina Maldita</b> — alvo a até 9 m, 1 minuto, 1 uso por descanso curto.</li>
      <li><b>Passo das Brumas</b> — teleporte de 9 m (gasta espaço). No mesmo turno só pode conjurar mais um truque de 1 ação.</li>
      <li><b>Bruxaria</b> — só se for confirmada com o mestre.</li></ul>` },
    { title:'Reação', sub:'Uma por rodada, recupera no início do seu turno', body:`<ul>
      <li><b>Escudo</b> — quando for atingido por um ataque: +5 na CA ({ac} → <b>{acShield}</b>) até o seu próximo turno. Gasta espaço.</li>
      <li><b>Ataque de oportunidade</b> — rapieira contra quem sair do seu alcance.</li>
      <li><b>Diabrete</b> — usa a reação dele para atacar quando você cede um ataque.</li></ul>` },
    { title:'Regras rápidas', sub:'Movimento, concentração, críticos, 0 PV', body:`<ul>
      <li><b>Movimento:</b> 9 m, pode dividir antes e depois da ação. Levantar-se gasta metade. Terreno difícil custa o dobro.</li>
      <li><b>Concentração</b> (Detectar Pensamentos): ao sofrer dano, teste de resistência de Constituição ({conS}) CD 10 ou metade do dano, o que for maior. Conjurar outra magia de concentração, ficar incapacitado ou morrer encerra.</li>
      <li><b>Vantagem/Desvantagem:</b> rola 2d20 e usa o maior/menor; não acumulam, e se houver as duas, cancelam.</li>
      <li><b>Crítico:</b> 20 natural acerta sempre e dobra todos os dados de dano. 1 natural erra sempre. Contra alvo amaldiçoado, 19 também é crítico.</li>
      <li><b>Cobertura:</b> meia +2 CA e TR de Des; três quartos +5; total não pode ser alvo.</li>
      <li><b>Escuridão / invisível:</b> ataques contra o que não vê têm desvantagem; ataques de quem não é visto têm vantagem. Vaelun não tem visão no escuro.</li>
      <li><b>0 PV:</b> cai inconsciente. No início de cada turno seu, rola d20: 10+ sucesso, 9− falha; 3 sucessos estabiliza, 3 falhas morre. 1 natural = 2 falhas; 20 natural = volta com 1 PV. Sofrer dano a 0 PV = 1 falha (2 se crítico). Alguém pode estabilizá-lo com Sabedoria (Medicina) CD 10.</li>
      <li><b>Morte instantânea:</b> dano que leve a 0 PV com sobra igual ou maior que o PV máximo mata na hora.</li>
      <li><b>Descanso curto</b> (1 h): gaste dados de vida (1d8 {conS} cada) e recupere espaços de magia e a Maldição. <b>Descanso longo</b> (8 h): todos os PV, metade dos dados de vida (mínimo 1) e volta a escolher a arma do Guerreiro Maldito.</li></ul>` },
  ],

  spellSections:[
    {id:'c', title:'Truques'},
    {id:'l1', title:'1º nível'},
    {id:'l2', title:'2º nível'},
    {id:'r', title:'Ritual (Pacto da Corrente)'},
    {id:'p', title:'Pendente de confirmação', note:'Bruxo de {level}º nível conhece 4 magias — para pegar Bruxaria seria preciso trocar uma das atuais. Mantida aqui para decidir com o mestre.'},
  ],
  spells:[
    { list:'c', name:'Rajada Mística', sub:'Truque · Evocação', time:'1 ação', range:'36 m', comp:'V, S', dur:'Instantânea',
      desc:[
        'Um raio de energia crepitante dispara na direção de uma criatura dentro do alcance. Faça um ataque de magia à distância contra o alvo. Se acertar, o alvo sofre 1d10 de dano de força.',
        'Em níveis superiores: a magia cria mais de um raio quando você alcança níveis mais altos: dois raios no 5º nível, três no 11º e quatro no 17º. Você pode direcionar os raios ao mesmo alvo ou a alvos diferentes. Faça uma jogada de ataque separada para cada raio.'
      ],
      mine:'<b>Vaelun:</b> ataque <b>1d20 {atk_eb}</b>; cada raio que acerta causa <b>{dmg_eb}</b> de força (Explosão Agonizante soma o Carisma). {beams} raio(s) no {level}º nível. É o seu ataque padrão à distância e não gasta espaço. Em corpo a corpo a jogada tem desvantagem.' },
    { list:'c', name:'Ilusão Menor', sub:'Truque · Ilusão', time:'1 ação', range:'9 m', comp:'S, M (um pouco de lã)', dur:'1 minuto',
      desc:[
        'Você cria um som ou uma imagem de um objeto dentro do alcance, que dura pela duração. A ilusão também termina se você a dispensar (sem precisar de ação) ou conjurar esta magia novamente.',
        'Se você criar um som, seu volume pode variar de um sussurro a um grito. Pode ser sua voz, a voz de outra pessoa, o rugido de um leão, o rufar de tambores ou qualquer outro som que escolher. O som continua inalterado pela duração, ou você pode criar sons distintos em momentos diferentes antes de a magia acabar.',
        'Se você criar a imagem de um objeto — como uma cadeira, pegadas enlameadas ou um baú pequeno — ela deve caber num cubo de 1,5 m. A imagem não produz som, luz, cheiro ou qualquer outro efeito sensorial. Interação física com a imagem revela que é uma ilusão, pois as coisas a atravessam.',
        'Se uma criatura usar sua ação para examinar o som ou a imagem, ela descobre que é uma ilusão com um teste de Inteligência (Investigação) bem-sucedido contra a sua CD de magia. Se perceber a ilusão como tal, ela se torna tênue para a criatura.'
      ],
      mine:'<b>Vaelun:</b> CD para descobrir <b>{dc}</b>. Só componente somático — funciona mesmo amordaçado. Usos de charlatão: imitar a voz de um alias, criar um "baú" para se esconder atrás, um som para o Diabrete se aproveitar, pegadas falsas.' },
    { list:'l1', name:'Comando', sub:'1º nível · Encantamento', tag:'warn:Confirmar', time:'1 ação', range:'18 m', comp:'V', dur:'Instantânea',
      desc:[
        'Você profere uma palavra de comando para uma criatura que possa ver dentro do alcance. O alvo deve ser bem-sucedido num teste de resistência de Sabedoria ou seguir o comando no seu próximo turno. A magia não tem efeito se o alvo for um morto-vivo, se ele não entender seu idioma ou se o seu comando for diretamente prejudicial a ele.',
        'Alguns comandos típicos e seus efeitos: <b>Aproxime-se</b> — o alvo se move na sua direção pela rota mais curta e direta, terminando o turno se chegar a 1,5 m de você. <b>Largue</b> — o alvo solta o que estiver segurando e termina o turno. <b>Fuja</b> — o alvo gasta o turno se afastando de você pelo meio mais rápido disponível. <b>Deite-se</b> — o alvo cai no chão e termina o turno. <b>Pare</b> — o alvo não se move nem faz nenhuma ação.',
        'Você pode dar um comando diferente desses; nesse caso, o mestre determina como o alvo se comporta. Se o alvo não puder seguir seu comando, a magia termina.',
        'Em níveis superiores: ao conjurar com um espaço de 2º nível ou superior, você pode afetar uma criatura adicional para cada nível de espaço acima do 1º. As criaturas devem estar a até 9 m umas das outras quando você as escolhe.'
      ],
      mine:'<b>Vaelun:</b> TR de Sabedoria CD <b>{dc}</b>. Seus espaços são todos de {slotLvl}º nível, então Comando afeta <b>{cmdTargets}</b> criaturas. Só componente verbal: funciona com as mãos ocupadas. <b>Atenção:</b> Comando não está na lista do Bruxo nem na lista expandida da Lâmina Maldita (PHB/Xanathar) — confirmar com o mestre.' },
    { list:'l1', name:'Escudo', sub:'1º nível · Abjuração', tag:'ok:Lâmina Maldita', time:'1 reação, quando você é atingido por um ataque ou é alvo de Mísseis Mágicos', range:'Pessoal', comp:'V, S', dur:'1 rodada',
      desc:['Uma barreira invisível de força mágica aparece e protege você. Até o início do seu próximo turno, você recebe +5 de bônus na CA, inclusive contra o ataque que desencadeou a magia, e não sofre dano de Mísseis Mágicos.'],
      mine:'<b>Vaelun:</b> CA {ac} → <b>{acShield}</b> até o seu próximo turno, valendo contra o ataque que já acertou (pode transformar um acerto em erro). Gasta 1 espaço e a sua reação da rodada. Vem da lista expandida da Lâmina Maldita.' },
    { list:'l2', name:'Passo das Brumas', sub:'2º nível · Conjuração', time:'1 ação bônus', range:'Pessoal', comp:'V', dur:'Instantânea',
      desc:['Brevemente envolto em névoa prateada, você se teleporta até 9 m para um espaço desocupado que possa ver.'],
      mine:'<b>Vaelun:</b> sai de um agarrão ou de um cerco sem provocar ataque de oportunidade, cruza abismos e grades. Regra da ação bônus: no turno em que conjura uma magia como ação bônus, a única outra magia que pode conjurar é um truque de 1 ação — Rajada Mística sim, Comando ou Detectar Pensamentos não.' },
    { list:'l2', name:'Detectar Pensamentos', sub:'2º nível · Adivinhação · Concentração', tag:'warn:Confirmar', time:'1 ação', range:'Pessoal', comp:'V, S, M (uma moeda de cobre)', dur:'Concentração, até 1 minuto',
      desc:[
        'Pela duração, você pode ler os pensamentos de certas criaturas. Ao conjurar a magia e como sua ação em cada turno até ela acabar, você pode focar sua mente em qualquer criatura que possa ver a até 9 m. Se a criatura escolhida tiver Inteligência 3 ou menos ou não falar nenhum idioma, ela não é afetada.',
        'Inicialmente você aprende os pensamentos superficiais da criatura — o que está mais presente na mente dela naquele momento. Como uma ação, você pode desviar a atenção para os pensamentos de outra criatura ou tentar sondar mais fundo na mesma mente. Se sondar mais fundo, o alvo deve fazer um teste de resistência de Sabedoria. Se falhar, você obtém informações sobre o raciocínio dele (se houver), seu estado emocional e algo que ocupe muito a mente dele (como algo com que se preocupa, ama ou odeia). Se for bem-sucedido, a magia termina. De qualquer forma, o alvo sabe que você está sondando sua mente e, a menos que você desvie a atenção para os pensamentos de outra criatura, ele pode usar a ação no turno dele para fazer um teste de Inteligência resistido pelo seu teste de Inteligência; se vencer, a magia termina.',
        'Perguntas dirigidas verbalmente à criatura alvo moldam naturalmente o curso dos pensamentos dela, então esta magia é especialmente eficaz como parte de um interrogatório.',
        'Você também pode usar esta magia para detectar a presença de criaturas pensantes que não possa ver. Ao conjurar a magia ou como sua ação durante a duração, você pode procurar pensamentos a até 9 m. A magia atravessa barreiras, mas é bloqueada por 60 cm de pedra, 5 cm de qualquer metal que não seja chumbo ou uma fina lâmina de chumbo. Você não pode detectar uma criatura com Inteligência 3 ou menos ou que não fale nenhum idioma. Ao detectar a presença de uma criatura dessa forma, você pode ler os pensamentos dela pelo resto da duração como descrito acima, mesmo sem vê-la, mas ela ainda precisa estar dentro do alcance.'
      ],
      mine:'<b>Vaelun:</b> TR de Sabedoria CD <b>{dc}</b> para sondar fundo; teste de Inteligência resistido usa o seu <b>{intS}</b>. Concentração: ao sofrer dano, TR de Constituição ({conS}) CD 10 ou metade do dano. Cai como uma luva na paranoia do personagem. <b>Atenção:</b> não está na lista do Bruxo (é magia do patrono Grande Antigo, de Bardo, Feiticeiro e Mago) — confirmar com o mestre.' },
    { list:'r', name:'Achar Familiar', sub:'1º nível · Conjuração · Ritual', tag:'ok:Pacto da Corrente', time:'1 hora', range:'3 m', comp:'V, S, M (10 po de carvão, incenso e ervas, consumidos em fogo num braseiro de latão)', dur:'Instantânea',
      desc:[
        'Você ganha o serviço de um familiar, um espírito que assume forma animal à sua escolha. Aparecendo num espaço desocupado dentro do alcance, o familiar tem as estatísticas da forma escolhida, embora seja um celestial, feérico ou ínfero (à sua escolha) em vez de uma fera. Com o Pacto da Corrente, pode ser um diabrete, pseudodragão, quasit ou sprite.',
        'Seu familiar age de forma independente, mas sempre obedece seus comandos. Em combate, rola sua própria iniciativa e age no próprio turno. Um familiar não pode atacar, mas pode realizar outras ações normalmente.',
        'Quando o familiar cai a 0 pontos de vida, ele desaparece, sem deixar forma física. Ele reaparece quando você conjura esta magia de novo. Enquanto estiver a até 30 m de você, vocês podem se comunicar telepaticamente. Além disso, como uma ação, você pode ver pelos olhos do familiar e ouvir o que ele ouve até o início do seu próximo turno, ganhando os sentidos especiais que ele tiver. Durante esse tempo, você fica surdo e cego aos seus próprios sentidos.',
        'Como uma ação, você pode dispensar temporariamente o familiar. Ele desaparece para um semiplano, onde aguarda seu chamado. Ou pode dispensá-lo para sempre. Como uma ação enquanto ele estiver dispensado temporariamente, você pode fazê-lo reaparecer em qualquer espaço desocupado a até 9 m de você.',
        'Você não pode ter mais de um familiar por vez. Se conjurar de novo enquanto já tem um, ele adota uma nova forma à sua escolha.',
        'Por fim, quando você conjura uma magia com alcance de toque, seu familiar pode entregá-la como se tivesse conjurado. Ele deve estar a até 30 m de você e usa a reação dele para entregar quando você conjura.'
      ],
      mine:'<b>Vaelun:</b> aprendida pelo Pacto da Corrente; não conta como magia conhecida. Conjure como ritual (10 minutos a mais, sem gastar espaço). O Diabrete ataca só quando você cede um ataque da ação de Atacar. Com Voz do Mestre da Corrente, a telepatia e os sentidos não têm limite de distância no mesmo plano.' },
    { list:'p', name:'Bruxaria (Hex)', sub:'1º nível · Encantamento · Concentração', tag:'warn:Não confirmada', time:'1 ação bônus', range:'27 m', comp:'V, S, M (o olho petrificado de um tritão)', dur:'Concentração, até 1 hora',
      desc:[
        'Você lança uma maldição sobre uma criatura que possa ver dentro do alcance. Até a magia acabar, você causa 1d6 de dano necrótico extra ao alvo sempre que o atingir com um ataque. Além disso, escolha um atributo ao conjurar a magia: o alvo tem desvantagem em testes de atributo feitos com o atributo escolhido.',
        'Se o alvo cair a 0 pontos de vida antes de a magia acabar, você pode usar uma ação bônus num turno posterior seu para amaldiçoar uma nova criatura.',
        'Remover Maldição conjurado no alvo encerra esta magia antes do tempo.',
        'Em níveis superiores: com um espaço de 3º ou 4º nível, você pode manter a concentração por até 8 horas. Com espaço de 5º nível ou superior, por até 24 horas.'
      ],
      mine:'<b>Se entrar:</b> cada raio da Rajada Mística que acertar o alvo causa {dmg_eb} + 1d6 necrótico; a rapieira, {dmg_rap} + 1d6. Combina com a Maldição da Lâmina Maldita, mas as duas são ações bônus — leva 2 turnos para aplicar ambas.' },
  ],

  features:[
    { group:'Raça — Changeling', src:'Eberron: Rising from the Last War', items:[
      { name:'Metamorfo', use:'action', sub:'1 ação', desc:[
        'Como uma ação, você pode mudar sua aparência e sua voz. Você determina os detalhes das mudanças, incluindo coloração, comprimento do cabelo e sexo. Também pode ajustar sua altura e peso, mas não a ponto de mudar sua categoria de tamanho. Pode se fazer parecer membro de outra raça, mas nenhuma das suas estatísticas de jogo muda. Não pode duplicar a aparência de uma criatura que nunca viu e deve adotar uma forma que tenha a mesma disposição básica de membros que a sua. Suas roupas e equipamento não são alterados por este traço.',
        'Você permanece na nova forma até usar uma ação para voltar à sua forma verdadeira ou até morrer.'
      ], mine:'<b>Na prática:</b> não é magia nem ilusão — Detectar Magia não acusa e Dissipar Magia não desfaz. Para se passar por alguém específico, o mestre pode pedir Carisma (Enganação) <b>{sk_enganacao}</b> contra a Intuição de quem conhece a pessoa. Roupas precisam ser trocadas de verdade (kit de disfarce ajuda).' },
      { name:'Instintos de Metamorfo', use:'passive', sub:'Passivo', desc:['Você ganha proficiência em duas das seguintes perícias, à sua escolha: Enganação, Intimidação, Intuição ou Persuasão.'],
        mine:'<b>Escolhidas:</b> Intuição ({sk_intuicao}) e Persuasão ({sk_persuasao}).' },
      { name:'Tamanho, deslocamento e idiomas', use:'passive', sub:'Passivo', desc:['Changelings são Médios, com 1,5 m a 1,8 m de altura. Deslocamento base de 9 m. Falam, leem e escrevem Comum e dois outros idiomas à escolha.'],
        mine:'<b>Idiomas:</b> Comum, Infernal (língua do Diabrete) e Silvestre. Sem visão no escuro.' },
    ]},
    { group:'Classe — Bruxo', src:"Player's Handbook · nível {level}", items:[
      { name:'Trabalho com Magia (Pacto)', use:'passive', sub:'Nível 1', desc:[
        'Sua pesquisa arcana e a magia concedida pelo seu patrono lhe deram acesso a magias. Você conhece 2 truques da lista do Bruxo (mais 1 no 4º e 10º nível) e magias de nível igual ou inferior ao dos seus espaços.',
        'Espaços de magia: a tabela do Bruxo mostra quantos espaços você tem e o nível deles. Você recupera todos os espaços gastos ao terminar um descanso curto ou longo. Toda magia que exija espaço é conjurada no nível dos seus espaços.',
        'Magias conhecidas: ao subir de nível, você pode trocar uma das magias conhecidas por outra da lista do Bruxo. Carisma é seu atributo de conjuração. Você pode usar um foco arcano como foco de conjuração.'
      ], mine:'<b>Vaelun:</b> 2 espaços de {slotLvl}º nível · CD <b>{dc}</b> · ataque <b>{spellAtk}</b> · 2 truques · 4 magias conhecidas. Como só tem 2 espaços, use Rajada Mística para o dia a dia e guarde os espaços para Escudo e Passo das Brumas.' },
      { name:'Patrono Sobrenatural: Lâmina Maldita', use:'passive', sub:'Nível 1', desc:['Você fez um pacto com uma entidade misteriosa do Shadowfell — a força que se manifesta em armas sencientes como a Espada Negra. Sua lista de magias é expandida: 1º Escudo, Golpe Colérico; 2º Borrão, Golpe Marcante; 3º Piscar, Arma Elemental; 4º Assassino Fantasmagórico, Golpe Atordoante; 5º Golpe Banidor, Cone de Frio.'],
        mine:"<b>Vaelun:</b> Escudo vem desta lista. Fonte: Xanathar's Guide to Everything." },
      { name:'Maldição da Lâmina Maldita', use:'bonus', sub:'Nível 1 · ação bônus · 1 uso por descanso curto', desc:[
        'Como uma ação bônus, escolha uma criatura que possa ver a até 9 m de você. O alvo fica amaldiçoado por 1 minuto. A maldição termina antes se o alvo morrer, se você morrer ou se você ficar incapacitado. Até a maldição acabar, você recebe os seguintes benefícios:',
        '• Você ganha um bônus nas jogadas de dano contra o alvo amaldiçoado igual ao seu bônus de proficiência.',
        '• Qualquer jogada de ataque sua contra o alvo amaldiçoado é um acerto crítico se o resultado do d20 for 19 ou 20.',
        '• Se o alvo amaldiçoado morrer, você recupera pontos de vida iguais ao seu nível de Bruxo + seu modificador de Carisma (mínimo 1).',
        'Você não pode usar esta característica de novo até terminar um descanso curto ou longo.'
      ], mine:'<b>Vaelun:</b> +{prof} de dano por acerto e crítico em 19–20; se o alvo morrer, recupera <b>{curseHeal}</b> PV. Rajada Mística contra amaldiçoado: {dmg_eb} + {prof}. Rapieira: {dmg_rap} + {prof}. Marque o uso na aba Combate.' },
      { name:'Guerreiro Maldito', use:['passive','rest'], sub:'Nível 1', desc:[
        'Você adquire o treinamento necessário para se armar para a batalha: ganha proficiência com armaduras médias, escudos e armas marciais.',
        'A influência do seu patrono também permite canalizar misticamente sua vontade através de uma arma específica. Sempre que terminar um descanso longo, você pode tocar uma arma com a qual tenha proficiência e que não tenha a propriedade Duas Mãos. Ao atacar com essa arma, você pode usar seu modificador de Carisma, em vez de Força ou Destreza, nas jogadas de ataque e de dano. Esse benefício dura até você terminar um descanso longo. Se mais tarde ganhar o Pacto da Lâmina, o benefício se estende a toda arma de pacto que conjurar.'
      ], mine:'<b>Vaelun:</b> arma tocada = rapieira → <b>{atk_rap}</b> para acertar, <b>{dmg_rap}</b>. Uma segunda arma no meio do dia usaria Destreza ({dexS}). Pode vestir armadura média e escudo sem perder magia — veja a aba Mais.' },
      { name:'Invocação: Explosão Agonizante', use:'passive', sub:'Nível 2 · pré-requisito: Rajada Mística', desc:['Quando você conjura Rajada Mística, some seu modificador de Carisma ao dano causado por cada raio que acertar.'],
        mine:'<b>Vaelun:</b> +{cha} por raio → {dmg_eb}.' },
      { name:'Invocação: Voz do Mestre da Corrente', use:['free','action'], sub:'Nível 2 · pré-requisito: Pacto da Corrente', desc:['Você pode se comunicar telepaticamente com seu familiar e perceber através dos sentidos dele enquanto estiverem no mesmo plano de existência. Além disso, enquanto percebe através dos sentidos do familiar, você também pode falar através dele com sua própria voz, mesmo que o familiar normalmente seja incapaz de falar.'],
        mine:'<b>Na prática:</b> o Diabrete vira um espião sem limite de distância. Invisível, ele entra num lugar; você vê, ouve e pode falar pela boca dele — inclusive na voz do alias da vez.' },
      { name:'Dádiva do Pacto: Pacto da Corrente', use:['action','ritual'], sub:'Nível 3', desc:[
        'Você aprende a magia Achar Familiar e pode conjurá-la como um ritual. A magia não conta no seu número de magias conhecidas.',
        'Ao conjurar a magia, você pode escolher uma das formas normais para o familiar ou uma das seguintes formas especiais: diabrete, pseudodragão, quasit ou sprite.',
        'Além disso, quando você realiza a ação de Ataque, pode abrir mão de um dos seus próprios ataques para permitir que seu familiar faça um ataque com a reação dele.'
      ], mine:'<b>Vaelun:</b> Diabrete (Ferrão +5, 1d4+3 perfurante + 3d6 veneno, CD 11 Con para metade). Vale a pena ceder o ataque da rapieira ({dmg_rap}) quando o Diabrete pode picar — a média do veneno sozinha é 10.' },
    ]},
    { group:'Antecedente — Charlatão', src:"Player's Handbook", items:[
      { name:'Identidade Falsa', use:'social', sub:'Característica de antecedente', desc:['Você criou uma segunda identidade que inclui documentação, conhecidos estabelecidos e disfarces que permitem assumir essa persona. Além disso, você pode falsificar documentos, incluindo papéis oficiais e cartas pessoais, desde que já tenha visto um exemplo do tipo de documento ou da caligrafia que está tentando copiar.'],
        mine:'<b>Vaelun:</b> com Metamorfo, a "segunda identidade" pode ser literalmente outro rosto — e o Diabrete atende pelo nome do alias do momento. Falsificação usa as ferramentas de falsário (proficiência +{prof}).' },
      { name:'Proficiências e equipamento', use:'passive', sub:'Antecedente', desc:['Perícias: Enganação, Prestidigitação. Ferramentas: kit de disfarce, ferramentas de falsário. Equipamento inicial: roupas finas, kit de disfarce, ferramentas do golpe (dez garrafas fechadas com líquido colorido, dados viciados, baralho marcado ou anel de sinete de um duque imaginário) e uma bolsa com 15 po.'] },
    ]},
  ],
};
