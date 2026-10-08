# Quiz Sítio Off Grid

Abra `index.html` para testar. O botão final leva a `landing/index.html`, cópia integral do ZIP enviado. O pacote não foi publicado. Envie TODO o conteúdo do ZIP à hospedagem, mantendo as pastas `assets` e `landing`. Não envie apenas o index do quiz.

São seis perguntas, uma por vez. Nas perguntas com uma resposta, marcar avança automaticamente. Na seleção de aparelhos, pode marcar mais de um e tocar em Continuar. Voltar e Rever minhas respostas preservam as escolhas enquanto a página permanece aberta. Não há cadastro, coleta remota nem armazenamento das respostas.

## Foto do cliente

As cinco fotos enviadas estão em `assets`, na ordem de envio, em WebP otimizado. Para trocar ou acrescentar fotos, preencha `clientImages` em `quiz.js`. Troca a cada três segundos, voltando à primeira depois da última, sem limite de ciclos. Rótulos ANTES e DEPOIS acima das respectivas metades. Não há controles, contador ou animação de deslizamento. Fotos com erro são ignoradas. Pausa quando a aba fica oculta e retoma quando fica visível. Nenhum valor ou enquadramento foi refeito; a compressão e a redução de resolução diminuem o peso. A foto quadrada aparece apenas na primeira pergunta. O texto final redundante foi removido.

## Integração e tracking

O botão leva à landing da subpasta e preserva os parâmetros recebidos na URL. A landing os transmite aos checkouts. O Meta Pixel 989728143663966 e UTMify originais foram preservados na landing, com PageView, ViewContent e InitiateCheckout dos planos R$19,90 e R$47,90. No quiz, `tracking.js` reutiliza o mesmo pixel apenas com PageView e o carregador UTMify. Não dispara ViewContent ou InitiateCheckout no quiz. Abertura local por arquivo não dispara tracking do quiz. As respostas não são enviadas.

O redirecionamento de computadores brasileiros da landing foi mantido. Regras adicionais de hospedagem continuam dependendo da configuração do servidor; este ZIP não as altera. Uma regra de roteamento não pode devolver o quiz ao acessar `/landing/index.html`.

Verificados localmente: carregamento, fluxo, repetição do carrossel, navegação até a landing, parâmetros até os checkouts e chamadas locais dos eventos. Nos testes, serviços externos foram substituídos para não gerar eventos artificiais. Isso não confirma recebimento nas contas Meta/UTMify, eventos de compra ou integração de servidor: validar após a publicação.

O resultado usa as respostas para resumir a necessidade e explicar o próximo passo. Não calcula economia, capacidade de baterias nem garante um resultado financeiro.
