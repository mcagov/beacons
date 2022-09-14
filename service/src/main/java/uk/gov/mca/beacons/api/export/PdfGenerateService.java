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
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service("PdfGenerateService")
public class PdfGenerateService {

  private Logger logger = LoggerFactory.getLogger(PdfGenerateService.class);

  public PdfGenerateService() {}

  public byte[] createPdfLabel(Map<String, Object> data) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    addLabelToDocument(document, data);

    document.close();
    baos.close();

    return baos.toByteArray();
  }

  public byte[] createPdfLabels(List<Map<String, Object>> dataList)
    throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    for (
      Iterator<Map<String, Object>> data = dataList.iterator();
      data.hasNext();
    ) {
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
    float width = 1.68f * 72;
    float height = 1.18f * 72;

    pdf.setDefaultPageSize(new PageSize(width, height));
    document.setMargins(2, 0, 2, 0);
    document.setTextAlignment(TextAlignment.CENTER);
    return document;
  }

  private void addLabelToDocument(Document document, Map<String, Object> data) {
    document.add(
      new Paragraph("UK 406 MHz Beacon Registry").setFontSize(9).setMargin(0)
    );
    document.add(
      new Paragraph("24 Hr Tel: " + data.get("contactNumber"))
        .setFontSize(8)
        .setUnderline()
        .setMargin(0)
    );
    document.add(
      new Paragraph(data.get("name").toString())
        .setFontSize(8)
        .setBold()
        .setMargins(4, 0, 4, 0)
    );

    document.add(getLabelDataLine("Hex ID", data.get("hexId").toString()));
    document.add(getLabelDataLine("Coding", data.get("coding").toString()));
    document.add(
      getLabelDataLine(
        "Proof of Registration",
        data.get("lastModifiedDate").toString()
      )
    );
  }

  private Paragraph getLabelDataLine(String key, String value) {
    Paragraph p = new Paragraph().setMargin(0);
    p.add(new Text(key + ": ").setFontSize(6));
    p.add(new Text(value).setFontSize(8).setBold());
    return p;
  }
}
