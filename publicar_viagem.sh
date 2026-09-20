#!/bin/zsh

EXCEL="/Users/eduardooshima/Library/CloudStorage/OneDrive-Pessoal/Documentos/Plano de Viagens/Japão/Dubai e Japão Otimizado GPT - BI DA VIAGEM v8.xlsx"
PROJETO="/Users/eduardooshima/viagem-japao-2026"

cd "$PROJETO" || exit 1

python3 atualizar_dados.py || exit 1

git add data.json

if git diff --cached --quiet; then
    echo "Nenhuma alteração nos dados."
    exit 0
fi

git commit -m "atualiza dados da viagem"
git push origin main

echo "Atualização publicada no GitHub."
