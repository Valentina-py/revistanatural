# -*- coding: utf-8 -*-
"""Extrae las imágenes incrustadas en los PDFs de la Revista Natural
y las guarda en assets/img/ con nombres legibles."""
import fitz  # PyMuPDF
import os

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(BASE, "..", "Revista Natural"))
OUT = os.path.join(BASE, "assets", "img", "raw")
os.makedirs(OUT, exist_ok=True)

pdfs = [
    "biodiversidad_oran_actualizado.pdf",
    "RIOS DE ORÁN_20260618_170038_0000.pdf",
    "En conclusión, cuidar el patrimonio natural de Orán requiere del compromiso_20260616_151420_0000.pdf",
]

count = 0
for pdf in pdfs:
    path = os.path.join(SRC, pdf)
    if not os.path.exists(path):
        print("NO EXISTE:", path)
        continue
    doc = fitz.open(path)
    slug = pdf.split(".")[0][:20].replace(" ", "_").replace("/", "_")
    for pno in range(len(doc)):
        for i, img in enumerate(doc.get_page_images(pno)):
            xref = img[0]
            try:
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha >= 4:  # CMYK -> RGB
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                w, h = pix.width, pix.height
                if w < 200 or h < 200:  # descarta iconos pequeños
                    pix = None
                    continue
                fname = f"{slug}_p{pno+1}_{i}_{w}x{h}.png"
                pix.save(os.path.join(OUT, fname))
                print("OK", fname)
                count += 1
                pix = None
            except Exception as e:
                print("ERR", pdf, pno, i, e)
    doc.close()

print(f"\nTOTAL extraidas: {count}")
print("Carpeta:", OUT)
