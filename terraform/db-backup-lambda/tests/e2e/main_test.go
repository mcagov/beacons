package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/aws/aws-sdk-go/service/s3/s3manager"

	awssdk "github.com/aws/aws-sdk-go/aws"
	"github.com/gruntwork-io/terratest/modules/aws"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/retry"
	"github.com/gruntwork-io/terratest/modules/terraform"
	"github.com/stretchr/testify/assert"
)

// This is an e2e test it will spin the entire infrastrucure up
func TestMain(t *testing.T) {
	t.Parallel()

	terraformOptions, awsRegion, terraformStateBucket := setupTest(t)

	// Run `terraform init` and `terraform apply`. Fail the test if there are any errors.
	terraform.InitAndApply(t, terraformOptions)

	snapshotBucket := terraform.Output(t, terraformOptions, "s3_bucket_db_snapshot_id")
	uploadParquet(t, terraformOptions, awsRegion, snapshotBucket, "../fixtures/userdata1.parquet")

	csvBucket := terraform.Output(t, terraformOptions, "s3_bucket_csv_id")

	currentTime := time.Now().Local()
	formattedCurrentTime := currentTime.Format("2006-01-02")
	fileContents, err := checkS3ForCSV(t, terraformOptions, awsRegion, csvBucket, formattedCurrentTime+"/test/output.csv")
	if err != nil {
		t.Fail()
	}
	defer cleanupTest(t, awsRegion, []string{terraformStateBucket}, []string{csvBucket, snapshotBucket}, terraformOptions)

	assertions(t, fileContents)
}

func checkS3ForCSV(t *testing.T, terraformOptions *terraform.Options, awsRegion string, csvBucket string, s3ObjectKey string) (string, error) {
	// need to wrap this in retry.DoWithRetryE()
	getS3ObjectFn := getS3Object(t, awsRegion, csvBucket, s3ObjectKey)

	result, err := retry.DoWithRetryE(t, "get output of lambda from s3 bucket", 30, 2*time.Second, getS3ObjectFn)
	if err != nil {
		log.Println(err)
		return "", err
	}

	return result, nil
}

func getS3Object(t *testing.T, awsRegion string, bucketName string, s3ObjectKey string) func() (string, error) {
	return func() (string, error) {
		fileContents, err := aws.GetS3ObjectContentsE(t, awsRegion, bucketName, s3ObjectKey)
		if err != nil {
			log.Println(err, fileContents)
			return "", err
		}

		return fileContents, nil
	}
}

func cleanupS3Bucket(t *testing.T, awsRegion string, bucketName string) {
	aws.EmptyS3Bucket(t, awsRegion, bucketName)
	aws.DeleteS3Bucket(t, awsRegion, bucketName)
}

func cleanupTest(t *testing.T, awsRegion string, buckets []string, emptyBuckets []string, terraformOptions *terraform.Options) {
	// At the end of the test, run `terraform destroy` to clean up any resources that were created.
	for _, bucket := range emptyBuckets {
		aws.EmptyS3Bucket(t, awsRegion, bucket)
	}

	terraform.Destroy(t, terraformOptions)

	defer func() {
		for _, bucket := range buckets {
			cleanupS3Bucket(t, awsRegion, bucket)
		}
	}()
}

func setupTest(t *testing.T) (*terraform.Options, string, string) {
	// we need to create a bucket and supply this as the back end so we don't overwrite any existing
	// infrastructure
	awsRegion := "eu-west-2"
	uniqueId := random.UniqueId()

	// Create an S3 bucket where we can store state
	terraformStateBucket := fmt.Sprintf("terratest-beacons-db-backup-lambda-terraform-state-%s", strings.ToLower(uniqueId))
	aws.CreateS3Bucket(t, awsRegion, terraformStateBucket)

	// Construct the terraform options with default retryable errors to handle the most common
	// retryable errors in terraform testing.
	return terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		// The path to where our Terraform code is located
		TerraformDir: "../..",
		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"name":   strings.ToLower(uniqueId[:4]),
			"region": awsRegion,
		},
		BackendConfig: map[string]interface{}{
			"bucket": terraformStateBucket,
			"key":    "beacons-db-backup-lambda.tfstate",
			"region": awsRegion,
		},
		Reconfigure: true,
	}), awsRegion, terraformStateBucket
}

func uploadParquet(t *testing.T, terraformOptions *terraform.Options, region string, bucket string, filename string) error {
	uploader := aws.NewS3Uploader(t, region)
	r := strings.NewReader("Hello, Reader!")

	f, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("failed to open file %q, %v", filename, err)
	}

	defer f.Close()

	// Upload the file to S3.
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: awssdk.String(bucket),
		Key:    awssdk.String("test/part-00000-7071a190-10a8-42ac-ba5e-8b19b7cef981-c000.gz.parquet"),
		Body:   f,
	})

	defer uploader.Upload(&s3manager.UploadInput{
		Bucket: awssdk.String(bucket),
		Key:    awssdk.String("test/_SUCCESS"),
		Body:   r,
	})

	if err != nil {
		return fmt.Errorf("failed to upload file, %v", err)
	}

	fmt.Printf("file uploaded to, %s\n", result.Location)
	return nil
}

func assertions(t *testing.T, fileContents string) {
	f, err := ioutil.ReadFile("../fixtures/userdata1.expected.csv")
	if err != nil {
		log.Printf("failed to open file %v", err)
		t.Fail()
	}

	assert.Equal(t, string(f), fileContents)
}
