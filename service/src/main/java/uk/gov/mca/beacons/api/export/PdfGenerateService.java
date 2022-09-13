package uk.gov.mca.beacons.api.export;

import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.utils.PdfMerger;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.lowagie.text.DocumentException;
import java.io.*;
import java.util.Map;
import javax.swing.text.StyleConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Service("PdfGenerateService")
public class PdfGenerateService {

  private Logger logger = LoggerFactory.getLogger(PdfGenerateService.class);

  ClassLoaderTemplateResolver templateResolver;
  TemplateEngine templateEngine;

  public PdfGenerateService() {
    templateResolver = new ClassLoaderTemplateResolver();
    templateResolver.setSuffix(".html");
    templateResolver.setTemplateMode(TemplateMode.HTML);
    templateResolver.setPrefix("templates/");

    templateEngine = new TemplateEngine();
    templateEngine.setTemplateResolver(templateResolver);
  }

  public ByteArrayOutputStream generatePdf(
    String templateName,
    Map<String, Object> data
  ) throws DocumentException, IOException {
    ByteArrayOutputStream out = new ByteArrayOutputStream();

    Context context = new Context();
    context.setVariables(data);

    String html = templateEngine.process(templateName, context);

    ITextRenderer renderer = new ITextRenderer();
    renderer.setDocumentFromString(html);
    renderer.layout();
    //
    //    renderer.createPDF(out, true);

    out.close();

    return out;
  }

  public byte[] createLabelPdf(Map<String, Object> data) throws IOException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    PdfDocument pdf = new PdfDocument(new PdfWriter(baos));
    Document document = new Document(pdf);
    float width = 1.68f * 72;
    float height = 1.18f * 72;

    pdf.setDefaultPageSize(new PageSize(width, height));
    document.setMargins(2, 0, 2, 0);
    document.setTextAlignment(TextAlignment.CENTER);

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

    document.close();
    baos.close();

    return baos.toByteArray();
  }

  private Paragraph getLabelDataLine(String key, String value) {
    Paragraph p = new Paragraph().setMargin(0);
    p.add(new Text(key + ": ").setFontSize(6));
    p.add(new Text(value).setFontSize(8).setBold());
    return p;
  }
}
