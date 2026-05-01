---
status: open
priority: "0"
dateCreated: 2026-01-28T10:40:29.013-05:00
dateModified: 2026-01-28T10:40:29.013-05:00
reminders:
  - id: rem_1769614825802_94ozn2p2b
    type: relative
    description: ""
    relatedTo: scheduled
    offset: -PT0H
tags:
  - task
---
## Synthesis

### Solution
- Use `marker-pdf 1.10.2` or whichever is the most updated version
- Can find the code here 
	- Private: https://colab.research.google.com/drive/154to5pu0QtyG-d0BI055li6GOxu8pCgw#scrollTo=7c75f39c
	- Public: https://colab.research.google.com/drive/1cZ7O5GWfZiLKO5O0h_N6FSCxgy0vKe0E#scrollTo=QxCadXZhlOBz
- Don't save builds because you want to make sure you get the most up-to-date one
#### Convert PDF to OCR
```python
'''
	FIRST CELL BLOCK
'''
!pip install marker-pdf[full]

'''
	SECOND CELL BLOCK
'''
import os
from google.colab import files

# 1. Create folders
!mkdir -p input_pdfs
!mkdir -p output_results

# 2. Upload the file (A "Choose File" button will appear below)
print("Please upload your Train.pdf file:")
uploaded = files.upload()

# 3. Move whatever was uploaded into the input folder
for filename in uploaded.keys():
    os.rename(filename, os.path.join("input_pdfs", filename))
    print(f"Moved {filename} to input_pdfs/")

# 4. Run Marker
!marker input_pdfs --output_dir output_results

'''
	THIRD CELL BLOCK
'''
import shutil
from google.colab import files

# Define the directory to be zipped and the name of the zip file
output_dir = 'output_results'
zip_filename = 'output_results.zip'

# Create a zip archive of the output_results directory
shutil.make_archive(zip_filename.split('.')[0], 'zip', output_dir)
print(f'Created {zip_filename} containing all generated files.')

# Offer the zip file for download
files.download(zip_filename)
```
#### Convert PDF to OCR 2
```python
!pip install marker-pdf[full] -q

import torch

assert torch.cuda.is_available(), (
    "❌ No GPU detected! Go to Runtime → Change runtime type → T4 GPU and reconnect."
)
print(f"✅ GPU confirmed: {torch.cuda.get_device_name(0)}")
print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

```python
import os, pathlib, shutil, re, torch
from google.colab import files
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict

# ── Upload ─────────────────────────────────────────────────────
os.makedirs("input_pdfs",     exist_ok=True)
os.makedirs("output_results", exist_ok=True)

print("Upload your PDF:")
uploaded = files.upload()
for filename in uploaded:
    dest = f"input_pdfs/{filename}"
    os.rename(filename, dest)
    print(f"Saved → {dest}")

# ── Load models onto GPU ───────────────────────────────────────
print("\nLoading models onto GPU…")
model_dict = create_model_dict()
print("✅ Models loaded")

# ── Convert ────────────────────────────────────────────────────
PDF_PATH = next(pathlib.Path("input_pdfs").glob("*.pdf"))
print(f"\nConverting: {PDF_PATH.name}")

converter = PdfConverter(
    config = {
        "output_format"           : "markdown",
        "paginate_output"         : False,
        "disable_image_extraction": False,
        "dpi"                     : 300,
    },
    artifact_dict = model_dict,
)

rendered = converter(str(PDF_PATH))

# ── Save markdown + images ─────────────────────────────────────
out_dir = pathlib.Path("output_results") / PDF_PATH.stem
out_dir.mkdir(parents=True, exist_ok=True)

markdown = rendered.markdown

# Save every image as PNG, fix refs in markdown
image_count = 0
for img_filename, img in rendered.images.items():
    old_stem = pathlib.Path(img_filename).stem
    new_filename = old_stem + ".png"
    img_path = out_dir / new_filename

    # Convert mode so PNG encoder is happy
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    img.save(str(img_path), format="PNG")

    # Update any reference to the old filename in markdown
    markdown = markdown.replace(img_filename, new_filename)
    image_count += 1

# Save markdown
md_path = out_dir / (PDF_PATH.stem + ".md")
md_path.write_text(markdown, encoding="utf-8")

