import Cluster from "../models/Cluster";

export const addClusterDets = (clusterID, cluster_type, comments, created_by, created_date) =>{
    const newcluster = new Cluster({clusterID, cluster_type, comments, created_by, created_date})
    await newcluster.save()

    console.log("New cluster details added")
}