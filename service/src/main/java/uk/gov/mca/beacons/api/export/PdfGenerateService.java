package uk.gov.mca.beacons.api.export;

import com.itextpdf.io.font.constants.StandardFontFamilies;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
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

  public byte[] createPdfLabel(Map<String, String> data) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    addLabelToDocument(document, data);

    document.close();
    baos.close();

    return baos.toByteArray();
  }

  public byte[] createPdfLabels(List<Map<String, String>> dataList)
    throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = createLabelDocument(pdf);

    for (
      Iterator<Map<String, String>> data = dataList.iterator();
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
    float width = 1.6f * 72;
    float height = 1.1f * 72;

    pdf.setDefaultPageSize(new PageSize(width, height));
    document.setMargins(2, 4, 2, 4);
    //    PdfFont arial = PdfFontFactory.register("Arial.tff");

    document.setTextAlignment(TextAlignment.CENTER);
    //    document.setFont()
    return document;
  }

  private void addLabelToDocument(Document document, Map<String, String> data) {
    document.add(
      new Paragraph("UK 406 MHz Beacon Registry")
        .setFontSize(7)
        .setBold()
        .setMargin(0)
    );
    document.add(
      new Paragraph("24 Hr Tel: " + data.get("contactNumber"))
        .setFontSize(6.5f)
        .setUnderline()
        .setBold()
        .setMargin(0)
    );
    document.add(
      new Paragraph(data.get("name"))
        .setFontSize(6.5f)
        .setBold()
        .setMargins(4, 4, 2, 4)
    );

    document.add(getLabelDataLine("Hex ID", data.get("hexId")));
    document.add(getLabelDataLine("Coding", data.get("coding")));
    document.add(
      getLabelDataLine("Proof of Registration", data.get("lastModifiedDate"))
    );
  }

  private Paragraph getLabelDataLine(String key, String value) {
    Paragraph p = new Paragraph().setMargin(0).setPadding(0);
    p.add(new Text(key + ": ").setFontSize(5.5f).setBold());
    p.add(new Text(value).setFontSize(6.5f).setBold());
    return p;
  }
}