print(f"\n✅ Done!")
print(f"   Markdown  →  {md_path}  ({len(markdown):,} chars)")
print(f"   Images    →  {out_dir}/  ({image_count} files)")

# ── Zip & download ─────────────────────────────────────────────
zip_path = str(pathlib.Path("output_results") / PDF_PATH.stem)
shutil.make_archive(zip_path, "zip", out_dir)
files.download(f"{zip_path}.zip")
```

#### Convert to Markdown 3 (fixeds upload issues)

```python
!pip install marker-pdf[full] -q

import torch

assert torch.cuda.is_available(), (
    "❌ No GPU detected! Go to Runtime → Change runtime type → T4 GPU and reconnect."
)
print(f"✅ GPU confirmed: {torch.cuda.get_device_name(0)}")
print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

```python
import os, pathlib, shutil, re, torch
from google.colab import files
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict

print("🧹 Cleaning up old files to prevent mix-ups...")
shutil.rmtree("input_pdfs", ignore_errors=True)
shutil.rmtree("output_results", ignore_errors=True)

os.makedirs("input_pdfs", exist_ok=True)
os.makedirs("output_results", exist_ok=True)

# ── Upload ─────────────────────────────────────────────────────
print("📤 Upload your PDF:")
uploaded = files.upload()

# Get the exact filename Colab saved (handles duplicates automatically)
uploaded_filename = list(uploaded.keys())[0]
dest = f"input_pdfs/{uploaded_filename}"
os.rename(uploaded_filename, dest)

print(f"✅ Saved strictly as → {dest}")

# ── Load models onto GPU ───────────────────────────────────────
print("\nLoading models onto GPU…")
model_dict = create_model_dict()
print("✅ Models loaded")

# ── Convert ────────────────────────────────────────────────────
# We now force the converter to use EXACTLY the file you just uploaded
PDF_PATH = pathlib.Path(dest)
print(f"\n🚀 CONVERTING EXACT FILE: {PDF_PATH.name}")

converter = PdfConverter(
    config = {
        "output_format"   : "markdown",
        "paginate_output" : False,
        "extract_images"  : True,   
        "IMAGE_DPI"       : 300,    
        "SURYA_LAYOUT_DPI": 300,    
    },
    artifact_dict = model_dict,
)

rendered = converter(str(PDF_PATH))

# ── Save markdown + images ─────────────────────────────────────
out_dir = pathlib.Path("output_results") / PDF_PATH.stem
out_dir.mkdir(parents=True, exist_ok=True)

markdown = rendered.markdown

# Save every image as PNG, fix refs in markdown
image_count = 0
for img_filename, img in rendered.images.items():
    old_stem = pathlib.Path(img_filename).stem
    new_filename = old_stem + ".png"
    img_path = out_dir / new_filename

    # Convert mode so PNG encoder is happy
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    
    img.save(str(img_path), format="PNG")

    # Update any reference to the old filename in markdown
    markdown = markdown.replace(img_filename, new_filename)
    image_count += 1

# Save markdown
md_path = out_dir / (PDF_PATH.stem + ".md")
md_path.write_text(markdown, encoding="utf-8")

print(f"\n✅ Done!")
print(f"   Markdown  →  {md_path}  ({len(markdown):,} chars)")
print(f"   Images    →  {out_dir}/  ({image_count} files)")

# ── Zip & download ─────────────────────────────────────────────
zip_path = str(pathlib.Path("output_results") / PDF_PATH.stem)
shutil.make_archive(zip_path, "zip", out_dir)
print(f"📦 Downloading {zip_path}.zip ...")
files.download(f"{zip_path}.zip")
```
#### Convert to Markdown 4 w/ PIL
```python
import os
import pathlib
import shutil
from google.colab import files

import torch
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from PIL import Image

print("🧹 Cleaning up old files...")
shutil.rmtree("input_pdfs", ignore_errors=True)
shutil.rmtree("output_results", ignore_errors=True)
os.makedirs("input_pdfs", exist_ok=True)
os.makedirs("output_results", exist_ok=True)

# ── Upload ─────────────────────────────────────────────────────
print("📤 Upload your PDF:")
uploaded = files.upload()

uploaded_filename = list(uploaded.keys())[0]
dest = f"input_pdfs/{uploaded_filename}"
os.rename(uploaded_filename, dest)
print(f"✅ Saved strictly as → {dest}")

# ── Load models onto GPU ───────────────────────────────────────
print("\nLoading models onto GPU…")
model_dict = create_model_dict()
print("✅ Models loaded")

# ── Convert ────────────────────────────────────────────────────
PDF_PATH = pathlib.Path(dest)
print(f"\n🚀 CONVERTING EXACT FILE: {PDF_PATH.name}")

converter = PdfConverter(
    config = {
        "output_format"    : "markdown",
        "extract_images"   : True,
        # The modern v1.5+ settings for DPI
        "lowres_image_dpi" : 144, # Keeps AI layout detection fast/stable
        "highres_image_dpi": 600, # Forces high-res rendering for vector crops
    },
    artifact_dict = model_dict,
)

rendered = converter(str(PDF_PATH))

# ── Save markdown + images ─────────────────────────────────────
out_dir = pathlib.Path("output_results") / PDF_PATH.stem
out_dir.mkdir(parents=True, exist_ok=True)

markdown = rendered.markdown

image_count = 0
for img_filename, img in rendered.images.items():
    old_stem = pathlib.Path(img_filename).stem
    new_filename = old_stem + ".png"
    img_path = out_dir / new_filename

    # Convert mode for PNG
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    
    # 🌟 MAC-STYLE SMOOTHING FIX 🌟
    # If the image is embedded and very small (e.g. width < 1200px), 
    # we upscale it using Lanczos anti-aliasing to remove the "fuzziness".
    if img.width < 1200:
        # Scale up by a factor of 3
        new_width = img.width * 3
        new_height = img.height * 3
        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    img.save(str(img_path), format="PNG")
    markdown = markdown.replace(img_filename, new_filename)
    image_count += 1

md_path = out_dir / (PDF_PATH.stem + ".md")
md_path.write_text(markdown, encoding="utf-8")

print(f"\n✅ Done!")
print(f"   Markdown  →  {md_path}  ({len(markdown):,} chars)")
print(f"   Images    →  {out_dir}/  ({image_count} files)")

zip_path = str(pathlib.Path("output_results") / PDF_PATH.stem)
shutil.make_archive(zip_path, "zip", out_dir)
print(f"📦 Downloading {zip_path}.zip ...")
files.download(f"{zip_path}.zip")
```
#### Final Convert MarkDown
```python
!pip install marker-pdf[full] -q

import torch

assert torch.cuda.is_available(), (
    "❌ No GPU detected! Go to Runtime → Change runtime type → T4 GPU and reconnect."
)
print(f"✅ GPU confirmed: {torch.cuda.get_device_name(0)}")
print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

```python
import os
import pathlib
import shutil
from google.colab import files

