const calculateCompatibilityScore = (patient, donor) => {
  let score = 0;
  const maxScore = 100;

  // Blood type compatibility (40% of total score)
  const bloodTypeScore = calculateBloodTypeCompatibility(patient.bloodGroup, donor.bloodGroup);
  score += bloodTypeScore * 0.4;

  // Age compatibility (20% of total score)
  const ageScore = calculateAgeCompatibility(patient.age, donor.age);
  score += ageScore * 0.2;

  // Physical compatibility (20% of total score)
  const physicalScore = calculatePhysicalCompatibility(patient, donor);
  score += physicalScore * 0.2;

  // Medical history compatibility (20% of total score)
  const medicalScore = calculateMedicalCompatibility(patient, donor);
  score += medicalScore * 0.2;

  return Math.round(score);
};

const calculateBloodTypeCompatibility = (patientBlood, donorBlood) => {
  const compatibilityMatrix = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
  };

  return compatibilityMatrix[patientBlood]?.includes(donorBlood) ? 100 : 0;
};

const calculateAgeCompatibility = (patientAge, donorAge) => {
  const ageDiff = Math.abs(patientAge - donorAge);
  if (ageDiff <= 5) return 100;
  if (ageDiff <= 10) return 80;
  if (ageDiff <= 15) return 60;
  if (ageDiff <= 20) return 40;
  return 20;
};

const calculatePhysicalCompatibility = (patient, donor) => {
  let score = 0;
  
  // Height compatibility
  const heightDiff = Math.abs(patient.height - donor.height);
  if (heightDiff <= 5) score += 50;
  else if (heightDiff <= 10) score += 30;
  else if (heightDiff <= 15) score += 20;
  else score += 10;

  // Weight compatibility
  const weightDiff = Math.abs(patient.weight - donor.weight);
  if (weightDiff <= 5) score += 50;
  else if (weightDiff <= 10) score += 30;
  else if (weightDiff <= 15) score += 20;
  else score += 10;

  return score;
};

const calculateMedicalCompatibility = (patient, donor) => {
  // This would typically involve more complex medical history analysis
  // For now, we'll use a simplified scoring system
  let score = 100;

  // Reduce score based on medical history factors
  if (donor.medicalHistory?.hasChronicDisease) score -= 30;
  if (donor.medicalHistory?.hasSmokingHistory) score -= 20;
  if (donor.medicalHistory?.hasAlcoholHistory) score -= 20;

  return Math.max(0, score);
};

const findBestMatches = (patient, donors) => {
  return donors
    .map(donor => ({
      donor,
      score: calculateCompatibilityScore(patient, donor)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Return top 5 matches
};

module.exports = {
  calculateCompatibilityScore,
  findBestMatches
}; 