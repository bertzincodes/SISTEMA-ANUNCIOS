SISTEMA DE PROPAGANDAS - WINDOWS
================================

V1 - Player local de fotos e vídeos para monitor vertical.

REQUISITOS
----------
Windows 10/11
Node.js instalado
Internet apenas para instalar as dependências.

COMO EXECUTAR
-------------
1. Abra o Prompt de Comando nesta pasta.
2. Execute:
   npm install
3. Depois:
   npm start

COMO USAR
---------
1. Clique em "Adicionar fotos/vídeos".
2. Selecione suas mídias.
3. Defina o tempo das fotos.
4. Organize a ordem com ↑ e ↓.
5. Clique em "Abrir Player".
6. O player utiliza tela cheia e, quando houver dois monitores,
   tenta abrir no segundo monitor.

FORMATOS
--------
Fotos: JPG, JPEG, PNG, WEBP, GIF
Vídeos: MP4, WEBM, MOV, M4V

OBSERVAÇÃO
----------
A V1 trabalha localmente e salva os arquivos na pasta de dados
do aplicativo. O banco de dados é um arquivo JSON local.

PRÓXIMOS PASSOS POSSÍVEIS
-------------------------
- iniciar automaticamente com o Windows;
- modo kiosk com senha para sair;
- agendamento por horário;
- várias playlists;
- relógio/data na tela;
- logotipo fixo;
- controle remoto pela rede;
- banco de dados central para vários monitores;
- instalador .exe.