import torch
from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict

print("🧹 Cleaning up old files...")
shutil.rmtree("input_pdfs", ignore_errors=True)
shutil.rmtree("output_results", ignore_errors=True)
os.makedirs("input_pdfs", exist_ok=True)
os.makedirs("output_results", exist_ok=True)

# ── Upload ─────────────────────────────────────────────────────
print("📤 Upload your PDF:")
uploaded = files.upload()

uploaded_filename = list(uploaded.keys())[0]
dest = f"input_pdfs/{uploaded_filename}"
os.rename(uploaded_filename, dest)
print(f"✅ Saved strictly as → {dest}")

# ── Load models onto GPU ───────────────────────────────────────
print("\nLoading models onto GPU…")
model_dict = create_model_dict()
print("✅ Models loaded")

# ── Convert ────────────────────────────────────────────────────
PDF_PATH = pathlib.Path(dest)
print(f"\n🚀 CONVERTING EXACT FILE: {PDF_PATH.name}")

# Using only the native marker DPI settings
converter = PdfConverter(
    config = {
        "output_format"    : "markdown",
        "extract_images"   : True,
        "lowres_image_dpi" : 144, 
        "highres_image_dpi": 300, # This is the parameter meant to force high-res rendering
    },
    artifact_dict = model_dict,
)

rendered = converter(str(PDF_PATH))

