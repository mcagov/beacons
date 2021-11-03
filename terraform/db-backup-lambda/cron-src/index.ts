import {
  RDSClient,
  CreateDBSnapshotCommand,
  waitUntilDBSnapshotAvailable,
  StartExportTaskCommand,
  DescribeDBSnapshotsCommand
} from '@aws-sdk/client-rds';

export const handler = async (): Promise<void> => {
  const SNAPSHOT_BUCKET = process.env.SNAPSHOT_BUCKET as string;
  const IAM_ROLE_ARN = process.env.IAM_ROLE_ARN as string;
  const KMS_KEY_ID = process.env.KMS_KEY_ID as string;

  const date = new Date();
  const formattedDate = date.toISOString().split('T')[0];
  const snapshotIdentifier = `dev-backup-${formattedDate}`;

  const client = new RDSClient({ region: process.env.REGION as string });

  // create the snapshot
  const dbSnapshotCommand = new CreateDBSnapshotCommand({
    DBInstanceIdentifier: 'dev-beacons-database',
    DBSnapshotIdentifier: snapshotIdentifier
  });
  const response = await client.send(dbSnapshotCommand);

  const describeDbCommand = new DescribeDBSnapshotsCommand({
    DBSnapshotIdentifier: snapshotIdentifier
  });
  const dbSnapshotOutput = await client.send(describeDbCommand);

  // wait for snapshot to complete
  await waitUntilDBSnapshotAvailable(
    { client: client, maxWaitTime: 850 },
    dbSnapshotOutput
  );

  // export the snapshot to s3
  const s3ExportCommand = new StartExportTaskCommand({
    SourceArn: response.DBSnapshot!.DBSnapshotArn,
    S3BucketName: SNAPSHOT_BUCKET,
    S3Prefix: formattedDate,
    ExportTaskIdentifier: snapshotIdentifier,
    IamRoleArn: IAM_ROLE_ARN,
    KmsKeyId: KMS_KEY_ID
  });

  await client.send(s3ExportCommand);
};
