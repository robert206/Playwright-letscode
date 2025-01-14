#!/usr/bin/env bash

if [[ -z $1 ]];
then
    echo "Usage: $0"
    echo "-d  <Mandatory> Output directory where logs are stored."
    echo "-n <Mandatory> Namespace example:aipron."
    echo "-p <optional> Fetch previous pod logs."
    echo "IMPORTANT:Import kube config into your env path before running script"
    exit
fi

while getopts d:n:p option
do
    case "${option}"
        in
        d)directory=${OPTARG};;
        n)namespace=${OPTARG};;
        p)previous=${OPTARG}
         previous=true
         ;;
        ?)
         echo "Invalid option"
         exit 1
         ;;
    esac
done

if [ ! -d $directory ]; then
  echo "Directory does not exists.Creating subdirectory in current directory."
  mkdir $directory
fi

if [ -z "${previous}" ]
then
   for pod in $(kubectl get pods -n $namespace | cut -f 1 -d ' '); do
     echo -------------------------------------------------------------
     echo "Fetching log for $pod"
     echo -------------------------------------------------------------
     kubectl logs -n $namespace $pod --all-containers > $directory/$pod.log
   done
else
   for pod in $(kubectl get pods -n $namespace | cut -f 1 -d ' '); do
     echo -----------------------------------------------
     echo "Fetching log for $pod"
     echo ----------------------------------------------
     kubectl logs -n $namespace $pod -p --all-containers > $directory/"$pod"_previous.log
   done
   ##cleanup if empty files are created in case of option -p not returning previous pods
   find $directory  -size 0 -print -delete
   echo "Deleted empty logs from non-existing previous pods. "
fi

count=$(ls -la $directory | wc -l)
echo "Fetched $count logs for namespace $namespace"