# ── Save markdown + images ─────────────────────────────────────
out_dir = pathlib.Path("output_results") / PDF_PATH.stem
out_dir.mkdir(parents=True, exist_ok=True)

markdown = rendered.markdown

image_count = 0
for img_filename, img in rendered.images.items():
    old_stem = pathlib.Path(img_filename).stem
    new_filename = old_stem + ".png"
    img_path = out_dir / new_filename

    # Convert mode for PNG
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    
    # 🚫 NO PILLOW UPSCALER HERE. Saving raw extraction result.
    img.save(str(img_path), format="PNG")
    
    markdown = markdown.replace(img_filename, new_filename)
    image_count += 1

md_path = out_dir / (PDF_PATH.stem + ".md")
md_path.write_text(markdown, encoding="utf-8")

print(f"\n✅ Done!")
print(f"   Markdown  →  {md_path}  ({len(markdown):,} chars)")
print(f"   Images    →  {out_dir}/  ({image_count} files)")

zip_path = str(pathlib.Path("output_results") / PDF_PATH.stem)
shutil.make_archive(zip_path, "zip", out_dir)
files.download(f"{zip_path}.zip")
```
### Purpose
- The best thing to do is to be able to modify a PDF you're working with into your own words so that you can better understand it. It helps you actually work with the content.
### Ideas for Websites
- Use "Save to Markdown" through the Obsidian browser and then just reformat it
	- Reformatting required since the website seems to build built on `next.js` and you can't have 2 coding snippets in one block of code (unless of course I download some kind of extension)
	- The "Save to Markdown" doesn't always work though
- Extensions on Chrome
	- <mark style="background: #FF5582A6;">Webpage to Markdown</mark>
		- Obsidian does it better
	- <mark style="background: #FF5582A6;">Easy Scraper - One-click web scraper</mark>
		- Just gives you javascript or csv file.
- Obsidian Web Clipper
### Ideas for PDFs
- <mark style="background: #FF5582A6;">pdf2md</mark> [^1]
	- Upload a file and it converts a PDF to markdown
	- It doesn't seem to do any `$$$$` types of equations for obsidian 
- PaperFlow Github Repository[^2] [^3]
- marker-pdf 1.10.2[^4]
	- Running this seems to work.
	- This was created by Vik Paruchuri which was heavily optimized for textbooks and scientific papers 
	- This was able to do two-column scientific papers as well
- <mark style="background: #FFB86CA6;">Microsoft markitdown</mark>[^5]
	- Setup
		- Installation
			- `pip install 'markitdown[all]'`
		- PDF to Markdown
			- `markitdown path-to-file.pdf > document.md`
	- Didn't seem to work. Might need to use plugins
- <mark style="background: #FF5582A6;">pdfmd</mark> [^6] [^7]
	- Creator says it doesn't work well for multiple columns
- Docling
	- Seems like this is another good one 
	- Doesn't seem worth testing though + takes 10x longer than marker-pdf
#### Findings
- Mistral OCR
	- Pretty Buggy
- marker-pdf
	- Better than Mistral OCR. Two files were basically identical (with a small artifact on page 10.)
	- Converts images better than mistral OCR
	- It's very good on google collab. Was able to take care of a single-column research paper pretty well
- Marker PDF to MD
	- Using the Mistral API, it doesn't work that well. Formatting is really bad (similar to if I used the original OCR). It is fast though which is nice, but doesn't format 100% correctly.
#### Requirements
- Able to convert a paper to markdown (would be nice to get images as well but I guess optional)
	- Example of non-two column paper
		- https://arxiv.org/pdf/2202.00023
	- Two column paper
		- https://arxiv.org/pdf/1504.00005
		- https://arxiv.org/pdf/2603.12214
## References

[^1]: https://pdf2md.morethan.io/
[^2]: https://github.com/TylerMorrison21/paperflow?tab=readme-ov-file
[^3]: https://www.reddit.com/r/ObsidianMD/comments/1rrpo2k/update_from_last_post_open_sourced_tool_help/
[^4]: https://pypi.org/project/marker-pdf/
[^5]: https://github.com/microsoft/markitdown
[^6]: https://www.reddit.com/r/ObsidianMD/comments/1onzm2u/opensource_pdf_to_markdown_converter_offline/
[^7]: https://github.com/M1ck4/pdfmd