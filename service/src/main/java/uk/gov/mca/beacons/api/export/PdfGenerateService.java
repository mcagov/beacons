package uk.gov.mca.beacons.api.export;

import com.lowagie.text.DocumentException;
import java.io.*;
import java.util.Map;
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

    renderer.createPDF(out, true);

    out.close();

    return out;
  }
}
