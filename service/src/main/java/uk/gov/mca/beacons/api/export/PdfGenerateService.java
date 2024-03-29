package uk.gov.mca.beacons.api.export;

import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.AreaBreak;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.AreaBreakType;
import com.itextpdf.layout.properties.TextAlignment;
import java.io.*;
import java.util.Iterator;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import uk.gov.mca.beacons.api.export.rest.LabelDTO;

@Service("PdfGenerateService")
public class PdfGenerateService {

  private Logger logger = LoggerFactory.getLogger(PdfGenerateService.class);

  public PdfGenerateService() {}

  public byte[] createPdfLabel(LabelDTO data) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    addLabelToDocument(document, data);

    document.close();
    baos.close();

    return baos.toByteArray();
  }

  public byte[] createPdfLabels(List<LabelDTO> dataList) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    for (Iterator<LabelDTO> data = dataList.iterator(); data.hasNext();) {
      addLabelToDocument(document, data.next());
      if (data.hasNext()) {
        document.add(new AreaBreak(AreaBreakType.NEXT_PAGE));
      }
    }

    document.close();
    baos.close();

    return baos.toByteArray();
  }

  @NotNull
  private Document createLabelDocument(PdfDocument pdf) {
    Document document = new Document(pdf);
    float width = 1.6f * 72;
    float height = 1.1f * 72;

    pdf.setDefaultPageSize(new PageSize(width, height));
    document.setMargins(6, 0, 4, 12);
    document.setTextAlignment(TextAlignment.LEFT);
    return document;
  }

  private void addLabelToDocument(Document document, LabelDTO data) {
    boolean isLongHexId =
      data.getHexId() != null && data.getHexId().length() > 15;

    document.add(
      new Paragraph("UK 406 MHz Beacon Registry")
        .setFontSize(7f)
        .setBold()
        .setMargin(0)
        .setPadding(0)
        .setFixedLeading(7f)
    );

    document.add(
      new Paragraph("24 Hr Tel: " + data.getMcaContactNumber())
        .setFontSize(6.7f)
        .setUnderline(0.5f, -2.5f)
        .setBold()
        .setMargin(0)
        .setPadding(0)
    );

    document.add(
      new Paragraph(
        data
          .getBeaconUse()
          .toUpperCase()
          .substring(
            0,
            Math.min(
              data.getBeaconUse().toUpperCase().length(),
              isLongHexId ? 40 : 30
            )
          )
      )
        .setFontSize(isLongHexId ? 6f : 7.5f)
        .setBold()
        .setTextAlignment(TextAlignment.CENTER)
        .setMargins(2, 3, 2, 3)
    );

    document.add(
      getLabelDataLine(
        isLongHexId ? null : "Hex Id",
        data.getHexId().toUpperCase(),
        isLongHexId ? 6.25f : 7.5f
      )
    );

    document.add(
      getLabelDataLine(
        "Coding",
        data
          .getCoding()
          .toUpperCase()
          .substring(0, Math.min(data.getCoding().toUpperCase().length(), 12)),
        isLongHexId ? 6.25f : 7.25f
      )
    );
    document.add(
      getLabelDataLine(
        "Proof of Registration",
        data.getProofOfRegistrationDate(),
        isLongHexId ? 6.25f : 7.25f
      )
    );
  }

  private Paragraph getLabelDataLine(String key, String value, float fontSize) {
    if (value == null) {
      value = "";
    }

    Paragraph p = new Paragraph()
      .setMargin(0)
      .setPadding(0)
      .setFixedLeading(8.5f);
    p.setCharacterSpacing(0.5f).setWordSpacing(0.01f);

    if (key != null && !key.isEmpty()) {
      p.add(new Text(key + ": ").setFontSize(5f).setBold());
    }
    p.add(new Text(value.toUpperCase()).setFontSize(fontSize).setBold());
    return p;
  }
}
