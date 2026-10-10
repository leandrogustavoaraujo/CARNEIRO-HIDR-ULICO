# Pacote otimizado com visual e movimentos originais

Esta versão substitui a entrega anterior de otimização.

O HTML, CSS, JavaScript, fontes e animações da landing permanecem iguais ao ZIP original. Foram preservados os botões animados, o brilho, a faixa em movimento, textos, preços, links de pagamento e redirecionamento. As imagens da landing receberam somente compressão, mantendo dimensões e transparência.

O quiz mantém a apresentação original. A correção do resultado altera apenas o carregamento e a estabilidade das fotos:

- primeira foto antecipada após o carregamento da imagem inicial, enquanto a pessoa responde;
- não espera mais as cinco fotos baixarem para apresentar a primeira;
- versões WebP menores no celular;
- espaço fixo para evitar saltos e cortes durante a troca;
- foto atual permanece visível até a próxima terminar de carregar e decodificar;
- carrossel continua automático e infinito, com três segundos por foto pronta;
- imagens com erro são puladas, com nova tentativa disponível se todas falharem;
- botão da landing continua acessível mesmo quando há falha nas fotos.

## Publicação

Envie todo o conteúdo do ZIP, mantendo index.html na raiz, assets e landing em suas pastas. Esta entrega não publicou nem alterou o site hospedado.

## Tracking

Meta Pixel e UTMify preservados. Parâmetros de campanha seguem do quiz para a landing e para os links de pagamento. Preços mantidos: R$19,90 e R$47,90. O arquivo de redirecionamento de computadores do Brasil é idêntico ao original.

## Verificação

Testes locais em telas de 320, 390 e 768 pixels, rotação da tela, retorno às respostas, ciclo completo do carrossel, fotos lentas, fotos com erro e recuperação. Simulação de conexão 3G a 500 kb/s, latência de 400 ms e CPU quatro vezes mais lenta. Serviços externos de tracking foram simulados para não enviar eventos falsos. O tempo real depende da conexão, hospedagem e serviços externos.
