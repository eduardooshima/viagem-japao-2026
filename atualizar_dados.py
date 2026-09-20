import json
from pathlib import Path
import pandas as pd

EXCEL = Path("/Users/eduardooshima/Library/CloudStorage/OneDrive-Pessoal/Documentos/Plano de Viagens/Japão/Dubai e Japão Otimizado GPT - BI DA VIAGEM v8.xlsx")
SAIDA = Path(__file__).parent / "data.json"

def limpar(valor):
    if pd.isna(valor):
        return None
    if isinstance(valor, pd.Timestamp):
        return valor.isoformat()
    if hasattr(valor, "item"):
        try:
            return valor.item()
        except Exception:
            pass
    return valor

df = pd.read_excel(EXCEL, sheet_name="BI_DATA")
df = df.dropna(how="all")

registros = []
for _, linha in df.iterrows():
    registros.append({
        str(chave): limpar(valor)
        for chave, valor in linha.items()
    })

dados = {
    "version": "auto",
    "source": "BI_DATA",
    "updated": pd.Timestamp.now().isoformat(),
    "rows": registros
}

SAIDA.write_text(
    json.dumps(dados, ensure_ascii=False, indent=2),
    encoding="utf-8"
)

print(f"OK: {len(registros)} registros exportados.")
print(f"Arquivo: {SAIDA}")
