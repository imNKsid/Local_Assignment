import { useSelector } from "react-redux";
import { RootState } from "../store";

const getJobsSuccess = (): any => {
  const getJobsSuccess = useSelector(
    (state: RootState) => state.jobs.getJobsSuccess
  );
  return getJobsSuccess;
};

const jobsList = (): any => {
  const jobsList = useSelector((state: RootState) => state.jobs.jobsList);
  return jobsList;
};

const getJobsFailure = (): any => {
  const getJobsFailure = useSelector(
    (state: RootState) => state.jobs.getJobsFailure
  );
  return getJobsFailure;
};

const JobsSelector = {
  getJobsSuccess,
  jobsList,
  getJobsFailure,
};

export default JobsSelector;
