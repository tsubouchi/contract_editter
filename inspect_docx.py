import sys
from pathlib import Path

try:
    from docx import Document
except ImportError:
    print("python-docx library is required. Install via pip install python-docx")
    sys.exit(1)


def inspect_docx(path: Path):
    doc = Document(path)
    print(f"==== {path.name} ====\n")
    for idx, p in enumerate(doc.paragraphs):
        if '●●' in p.text or p.text.strip().startswith('甲：'):
            print(f"{idx}: {p.text}")
    print('--------------------\n')


def main():
    for f in Path('docs').glob('*.docx'):
        inspect_docx(f)


if __name__ == "__main__":
    main() 