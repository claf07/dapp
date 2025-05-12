class ValidationService {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateBloodType(bloodType) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return validBloodTypes.includes(bloodType);
  }

  static validateOrganType(organType) {
    const validOrgans = [
      'kidney',
      'liver',
      'heart',
      'lung',
      'pancreas',
      'intestine',
      'cornea',
      'bone_marrow'
    ];
    return validOrgans.includes(organType.toLowerCase());
  }

  static validateMedicalData(data) {
    const requiredFields = [
      'bloodType',
      'organType',
      'urgency',
      'compatibilityFactors'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }

  static validateHospitalData(data) {
    const requiredFields = [
      'name',
      'address',
      'licenseNumber',
      'contactInfo'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }

  static validateDonorRegistration(data) {
    const requiredFields = [
      'name',
      'email',
      'bloodType',
      'organType',
      'medicalHistory'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }

  static validatePatientRegistration(data) {
    const requiredFields = [
      'name',
      'email',
      'bloodType',
      'organType',
      'urgency',
      'medicalHistory'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }

  static validateDeathVerification(data) {
    const requiredFields = [
      'donorId',
      'hospitalId',
      'verificationDetails',
      'timestamp'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }

  static validateMatchAcceptance(data) {
    const requiredFields = [
      'matchId',
      'acceptorId',
      'acceptanceDetails',
      'timestamp'
    ];

    return requiredFields.every(field => data[field] !== undefined);
  }
}

export default ValidationService; 