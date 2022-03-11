#!/usr/bin/env bash

# Every 15 seconds until 10 minutes has elapsed
    # Get image tags of running ECS containers
    # If all image tags == DESIRED_IMAGE_TAG exit 0 (success)
# Finally, exit 1 (failure)

poll_attempts=15

while [ $poll_attempts -gt 0 ] ; do
  # Get descriptions of every running task
  tasks="($(aws ecs describe-tasks \
    --cluster $TF_WORKSPACE-mca-beacons-cluster \
    --output text \
    --query "tasks[].containers[].[image]" \
    --tasks `aws ecs list-tasks --cluster $TF_WORKSPACE-mca-beacons-cluster --desired-status RUNNING --query taskArns --output text`)"
  IFS='' read -a arr <<< "$tasks"

  # Check each deployed tasks matched $DESIRED_IMAGE_TAG
  matches=1
  for task in "${arr[@]}"
  do
    image_tag=$(echo "$task" | grep -Eo ':\S+$'  | tr -d ':')
    if [[ $image_tag != $DESIRED_IMAGE_TAG ]]
    then
      echo "Task" $task "does not match" $DESIRED_IMAGE_TAG "Waiting..."
      matches=0
      break
    fi
  done

  if [ $matches -eq 1 ]
  then
    echo "Version " $DESIRED_IMAGE_TAG " is deployed!  Exiting..."
    exit 0
  fi

  # Try again if not
  ((poll_attempts--))
  sleep 60
done

echo "Timed out while waiting for" $DESIRED_IMAGE_TAG "to be deployed"
exit 1