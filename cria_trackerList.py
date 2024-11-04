import re
import json

# Caminho do arquivo
input_file = 'data/easylistbrasil.txt'
output_file = 'trackerList.json'

# Lista para armazenar os domínios
domains = []

# Expressão regular para encontrar os domínios
pattern = re.compile(r'^\|\|([a-zA-Z0-9.-]+)\^')

# Ler o arquivo e extrair os domínios
with open(input_file, 'r', encoding='utf-8') as file:
    for line in file:
        match = pattern.match(line.strip())
        if match:
            domains.append(match.group(1))

# Salvar os domínios em formato JSON
with open(output_file, 'w', encoding='utf-8') as outfile:
    json.dump(domains, outfile, indent=2)

print(f"Lista de rastreadores extraída com {len(domains)} domínios.")
