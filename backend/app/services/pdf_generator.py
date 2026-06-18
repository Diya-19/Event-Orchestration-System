from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from datetime import datetime
import tempfile
import os



def generate_certificate(
    participant_name,
    institution_name,
    event_name
):
    pdf_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    c = canvas.Canvas(
        pdf_file.name,
        pagesize=landscape(A4)
    )

    width, height = landscape(A4)

    # Certificate Template
    template_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "assets",
            "certificate_template.png"
        )
    )

    certificate_bg = ImageReader(template_path)

    # Background Image
    c.drawImage(
        certificate_bg,
        0,
        0,
        width=width,
        height=height
    )

    today = datetime.now().strftime("%d %B %Y")
# =========================
    # PARTICIPANT NAME
    # =========================
    c.setFont("Times-BoldItalic", 42)
    c.setFillColorRGB(0.05, 0.09, 0.15)
    c.drawCentredString(
        width / 2,
        340,  # This stays perfect!
        participant_name
    )

    # =========================
    # INSTITUTION NAME
    # =========================
    c.setFont("Helvetica-Bold", 18)
    c.setFillColorRGB(0.05, 0.09, 0.15)
    c.drawCentredString(
        width / 2,
        267,  # Hard jump to yank IGDTUW completely ABOVE that dotted line
        institution_name
    )

    # =========================
    # EVENT NAME
    # =========================
    c.setFont("Times-Bold", 24)
    c.setFillColorRGB(0.05, 0.09, 0.15)
    c.drawCentredString(
        width / 2,
        192,  # Strong pull upward to clear the lower solid line entirely
        event_name
    )
    # DATE
    c.setFont("Times-Roman", 14)
    c.drawCentredString(
    260,
    90,
    today
    )
    c.save()

    return pdf_file.name