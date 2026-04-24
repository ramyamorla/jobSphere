export const emptyCreateJobRequest = {
  title: "",
  companyName: "",
  location: "Hyderabad",
  jobType: "Full-time",
  workMode: "Onsite",
  experienceLevel: "Mid",
  minSalary: 600000,
  maxSalary: 1200000,
  salaryCurrency: "INR",
  totalPositions: 3,
  requiredSkills: "",
  postedByRecruiterId: ""
};

export const emptyJobFilters = {
  keyword: "",
  location: "",
  jobType: "",
  workMode: "",
  minSalary: ""
};

export const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship"];
export const workModeOptions = ["Onsite", "Hybrid", "Remote"];
export const experienceOptions = ["Entry", "Mid", "Senior", "Lead"];
export const locationOptions = ["Hyderabad", "Bangalore", "Chennai", "Pune", "Delhi", "Mumbai", "Remote"];
