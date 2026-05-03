import os, glob
for f in glob.glob('c:/AnganAI/frontend/src/**/*.jsx', recursive=True):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Safe replacement of the tailwind class
    new_content = content.replace(' italic ', ' ').replace('"italic ', '"').replace(' italic"', '"').replace('italic ', '').replace(' italic', '')
    
    if content != new_content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
