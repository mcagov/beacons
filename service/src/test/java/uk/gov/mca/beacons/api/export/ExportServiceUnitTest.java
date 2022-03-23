package uk.gov.mca.beacons.api.export;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

import static org.mockito.BDDMockito.then;

import java.io.File;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.core.io.Resource;

@ExtendWith(MockitoExtension.class)
public class ExportServiceUnitTest {
    @Mock(name="simpleAsyncJobLauncher")
    private JobLauncher asyncJobLauncher;

    @Mock
    private JobLauncher jobLauncher;

    @Mock
    private Job exportToSpreadsheetJob;

    @Mock
    private Resource csvExportFile;

    @InjectMocks
    ExportService exportService;

    @Test
    public void whenThereIsNoPreviouslyExportedSpreadsheet_ThenStartExportingAndReturnNull() throws IOException, JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
        given(csvExportFile.exists()).willReturn(false);
        given(csvExportFile.getFile()).willReturn(new File("/tmp/directory/does-not/exist.csv"));

        Resource export = exportService.getLatestExcelExport();

        assertThat(export, nullValue());
        then(asyncJobLauncher).should().run(eq(exportToSpreadsheetJob), any());
    }

    @Test
    public void whenThereIsAPreviouslyExportedSpreadsheet_ThenReturnTheExport() throws IOException, JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
        given(csvExportFile.exists()).willReturn(true);

        Resource actualCsvExportFile = exportService.getLatestExcelExport();

        assertThat(actualCsvExportFile, is(csvExportFile));
    }
}
